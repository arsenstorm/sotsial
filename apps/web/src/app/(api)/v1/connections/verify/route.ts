// Auth
import { authorise } from "@/utils/auth/authorise";

// Supabase
import { createSupaClient } from "@/utils/supabase/supa";

// Next
import { type NextRequest, NextResponse } from "next/server";

/**
 * Get the verification status of a grant
 *
 * @param request - The request object
 *
 * @returns The response
 */
const getVerificationStatus = async (request: NextRequest) => {
	const { valid, userId } = await authorise(request);

	if (!valid || !userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const grantId = request.nextUrl.searchParams.get("id");

	if (!grantId) {
		return NextResponse.json(
			{ error: "No grant ID provided" },
			{ status: 400 },
		);
	}

	const supa = createSupaClient();

	const { data, error } = await supa
		.from("grants")
		.select("user_id, status")
		.eq("id", grantId)
		.eq("user_id", userId)
		.maybeSingle();

	if (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 },
		);
	}

	if (!data) {
		return NextResponse.json({ error: "Invalid grant ID" }, { status: 404 });
	}

	return NextResponse.json({
		status: data.status,
	});
};

export const GET = getVerificationStatus;
