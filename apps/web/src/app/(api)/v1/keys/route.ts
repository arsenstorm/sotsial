// Next
import { type NextRequest, NextResponse } from "next/server";

// Better Auth
import { auth } from "@/auth";
import { authorise } from "@/utils/auth/authorise";

const listKeys = async (request: NextRequest) => {
	const { valid, userId, type } = await authorise(request);

	// Deny requests from API keys - This is a dashboard only API
	if (!valid || !userId || type === "api") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const keys = await auth.api.listApiKeys({
		query: {
			userId,
		},
	});

	return NextResponse.json(keys);
};

const createKey = async (request: NextRequest) => {
	const { valid, userId, type } = await authorise(request);

	// Deny requests from API keys - This is a dashboard only API
	if (!valid || !userId || type === "api") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { name } = await request.json();

	const key = await auth.api.createApiKey({
		body: {
			userId,
			name,
		},
	});

	return NextResponse.json(key);
};

const deleteKey = async (request: NextRequest) => {
	const { valid, userId, type } = await authorise(request);

	// Deny requests from API keys - This is a dashboard only API
	if (!valid || !userId || type === "api") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const id = request.nextUrl.searchParams.get("id");

	if (!id) {
		return NextResponse.json({ error: "No key ID provided" }, { status: 400 });
	}

	try {
		const { success } = await auth.api.deleteApiKey({
			body: {
				keyId: id,
				userId,
			},
		});

		if (!success) {
			return NextResponse.json(
				{ error: "Failed to delete key" },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				data: {
					message: "Key deleted",
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to delete key" },
			{ status: 500 },
		);
	}
};

export const GET = listKeys;
export const POST = createKey;
export const DELETE = deleteKey;
