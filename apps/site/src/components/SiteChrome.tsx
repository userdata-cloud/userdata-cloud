import { A, useLocation } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import type { ParentProps } from "solid-js";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

import AccountMenu from "~/components/AccountMenu";

const ModeToggle = clientOnly(() => import("~/components/ui/mode-toggle"));
import { subscribePrivacy } from "~/lib/privacy-hub";
import { readSession, subscribeSession } from "~/lib/session";

const DOCS = "https://docs.userdata.cloud/home/";

export default function SiteChrome(props: ParentProps) {
  const loc = useLocation();
  const [epoch, setEpoch] = createSignal(0);
  const [ready, setReady] = createSignal(false);

  onMount(() => {
    setReady(true);
    const bump = () => setEpoch((n) => n + 1);
    const offPrivacy = subscribePrivacy(bump);
    const offSession = subscribeSession(bump);
    onCleanup(() => {
      offPrivacy();
      offSession();
    });
  });

  const session = () => {
    void epoch();
    if (!ready()) return null;
    return readSession();
  };

  const wide = () => loc.pathname.startsWith("/settings");

  return (
    <div class="flex min-h-screen flex-col">
      <header class="site-header">
        <A href="/" class="wordmark">
          userdata.cloud
        </A>
        <nav class="site-nav" aria-label="Site">
          <A href="/news">News</A>
          <a href={DOCS}>Docs</a>
          <A href="/download">Downloads</A>
          <ModeToggle />
          <Show when={session()} fallback={<A href="/login">Sign in</A>}>
            <AccountMenu />
          </Show>
        </nav>
      </header>
      <main class="site-main" classList={{ "site-main--wide": wide() }}>
        {props.children}
      </main>
      <footer class="site-footer">
        <p>
          Records stay in a folder you hold. <A href="/news">News</A> and <a href={DOCS}>docs</a> sit in the bar
          above.
        </p>
      </footer>
    </div>
  );
}
