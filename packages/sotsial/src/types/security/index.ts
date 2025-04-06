/**
 * Arguments for the `getCodeChallenge` function
 */
export interface GetCodeChallengeProps
	extends Readonly<{
		code: string;
	}> {}

/**
 * Arguments for the `csrf.verify` function
 */
export interface VerifyCsrfTokenProps
	extends Readonly<{
		id: string;
		secret: string;
	}> {}

/**
 * The generated CSRF token response
 */
export interface GeneratedCsrfTokenResponse {
	id: string;
	secret: string;
	expires: Date;
}

/**
 * The verified CSRF token response
 */
export interface VerifiedCsrfTokenResponse {
	valid: boolean;
	message?: string;
}
