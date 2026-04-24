export interface ErrorResponse {
  code?: string;
  details?: Record<string, any>;
  hint?: string;
  message: string;
  status?: number;
}
