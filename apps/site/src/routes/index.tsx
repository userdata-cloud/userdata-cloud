import { Title } from "@solidjs/meta";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

import { subscribePrivacy } from "~/lib/privacy-hub";
import { readSession, subscribeSession } from "~/lib/session";

const DOCS = "https://docs.userdata.cloud/home/";

export default function Home() {
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

  return (
    <section class="lede">
      <Title>userdata.cloud</Title>
      <div class="rail" aria-hidden="true">
        <span class="seal" />
      </div>
      <div>
        <h1>Records that outlive the company that issued them.</h1>
        <p>
          A receipt, a warranty, a proof of ownership. The company that sent it can close. The folder on your disk
          still holds the record.
        </p>
        <div class="hero__actions">
          <Show
            when={session()}
            fallback={
              <a class="btn btn--primary" href="/login">
                Sign in
              </a>
            }
          >
            <a class="btn btn--primary" href="/app">
              Open your vault
            </a>
          </Show>
          <a class="btn" href="/news">
            News
          </a>
          <a class="btn" href={DOCS}>
            Docs
          </a>
        </div>
        <div class="panel">
          <h2>The folder is the vault</h2>
          <p>
            Sign-in on this site is a marker in this browser. After that, you can open a folder on disk, including a
            copy on a removable drive. The page does not upload the folder.
          </p>
        </div>
      </div>
    </section>
  );
}
