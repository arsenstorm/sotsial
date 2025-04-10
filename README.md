Social media cross-posting for developers.

# Sotsial

The `sotsial` package powers [Sotsial](https://sotsial.com) - a platform built to make it cross-posting to social media platforms easier than ever with a developer-first approach.

If you're looking for a managed solution, check out [sotsial.com](https://sotsial.com).

## `sotsial`

The `sotsial` package is a TypeScript library that allows you to connect to and publish to social media platforms.

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

## License

This project uses a dual-license approach:

- All packages in the `packages/` directory are licensed under the MIT License - see the [LICENSE](packages/LICENSE) file for details.
- All apps in the `apps/` directory are licensed under the GNU Affero General Public License v3.0 unless otherwise specified - see the [LICENSE](apps/web/LICENSE) file for details.

This means you can freely use and modify packages under the MIT license, while all apps remain under the AGPL-3.0 license.

<sub>Copyright © 2025 Arsen Shkrumelyak. All rights reserved.</sub>
