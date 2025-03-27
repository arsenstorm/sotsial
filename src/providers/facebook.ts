// Base
import Provider from "@/base/provider";

// Types
import type { Account } from "@/types/auth";
import type {
	ExchangeProps,
	ExchangeResponse,
	GrantProps,
	GrantResponse,
	ValidateProps,
	ValidateResponse,
} from "@/types/connect";
import type { Response } from "@/types/response";
import type { PublishProps } from "@/types/publish";
import type { RefreshAccessTokenProps } from "@/types/token";
import type { RefreshAccessTokenResponse } from "@/types/token";
import type { FacebookConfig, FacebookPage } from "@/types/providers";
import type { ErrorResponse } from "@/types/error";

// Security
import { timestamp } from "@/utils/timestamp";

export class Facebook extends Provider<FacebookConfig, Account> {
	private version: "v21.0" | "v22.0" = "v22.0";

	constructor({
		config,
		accounts,
	}: Readonly<{
		config: FacebookConfig;
		accounts?: Account | Account[];
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? [
					"pages_show_list",
					"publish_video",
					"pages_manage_posts",
					// Required to publish to pages
					"pages_read_engagement",
					// Required to retrieve the list of pages the account is connected to
					"business_management",
				],
			},
			accounts,
		});

		this.version = config.version ?? "v22.0";
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their Facebook account.
	 *
	 * @param client_id - The client ID
	 * @param redirect_uri - The redirect URI
	 * @param scopes - The scopes
	 *
	 * @returns The URL to redirect to
	 */
	async grant(
		{ scopes }: Omit<GrantProps, "client_id" | "redirect_uri"> = {
			scopes: this.config.scopes ?? [],
		},
	): Promise<Response<GrantResponse | null>> {
		return super.grant({
			base: `https://www.facebook.com/${this.version}/dialog/oauth`,
			scopes,
		});
	}

	/**
	 * Validates a Facebook access token against the required scopes.
	 *
	 * @param access_token - The access token to validate
	 * @param scopes - The required scopes
	 *
	 * @returns The granted scopes and the expiry date of the access token.
	 */
	async validate({
		access_token,
		scopes,
	}: Omit<ValidateProps, "client_id" | "client_secret">): Promise<
		Response<ValidateResponse | null>
	> {
		const url = new URL("https://graph.facebook.com/debug_token");
		url.searchParams.set("input_token", access_token);
		url.searchParams.set(
			"access_token",
			`${this.config.clientId}|${this.config.clientSecret}`,
		);

		const response = await fetch(url);
		const body = await response.json();

		const granted_scopes = body?.data?.scopes;

		if (
			granted_scopes &&
			!scopes.every((required) => granted_scopes?.includes(required))
		) {
			return {
				data: null,
				error: {
					message: `Invalid scope(s). Missing: ${scopes
						.filter((required) => !granted_scopes?.includes(required))
						.join(", ")}`,
					hint: "The necessary permissions are not set for this connection.",
				},
			};
		}

		return {
			data: {
				scopes: granted_scopes,
			},
			error: null,
		};
	}

	/**
	 * Exchanges a Facebook code for useful tokens.
	 *
	 * @param code - The code to exchange
	 * @param csrf_token - The CSRF token
	 *
	 * @returns An array of refresh token, long-lived access token, account ID, and expiry date for each page
	 */
	async exchange({
		code,
		csrf_token,
	}: Omit<
		ExchangeProps,
		"client_id" | "client_secret" | "redirect_uri"
	>): Promise<Response<ExchangeResponse[] | null>> {
		try {
			if (!this.config.redirectUri) {
				throw new Error("Redirect URI is required");
			}

			const baseUrl = `https://graph.facebook.com/${this.version}`;
			const params = new URLSearchParams({
				client_id: this.config.clientId,
				client_secret: this.config.clientSecret,
				grant_type: "authorization_code",
				redirect_uri: this.config.redirectUri,
				code,
				...(csrf_token ? { code_verifier: csrf_token } : {}),
			});

			const accessTokenResponse = await fetch(`${baseUrl}/oauth/access_token`, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: params,
			});

			if (!accessTokenResponse.ok) {
				const error = await accessTokenResponse.text();
				throw new Error(`Failed to exchange Facebook code: ${error}`);
			}

			const { access_token } = await accessTokenResponse.json();

			const pagesResponse = await fetch(
				`${baseUrl}/me/accounts?fields=id,access_token,name,picture,page_token`,
				{
					headers: { Authorization: `Bearer ${access_token}` },
				},
			);

			if (!pagesResponse.ok) {
				const error = await pagesResponse.text();
				throw new Error(`Failed to get Facebook pages: ${error}`);
			}

			const pages: FacebookPage = await pagesResponse.json();

			return {
				data: pages.data.map((page) => ({
					access_token: page.access_token,
					refresh_token: undefined,
					account_id: page.id,
					expiry: timestamp(90 * 24 * 60 * 60),
					details: {
						name: page.name,
						username: page.page_token, // This is actually the username of the page
						avatar_url: page.picture.data.url,
					},
				})),
				error: null,
			};
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error
							? error.message
							: "Failed to exchange Facebook code",
				},
			};
		}
	}

	/**
	 * Refreshes a Facebook access token or refresh token.
	 *
	 * @param token - The token to refresh
	 * @param option - The token to refresh
	 *
	 * @returns The new access token, refresh token, and expiry date
	 */
	async refresh({
		token,
	}: Omit<RefreshAccessTokenProps, "client_id" | "client_secret">): Promise<
		Response<RefreshAccessTokenResponse | null>
	> {
		return {
			data: {
				token: "",
				expires_in: 0,
			},
			error: null,
		};
	}

	/**
	 * Publishes a post to Facebook.
	 *
	 * @param post - The post to publish
	 *
	 * @returns The response from the publish request
	 */
	async publish({ post }: Omit<PublishProps<"facebook">, "account">): Promise<
		Response<
			| {
					success: boolean;
					post_id: string;
					account_id: string;
			  }[]
			| null
		>
	> {
		if (!this.accounts) {
			throw new Error("No account connected");
		}

		// this.accounts for Facebook is an array of PAGES not ACCOUNTS
		// so we need to publish to each page listed in this.accounts

		try {
			const data: {
				success: boolean;
				post_id: string;
				account_id: string;
			}[] = [];
			const errors: ErrorResponse[] = [];

			for (const page of this.accounts) {
				try {
					const publishUrl = new URL(
						`https://graph.facebook.com/${this.version}/${page.id}/feed`,
					);

					const mediaArray = Array.isArray(post?.media)
						? post.media
						: post?.media
							? [post.media]
							: [];

					const attachedMedia: { media_fbid: string }[] = [];

					if (mediaArray.length > 0) {
						for (const media of mediaArray) {
							if (media.type === "video") {
								errors.push({
									message: "Video uploads are not yet supported for Facebook",
									details: {
										account_id: page.id,
									},
								});
								continue;
							}

							const mediaEndpoint =
								media.type === "image" ? "photos" : "videos";
							const uploadUrl = new URL(
								`https://graph.facebook.com/${this.version}/${page.id}/${mediaEndpoint}`,
							);

							const uploadBody = {
								url: media.url,
								published: false, // Don't publish right away
								access_token: page.access_token,
							};

							if (post.options?.publish_at) {
								Object.assign(uploadBody, { temporary: true });
							}

							const uploadResponse = await fetch(uploadUrl.toString(), {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify(uploadBody),
							});

							if (!uploadResponse.ok) {
								const error = await uploadResponse.json();
								throw new Error(
									`Failed to upload media: ${error?.error?.message ?? "Unknown error"}`,
								);
							}

							const { id } = await uploadResponse.json();
							attachedMedia.push({ media_fbid: id });
						}
					}

					// Build the post body
					const postBody: Record<string, any> = {
						message: post.text ?? "",
						access_token: page.access_token,
						published: true,
						privacy: {
							value: "EVERYONE",
						},
					};

					// Add link if provided
					if (post.link) {
						postBody.link = post.link;
					}

					// Add media if uploaded
					if (attachedMedia.length > 0) {
						postBody.attached_media = attachedMedia;
					}

					// Handle scheduled posts
					if (post.options?.publish_at) {
						const publishTime = Math.floor(
							new Date(post.options.publish_at).getTime() / 1000,
						);
						Object.assign(postBody, {
							scheduled_publish_time: publishTime,
							published: false,
						});

						if (attachedMedia.length > 0) {
							postBody.unpublished_content_type = "SCHEDULED";
						}
					}

					const publishResponse = await fetch(publishUrl.toString(), {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(postBody),
					});

					if (!publishResponse.ok) {
						const error = await publishResponse.json();
						throw new Error(
							`Failed to publish post: ${error?.error?.message ?? "Unknown error"}`,
						);
					}

					const publishResult = await publishResponse.json();

					data.push({
						success: true,
						post_id: publishResult.id,
						account_id: page.id,
					});
				} catch (error) {
					errors.push({
						message:
							error instanceof Error
								? error.message
								: "Failed to publish to page",
						details: {
							account_id: page.id,
						},
					});
				}
			}

			return {
				data: data.length > 0 ? data : null,
				error:
					errors.length > 0
						? {
								message: "Failed to publish to some or all pages",
								details: errors,
							}
						: null,
			};
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error ? error.message : "Failed to publish post",
					hint: "Please check your credentials and try again",
				},
			};
		}
	}
}

export default Facebook;
