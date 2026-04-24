import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createSignedProxiedCfHeaders,
  getVerifiedProxiedCf,
  normalizeProxyPath,
  PROXIED_CF_HEADER,
} from "./proxy";

describe("cloudflare proxy helpers", () => {
  it("round-trips signed proxied cf data", async () => {
    const cf = {
      city: "Sao Paulo",
      country: "BR",
      latitude: "-23.5505",
      longitude: "-46.6333",
      timezone: "America/Sao_Paulo",
    } as CfProperties<unknown>;
    const url = new URL(
      "https://api.sotsial.com/v1/auth/callback/google?code=123"
    );
    const headers = await createSignedProxiedCfHeaders({
      cf,
      method: "GET",
      secret: "proxy-test-secret",
      url,
    });

    assert.notEqual(headers, null);

    const verifiedCf = await getVerifiedProxiedCf({
      headers: headers ?? new Headers(),
      method: "GET",
      secret: "proxy-test-secret",
      url,
    });

    assert.deepEqual(verifiedCf, cf);
  });

  it("rejects tampered proxied cf data", async () => {
    const url = new URL("https://api.sotsial.com/v1/auth/session");
    const headers = await createSignedProxiedCfHeaders({
      cf: {
        country: "GB",
      } as CfProperties<unknown>,
      method: "POST",
      secret: "proxy-test-secret",
      url,
    });

    headers?.set(PROXIED_CF_HEADER, btoa(JSON.stringify({ country: "US" })));

    const verifiedCf = await getVerifiedProxiedCf({
      headers: headers ?? new Headers(),
      method: "POST",
      secret: "proxy-test-secret",
      url,
    });

    assert.equal(verifiedCf, null);
  });

  it("normalizes proxy paths without stripping the root path", () => {
    assert.equal(
      normalizeProxyPath("/v1/auth//callback/"),
      "/v1/auth/callback"
    );
    assert.equal(normalizeProxyPath("/"), "/");
  });
});
