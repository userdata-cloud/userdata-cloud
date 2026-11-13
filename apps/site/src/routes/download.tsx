import { Title } from "@solidjs/meta";

import { DesktopMock } from "~/components/AppMockups";

const REPO = "https://github.com/userdata-cloud/userdata-cloud";

const BROWSERS = [
  { name: "Firefox", file: "firefox", ready: true },
  { name: "Chrome", file: "chrome", ready: true },
  { name: "Chromium", file: "chromium", ready: false },
  { name: "Brave", file: "brave", ready: false },
  { name: "Opera", file: "opera", ready: false },
  { name: "Edge", file: "edge", ready: true },
  { name: "Safari", file: "safari", ready: false },
] as const;

export default function Download() {
  return (
    <section class="hero">
      <Title>Downloads — Personal Records Vault</Title>
      <h1>Get the apps</h1>
      <p>
        Installers are produced from GitHub Actions release artifacts. Until the first tagged release ships, build from
        source with <code>pnpm dist</code> in the desktop package.
      </p>

      <div class="download-grid">
        <div class="card">
          <DesktopMock />
          <h2>Desktop</h2>
          <p>Windows, macOS, and Linux installers via Electron.</p>
          <a class="btn btn--primary" href={`${REPO}/releases`} target="_blank" rel="noreferrer">
            GitHub Releases
          </a>
        </div>
        <div class="card">
          <h2>Browser companion</h2>
          <p>Chrome, Edge, and Firefox. The grey marks are planned.</p>
          <ul class="store-row">
            {BROWSERS.map((browser) => (
              <li classList={{ "is-planned": !browser.ready }} title={browser.ready ? undefined : "Planned"}>
                <img src={`/stores/${browser.file}.svg`} alt="" width="22" height="22" />
                {browser.name}
              </li>
            ))}
          </ul>
        </div>
        <div class="card">
          <h2>Source</h2>
          <p>Clone the monorepo for desktop, extension, SDK, and this site.</p>
          <a class="btn" href={REPO} target="_blank" rel="noreferrer">
            View repository
          </a>
        </div>
      </div>
    </section>
  );
}
