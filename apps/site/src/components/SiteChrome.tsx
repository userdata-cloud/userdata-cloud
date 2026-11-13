import { A, useLocation } from "@solidjs/router";
import type { ParentProps } from "solid-js";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

import AccountMenu from "~/components/AccountMenu";
import MatrixField from "~/components/MatrixField";
import ModeToggle from "~/components/ui/mode-toggle";
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
  const home = () => loc.pathname === "/";

  return (
    <div class="relative flex min-h-screen flex-col">
      <MatrixField />
      <header class="site-header">
        <A href="/" class="wordmark">
          <img src="/mark.svg" alt="" width="28" height="28" />
          <span class="wordmark-name">
            user<span class="wordmark-data">
              <span class="wordmark-data__layer">data</span>
              <span class="wordmark-data__shift" aria-hidden="true">data</span>
            </span>
          </span>
        </A>
        <nav class="site-nav" aria-label="Site">
          <A href="/news">News</A>
          <a href={DOCS}>Docs</a>
          <A href="/download">Downloads</A>
          <ModeToggle />
          <Show when={session()} fallback={<A href="/login" class="btn--signin">Sign in</A>}>
            <AccountMenu />
          </Show>
        </nav>
      </header>
      <main class="site-main" classList={{ "site-main--wide": wide(), "site-main--home": home() }}>
        {props.children}
      </main>
      <footer class="site-footer">
        <p>
          <A href="/news">News</A>, <a href={DOCS}>docs</a>, and <A href="/about">about</A>.
        </p>
      </footer>
    </div>
  );
}
