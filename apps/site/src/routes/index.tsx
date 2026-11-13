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
      <section class="band band--features">
        <div class="band__inner feature-list">
          <h2 class="band__title">Features</h2>
          <article class="feature">
            <h3>Keep your records</h3>
            <p>Personal data you create can stay on userdata.cloud.</p>
          </article>
          <article class="feature">
            <h3>Access your data online or locally</h3>
            <p>The web is the default. A copy can start offline, then sync and stay managed with the online one.</p>
          </article>
          <article class="feature">
            <h3>Replace your email</h3>
            <p>
              Connect your email, ingest and recreate your records in database format. The future is data, direct from
              businesses into our database.
            </p>
          </article>
          <article class="feature">
            <h3>Stored free</h3>
            <p>Business attestation records are stored for free. Paid for by businesses.</p>
          </article>
        </div>
      </section>
      <section class="band band--works">
        <div class="band__inner feature-list">
          <h2 class="band__title">How it works</h2>
          <article class="feature">
            <h3>A record the issuer signs</h3>
            <p>A company signs a structured record when it creates it, so a later reader can check who issued it.</p>
          </article>
          <article class="feature">
            <h3>Mail becomes data</h3>
            <p>Connect your email. What arrives there is ingested and recreated as database records.</p>
          </article>
          <article class="feature">
            <h3>A business sends it directly</h3>
            <p>The record can come straight from the business into the database.</p>
          </article>
        </div>
      </section>
    </>
  );
}
