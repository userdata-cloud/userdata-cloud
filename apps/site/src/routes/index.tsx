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
              A receipt, a warranty, a proof of ownership. The company that sent it can close. The record stays
              structured, and a later reader can still check who issued it.
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
      <section class="band band--bytes" aria-labelledby="soundbytes-title">
        <div class="band__inner soundbytes">
          <h2 id="soundbytes-title">Soundbytes</h2>
          <article class="soundbyte">
            <h3>You keep the record</h3>
            <p>The company signs a structured record when it creates it.</p>
          </article>
          <article class="soundbyte">
            <h3>A host you choose</h3>
            <p>You keep that record with a host you choose.</p>
          </article>
          <article class="soundbyte">
            <h3>A folder is one host</h3>
            <p>A folder on your disk is one such host, including a copy on a drive you carry.</p>
          </article>
          <article class="soundbyte">
            <h3>This site is not the archive</h3>
          </article>
        </div>
      </section>
    </>
  );
}
