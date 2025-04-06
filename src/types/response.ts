import type { ErrorResponse } from "@/types/error";

export interface Response<T> {
	data: T;
	error: ErrorResponse | null;
}
