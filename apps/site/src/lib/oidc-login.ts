import { readSession } from "~/lib/session";

/** Public OIDC issuers. Authorization URLs match each issuer's discovery document. */

const OAUTH_NEEDS_ACCOUNT =
  "Providers stay off until this account has an email and a password. Username and password are the login. A provider is only an extra door onto that account.";

function emailOnFile(email: string | undefined): boolean {
  const value = email?.trim() ?? "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * OAuth cannot create or own an account.
 * 2FA enrollment is not in this repository, so this gate is email and password only.
 */
export function oauthLinkRefusal(): string | null {
  const session = readSession();
  if (!emailOnFile(session?.email) || session?.hasPassword !== true) return OAUTH_NEEDS_ACCOUNT;
  return null;
}

export type OidcProviderId = "google" | "microsoft" | "apple" | "firefox";

export type OidcProvider = {
  id: OidcProviderId;
  label: string;
  issuer: string;
  authorizationEndpoint: string;
  clientIdEnv: string;
};

export const OIDC_PROVIDERS: readonly OidcProvider[] = [
  {
    id: "google",
    label: "Google",
    issuer: "https://accounts.google.com",
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    clientIdEnv: "VITE_OIDC_GOOGLE_CLIENT_ID",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    issuer: "https://login.microsoftonline.com/common/v2.0",
    authorizationEndpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    clientIdEnv: "VITE_OIDC_MICROSOFT_CLIENT_ID",
  },
  {
    id: "apple",
    label: "Apple",
    issuer: "https://appleid.apple.com",
    authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
    clientIdEnv: "VITE_OIDC_APPLE_CLIENT_ID",
  },
  {
    id: "firefox",
    label: "Firefox",
    issuer: "https://accounts.firefox.com",
    authorizationEndpoint: "https://accounts.firefox.com/authorization",
    clientIdEnv: "VITE_OIDC_FIREFOX_CLIENT_ID",
  },
];

const PENDING_KEY = "prv_oidc_pending_v1";

function clientId(name: string): string {
  const env = import.meta.env as Record<string, string | undefined>;
  const value = env[name];
  return typeof value === "string" ? value.trim() : "";
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomUrlSafe(size = 32): string {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return base64url(bytes);
}

async function codeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url(new Uint8Array(digest));
}

export function oidcProvider(id: string): OidcProvider | undefined {
  return OIDC_PROVIDERS.find((provider) => provider.id === id);
}

/**
 * Links a known OIDC provider onto an account that already has an email and a password.
 * Returns a message instead of redirecting when that account is missing or the public client id is unset.
 * Does not send a client secret and does not create the account.
 */
export async function startLogin(providerId: OidcProviderId): Promise<string | null> {
  const refused = oauthLinkRefusal();
  if (refused) return refused;
  const provider = oidcProvider(providerId);
  if (!provider) return "That provider is not available.";
  const id = clientId(provider.clientIdEnv);
  if (!id) {
    return `${provider.label} sign-in needs ${provider.clientIdEnv} before it can open the issuer.`;
  }
  if (typeof window === "undefined" || !crypto.subtle) {
    return `${provider.label} sign-in needs a browser that can start OpenID Connect.`;
  }

  const verifier = randomUrlSafe();
  const state = randomUrlSafe(16);
  const nonce = randomUrlSafe(16);
  sessionStorage.setItem(
    PENDING_KEY,
    JSON.stringify({ providerId: provider.id, verifier, state, nonce }),
  );

  const url = new URL(provider.authorizationEndpoint);
  url.searchParams.set("client_id", id);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("response_mode", "query");
  url.searchParams.set("scope", "openid");
  url.searchParams.set("redirect_uri", `${window.location.origin}/login`);
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("code_challenge", await codeChallenge(verifier));
  url.searchParams.set("code_challenge_method", "S256");
  window.location.assign(url.toString());
  return null;
}

/** This repository has no unknown-provider mapping, so this does not open an issuer. */
export function unknownProviderNote(): string {
  return "This site has no mapping for an unknown OAuth provider, so this does not open an issuer.";
}
