# `sotsial`

A package to easily cross-post to social media platforms.

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
});

// Create a grant URL
const { data: { url, csrf_token }, error } = await sotsial.threads.grant();

// Upon redirect, you can get the OAuth details from `data`
const { data, error } = await sotsial.threads.exchange({
  code,
  csrf_token,
})

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

## Supported Providers

- [X] Threads
- [ ] Twitter/X
- [X] Instagram
- [ ] TikTok
- [ ] Facebook
- [ ] LinkedIn
