export interface ErrorResponse {
  code?: string;
  details?: Record<string, unknown> | ErrorResponse[];
  hint?: string;
  message: string;
  status?: number;
}
