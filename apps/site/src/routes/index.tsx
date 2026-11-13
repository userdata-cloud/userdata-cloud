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
    <>
      <Title>userdata.cloud</Title>
      <section class="band band--hero">
        <div class="band__inner lede">
          <div class="rail" aria-hidden="true">
            <span class="seal" />
          </div>
          <div>
            <h1>Records that outlive the company that issued them.</h1>
            <p>
              A receipt, a warranty, a proof of ownership. The company that sent it can close. Records that stay
              structured, so a later reader can still check who issued them.
            </p>
            <div class="hero__actions">
              <Show
                when={session()}
                fallback={
                  <a class="btn--signin" href="/login">
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
          </div>
        </div>
      </section>
      <section class="band band--bytes">
        <ul class="band__inner soundbytes">
          <li>Records a company signs when it creates them.</li>
          <li>Records that stay on a host of your choice.</li>
          <li>Records that can live in a folder on disk, including a drive you carry.</li>
          <li>Records that this site does not hold.</li>
        </ul>
      </section>
    </>
  );
}
