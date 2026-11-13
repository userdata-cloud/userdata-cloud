import { A, useLocation } from "@solidjs/router";
import type { ParentProps } from "solid-js";
import { For } from "solid-js";

export const SETTINGS_NAV = [
  { href: "/settings/account", label: "Account" },
  { href: "/settings/identity", label: "Identity" },
  { href: "/settings/vault", label: "Vault" },
  { href: "/settings/mail", label: "Mail ingestion" },
  { href: "/settings/sharing", label: "Household" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/privacy", label: "Privacy" },
  { href: "/settings/appearance", label: "Appearance" },
  { href: "/settings/providers", label: "Issuers" },
  { href: "/settings/extension", label: "Browser companion" },
  { href: "/settings/developers", label: "Developers" },
  { href: "/settings/sessions", label: "This browser" }
] as const;

export default function SettingsShell(props: ParentProps) {
  const loc = useLocation();
  const current = (href: string) => loc.pathname === href;

  return (
    <div class="settings-shell">
      <nav class="settings-nav" aria-label="Settings">
        <p class="settings-nav__title">Settings</p>
        <ul>
          <For each={SETTINGS_NAV}>
            {(item) => (
              <li>
                <A href={item.href} aria-current={current(item.href) ? "page" : undefined}>
                  {item.label}
                </A>
              </li>
            )}
          </For>
        </ul>
      </nav>
      <div class="settings-pane">{props.children}</div>
    </div>
  );
}
