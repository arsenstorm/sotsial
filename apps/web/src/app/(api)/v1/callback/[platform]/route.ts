// Sotsial
import { getSotsial } from "@/config/sotsial";
import { decrypt, encrypt } from "sotsial/utils";

// Next
import { type NextRequest, NextResponse } from "next/server";
import { createSupaClient } from "@/utils/supabase/supa";
import { getCredentials } from "@/utils/credentials/get";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ platform: string }> },
) {
	const { platform } = await params;

	const token = request.cookies.get("sotsial")?.value ?? undefined;
	const [grantId, csrfToken = "", redirect = ""] = token?.split("|") ?? [];

	const code = request.nextUrl.searchParams.get("code") ?? undefined;

	if (!code) {
		return NextResponse.json({ error: "Missing code" }, { status: 400 });
	}

	const supa = createSupaClient();
	const { data: grantData, error: grantError } = await supa
		.from("grants")
		.select("csrf_token, tags, user_id, credential, expiry")
		.eq("id", grantId)
		.eq("platform", platform)
		.maybeSingle();

	if (grantError) {
		return NextResponse.json({ error: grantError.message }, { status: 500 });
	}

	if (!grantData) {
		return NextResponse.json(
			{ error: "Forbidden - Invalid Session" },
			{ status: 403 },
		);
	}

	// check if the grant has expired
	if (grantData.expiry && new Date(grantData.expiry) < new Date()) {
		return NextResponse.json(
			{ error: "Forbidden - Grant expired" },
			{ status: 403 },
		);
	}

	const decryptedCsrfToken = await decrypt(grantData?.csrf_token, {
		secret: process.env.ENCRYPTION_KEY,
	});

	if (decryptedCsrfToken !== csrfToken) {
		return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
	}

	let credential: {
		user_id: string;
		platform: string;
		client_id: string;
		client_secret: string;
	} | null = null;

	if (grantData.credential) {
		const credentialData = await getCredentials(grantData.credential, {
			userId: grantData.user_id,
		});

		if (credentialData.length > 0) {
			credential = credentialData[0];
		}
	}

	const sotsial = getSotsial({
		platform,
		credential,
	});

	const provider = sotsial.providers.find((p) => p === platform);

	if (!provider) {
		return NextResponse.json({ error: "Provider not found" }, { status: 404 });
	}

	const { data, error } = await sotsial.exchange(provider, {
		code,
		csrf_token: csrfToken,
	});

	let errorOccurred = false;

	if (error) {
		errorOccurred = true;
	}

	if (!data) {
		errorOccurred = true;
	}

	if (!errorOccurred && data) {
		const connections = await Promise.all(
			(Array.isArray(data) ? data : [data]).map(async (d) => ({
				platform,
				credential: grantData.credential,
				user_id: grantData.user_id,
				account_id: d.account_id,
				access_token: await encrypt(d.access_token, {
					secret: process.env.ENCRYPTION_KEY,
				}),
				refresh_token: await encrypt(d.refresh_token, {
					secret: process.env.ENCRYPTION_KEY,
				}),
				tags: grantData.tags,
				expiry: d.expiry,
				account: {
					avatar: d.details?.avatar_url ?? null,
					username: d.details?.username ?? null,
					name: d.details?.name ?? null,
				},
			})),
		);

		const { error: connectionError } = await supa
			.from("connections")
			.upsert(connections, {
				onConflict: "account_id,platform,user_id,credential",
				ignoreDuplicates: false,
			});

		if (connectionError) {
			console.error(connectionError);
			errorOccurred = true;
		}
	}

	const { error: updateError } = await supa
		.from("grants")
		.update({ status: errorOccurred ? "failed" : "success" })
		.eq("id", grantId);

	if (updateError) {
		console.error(updateError);
	}

	let response: NextResponse;

	if (redirect === "close" || redirect.trim() === "") {
		// close the popup
		response = new NextResponse(
			`<!DOCTYPE html>
			<html>
				<head>
					<title>Authentication Successful</title>
					<script>
						window.onload = function() {
							window.close();
							// In case window.close() doesn't work (some browsers block it)
							if (!window.closed) {
								document.body.innerHTML = '<p>Authentication successful! You can close this window now.</p>';
							}
						}
					</script>
				</head>
				<body>
					<p>Authentication successful! Closing window...</p>
				</body>
			</html>`,
			{
				status: 200,
				headers: {
					"Content-Type": "text/html",
				},
			},
		);
	} else {
		const url = new URL(redirect ?? "/", request.url);

		response = NextResponse.redirect(url.toString());
	}

	response.cookies.delete("sotsial");

	return response;
}
