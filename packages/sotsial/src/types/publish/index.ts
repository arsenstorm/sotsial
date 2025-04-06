import type * as Posts from "@/types/publish/posts";

export interface Account {
	access_token: string;
	account_id: string;
}

export interface PublishProps<Platform extends keyof Posts.PlatformContent> {
	post: Posts.Post<Platform>;
	account: Account;
}
