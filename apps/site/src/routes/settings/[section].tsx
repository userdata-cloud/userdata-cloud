import { Title } from "@solidjs/meta";
import { Navigate, useParams } from "@solidjs/router";
import { Match, Show, Switch } from "solid-js";

import SettingsShell from "~/components/SettingsShell";
import {
  AccountSettings,
  AppearanceSettings,
  DeveloperSettings,
  ExtensionSettings,
  IdentitySettings,
  MailSettings,
  NotificationSettings,
  PrivacySettings,
  ProviderSettings,
  SessionSettings,
  SharingSettings,
  VaultSettings
} from "~/components/settings/SettingsForms";

const TITLES: Record<string, string> = {
  account: "Account",
  identity: "Identity",
  vault: "Vault",
  mail: "Mail ingestion",
  sharing: "Household",
  notifications: "Notifications",
  privacy: "Privacy",
  appearance: "Appearance",
  providers: "Issuers",
  extension: "Browser companion",
  developers: "Developers",
  sessions: "This browser"
};

export default function SettingsSection() {
  const params = useParams();
  const known = () => params.section in TITLES;

  return (
    <Show when={known()} fallback={<Navigate href="/settings/account" />}>
      <Title>{`${TITLES[params.section] ?? "Settings"} — userdata.cloud`}</Title>
      <SettingsShell>
        <Switch>
          <Match when={params.section === "account"}>
            <AccountSettings />
          </Match>
          <Match when={params.section === "identity"}>
            <IdentitySettings />
          </Match>
          <Match when={params.section === "vault"}>
            <VaultSettings />
          </Match>
          <Match when={params.section === "mail"}>
            <MailSettings />
          </Match>
          <Match when={params.section === "sharing"}>
            <SharingSettings />
          </Match>
          <Match when={params.section === "notifications"}>
            <NotificationSettings />
          </Match>
          <Match when={params.section === "privacy"}>
            <PrivacySettings />
          </Match>
          <Match when={params.section === "appearance"}>
            <AppearanceSettings />
          </Match>
          <Match when={params.section === "providers"}>
            <ProviderSettings />
          </Match>
          <Match when={params.section === "extension"}>
            <ExtensionSettings />
          </Match>
          <Match when={params.section === "developers"}>
            <DeveloperSettings />
          </Match>
          <Match when={params.section === "sessions"}>
            <SessionSettings />
          </Match>
        </Switch>
      </SettingsShell>
    </Show>
  );
}
