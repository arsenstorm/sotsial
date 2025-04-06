import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const response = NextResponse.next({
		request,
	});

	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map)$).*)",
	],
};
