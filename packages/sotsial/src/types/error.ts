export interface ErrorResponse {
	message: string;
	status?: number;
	hint?: string;
	code?: string;
	details?: Record<string, any>;
}
