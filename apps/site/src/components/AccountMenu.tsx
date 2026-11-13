import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createSignal, on, onCleanup, onMount, Show } from "solid-js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { initials, readPreferences, subscribePreferences } from "~/lib/preferences";
import { isBlind, subscribePrivacy } from "~/lib/privacy-hub";
import { clearSession, readSession, subscribeSession } from "~/lib/session";

export default function AccountMenu() {
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = createSignal(false);
  const [epoch, setEpoch] = createSignal(0);

  createEffect(on(() => loc.pathname, () => setOpen(false), { defer: true }));

  onMount(() => {
    const bump = () => setEpoch((n) => n + 1);
    const offPrefs = subscribePreferences(bump);
    const offSession = subscribeSession(bump);
    const offPrivacy = subscribePrivacy(bump);
    onCleanup(() => {
      offPrefs();
      offSession();
      offPrivacy();
    });
  });

  const session = () => {
    void epoch();
    return readSession();
  };
  const prefs = () => {
    void epoch();
    return readPreferences();
  };
  const label = () => {
    if (isBlind()) return "Signed in";
    return prefs().displayName.trim() || session()?.email || "Account";
  };

  return (
    <DropdownMenu open={open()} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        class="account-trigger"
        aria-label={`Account menu for ${label()}`}
      >
        <Show
          when={prefs().avatarDataUrl}
          fallback={
            <Show
              when={!isBlind()}
              fallback={<span class="account-seal" />}
            >
              <span class="account-initials">{initials(prefs().displayName, session()?.email ?? "")}</span>
            </Show>
          }
        >
          <img class="account-photo" src={prefs().avatarDataUrl} alt="" />
        </Show>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="account-menu">
        <p class="account-menu__who">{label()}</p>
        <DropdownMenuItem
          as="a"
          href="/settings/account"
          onClick={() => setOpen(false)}
          onSelect={() => {
            setOpen(false);
            navigate("/settings/account");
          }}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          as="a"
          href="/app"
          onClick={() => setOpen(false)}
          onSelect={() => {
            setOpen(false);
            navigate("/app");
          }}
        >
          Web vault
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            clearSession();
            navigate("/");
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
