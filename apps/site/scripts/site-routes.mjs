/**
 * Canonical routes for Personal Records Vault marketing site.
 * Sitemap excludes auth/app surfaces: /login /app /identity.
 */
const NEWS = "/news/userdata-cloud-opens-its-public-organization";

const SETTINGS = [
  "/settings/account",
  "/settings/identity",
  "/settings/vault",
  "/settings/mail",
  "/settings/sharing",
  "/settings/notifications",
  "/settings/privacy",
  "/settings/appearance",
  "/settings/providers",
  "/settings/extension",
  "/settings/developers",
  "/settings/sessions"
];

export function getPrerenderRoutes() {
  return ["/", "/about", "/pricing", "/download", "/login", "/app", "/identity", "/providers", "/news", NEWS, "/blog", "/settings", ...SETTINGS];
}

export function getSitemapRoutes() {
  return ["/", "/about", "/pricing", "/download", "/providers", "/news", NEWS, "/blog"];
}

/** Prefer Netlify deploy URL when building on Netlify. */
export function getSiteOrigin() {
  const fromEnv = process.env.URL || process.env.DEPLOY_PRIME_URL || process.env.SITE_ORIGIN;
  if (fromEnv && /^https:\/\//i.test(fromEnv)) return fromEnv.replace(/\/$/, "");
  return "https://userdata-cloud.netlify.app";
}
