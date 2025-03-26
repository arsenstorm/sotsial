A package to easily cross-post to social media platforms.

# `sotsial`

The `sotsial` package powers [Sotsial](https://sotsial.com) - a platform built to make it cross-posting to social media platforms easier than ever with a developer-first approach.

## Usage

```ts
import Sotsial from "sotsial";

const sotsial = new Sotsial({
  threads: {
    config: {
      clientId: "1234567890", // these come from the env variables
      clientSecret: "1234567890",
      redirectUri: "http://localhost:3000/callback",
      scopes: ["threads_basic", "threads_content_publish"],
    },
    account: {
      id: "1234567890",
      access_token: "1234567890",
    },
  },
  // Add more providers here
});
```

## Granting Access

Before you can publish to a provider, your user must grant access to your app.

```ts
// Create a grant URL
const { data: { url, csrf_token }, error } = await sotsial.threads.grant();
// or
const { data: { url, csrf_token }, error } = await sotsial.grant("threads");
```

This will redirect your user to the provider's OAuth page. Once they have granted access, they will be redirected back to your app with a code.

## Exchanging the Code

You must exchange the code for an access token.

In Sotsial, you can do this by calling the `exchange` method.

```ts
// Exchange the code for an access token
const { data, error } = await sotsial.threads.exchange({
  code,
  csrf_token,
})
// or
const { data, error } = await sotsial.exchange("threads", {
  code,
  csrf_token,
});
```

## Publishing

Once you have an access token, you can publish to the provider.

```ts
// Create a new post
const post = await sotsial.threads.publish({
  text: "Hello, world!",
  media: [
    {
      type: "image",
      url: "https://example.com/image.jpg",
    },
  ],
});
```

You can also publish a generic post for all providers.

This means you can publish to Threads, Instagram, and more, all with the same function, simultaneously.

```ts
const post = await sotsial.publish({
  post: {
    text: "Hello, world!",
    media: [
      {
        type: "image",
        url: "https://example.com/image.jpg",
      },
    ],
  },
});
```

## Supported Providers

- [X] Threads
- [ ] Twitter/X
- [X] Instagram
- [ ] TikTok
- [ ] Facebook
- [ ] LinkedIn
