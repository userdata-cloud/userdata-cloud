<a id="readme-top"></a>
<div align="center">
  <a href="https://github.com/userdata-cloud/userdata-cloud/graphs/contributors"><img src="https://img.shields.io/github/contributors/userdata-cloud/userdata-cloud.svg?style=for-the-badge" alt="Contributors"></a>
  <a href="https://github.com/userdata-cloud/userdata-cloud/network/members"><img src="https://img.shields.io/github/forks/userdata-cloud/userdata-cloud.svg?style=for-the-badge" alt="Forks"></a>
  <a href="https://github.com/userdata-cloud/userdata-cloud/stargazers"><img src="https://img.shields.io/github/stars/userdata-cloud/userdata-cloud.svg?style=for-the-badge" alt="Stargazers"></a>
  <a href="https://github.com/userdata-cloud/userdata-cloud/issues"><img src="https://img.shields.io/github/issues/userdata-cloud/userdata-cloud.svg?style=for-the-badge" alt="Issues"></a>
  <a href="https://github.com/userdata-cloud/userdata-cloud/blob/main/LICENSE.txt"><img src="https://img.shields.io/github/license/userdata-cloud/userdata-cloud.svg?style=for-the-badge" alt="License"></a>

  <h1>Personal Records Vault</h1>
  <p>Local-first, user-held structured personal records with hooks for verifiable credentials, multi-modal indexing, and selective disclosure toward providers and employers.</p>
  <p>
    <a href="https://github.com/userdata-cloud/userdata-cloud/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/userdata-cloud/userdata-cloud/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#changelog">Changelog</a></li>
    <li><a href="#documentation">Documentation</a></li>
    <li><a href="#provider-sdk-care-software-developers">Provider SDK</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#ci-and-releases">CI and releases</a></li>
    <li><a href="#repository-layout">Repository layout</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

The primary application shell is an **Electron + SolidJS** desktop app (cross-platform installers). A **WebExtension** companion targets Chromium (Chrome, Edge) and Firefox (MV3). The **marketing and web vault shell** lives in `apps/site` (SolidStart 1 static site for Netlify). An optional **D** CLI remains under `native/cli` for experiments, not the main UI.

> **Warning:** This repository is experimental research software. It is not a medical device, not a HIPAA compliance product, and not legal advice about health records in your jurisdiction.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* **Desktop** — [![Electron][Electron.com]][Electron-url]
  * [![SolidJS][SolidJS.dev]][SolidJS-url]
* **Marketing / web vault** — [![SolidStart][SolidStart.dev]][SolidStart-url]
* **Browser companion** — MV3 WebExtension
* **SDK** — TypeScript (`@prv/sdk`)
* **Optional CLI** — D (`native/cli`)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Changelog

See [CHANGELOG.adoc](CHANGELOG.adoc) and the [changelog-details](changelog-details/) folder for dated design notes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Documentation

* [Explore the docs »](https://userdata-cloud.github.io/docs/vault/)
* [What to build first](docs/modules/ROOT/pages/viability-gate.adoc)
* [Implementation plans (index) — unimplemented and partial areas](docs/modules/ROOT/pages/plan/index.adoc)
* [Vision, constraints, and open questions](docs/modules/ROOT/pages/explanation/vision-and-constraints.adoc)
* [Provider SDK, OpenAPI contract, and language adapters](docs/modules/ROOT/pages/explanation/provider-sdk.adoc)
* [Marketing / web vault site (`@prv/site`)](apps/site/README.adoc)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Provider SDK (care software developers)

* **OpenAPI:** [`spec/openapi/prv-local.openapi.yaml`](spec/openapi/prv-local.openapi.yaml) — generate Java, C#, Python, Go, and other clients from this file.
* **JSON Schema:** [`spec/json-schema/exchange-bundle.schema.json`](spec/json-schema/exchange-bundle.schema.json) — bundle payload validation.
* **TypeScript reference:** [`packages/sdk` (`@prv/sdk`)](packages/sdk/README.adoc) — `createVaultClient({ baseUrl })` for loopback HTTP calls.

Build the SDK with `pnpm --filter @prv/sdk build` (also runs as part of `pnpm build` at the repo root).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) 22.x (see also `packageManager` in [package.json](package.json))
* [pnpm](https://pnpm.io/) 9.x (Corepack can install the pinned version)

### Desktop app (Electron + Solid)

```powershell
pnpm install
pnpm dev
```

Production bundle (Vite output under `apps/desktop/out`):

```powershell
pnpm build
```

Installers (NSIS on Windows, DMG on macOS, AppImage on Linux) via [electron-builder](https://www.electron.build/):

```powershell
pnpm dist
```

Artifacts land in `apps/desktop/release/`.

### Marketing site (SolidStart static, Netlify)

The static site is built with **SolidStart 1** (`vinxi build`) and emits HTML to `apps/site/.output/public`.

```powershell
pnpm dev:site
pnpm build:site
```

GitHub Actions builds `@prv/site` and publishes `apps/site/.output/public` to the existing Netlify site. [`netlify.toml`](netlify.toml) still names that build and publish directory for the CLI. The Netlify UI should not stay connected to the Git repository.

The `/login` route stores a **session marker** in `sessionStorage` only. The `/app` route uses the **File System Access API** to list a folder you select (for example on a USB drive); nothing is uploaded to Netlify.

### Browser extension

Build output is written to `apps/extension/dist/`.

```powershell
pnpm build:extension
```

Load unpacked:

* *Chrome / Edge:* `chrome://extensions` or `edge://extensions` → Developer mode → *Load unpacked* → select `apps/extension/dist`.
* *Firefox:* `about:debugging#/runtime/this-firefox` → *Load Temporary Add-on* → pick `apps/extension/dist/manifest.json`.

### Optional D CLI

```powershell
Set-Location native/cli
dub build
dub run
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## CI and releases

* [CI](.github/workflows/ci.yml) builds the desktop, extension, SDK, and static site on Ubuntu.
* [Release desktop](.github/workflows/release-desktop.yml) runs on `workflow_dispatch` and on tags matching `v*` to produce per-OS installers and upload GitHub Actions artifacts.

Codesigning and macOS notarization are not configured yet; expect unsigned macOS binaries until you add certificates and entitlements.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Repository layout

| Path | Purpose |
|------|---------|
| `apps/desktop/` | Electron main/preload/renderer (SolidJS; plain controls for now) |
| `apps/site/` | SolidStart 1 **static** marketing site + web vault shell (`@prv/site`, Netlify publish dir `.output/public`) |
| `apps/extension/` | MV3 WebExtension popup scaffold |
| `netlify.toml` | Publish directory for the Netlify CLI. Production publishes from GitHub Actions |
| `spec/openapi/` | Local Provider **OpenAPI** contract for multi-language client generation |
| `spec/json-schema/` | Payload **JSON Schema** mirrors for validators |
| `packages/sdk/` | TypeScript **reference client** (`@prv/sdk`) |
| `docs/` | Antora component `vault` (explanation, plans, and the build-order gate) |
| `changelog-details/` | Dated narrative notes linked from the changelog |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Fork the repo, create a feature branch, and open a pull request. See open issues for known gaps and plans under `docs/modules/ROOT/pages/plan/`. Read `docs/modules/ROOT/pages/viability-gate.adoc` before starting a new market.

### Top contributors

<a href="https://github.com/userdata-cloud/userdata-cloud/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=userdata-cloud/userdata-cloud" alt="contributors" />
</a>

For per-person profile links, prefer [all-contributors](https://allcontributors.org/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

See the repository `LICENSE` / `LICENSE.txt` file.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Ryan Johnson — [@amdphreak](https://twitter.com/amdphreak)

Project Link: [https://github.com/userdata-cloud/userdata-cloud](https://github.com/userdata-cloud/userdata-cloud)

Site: [https://ryanjohnson.dev](https://ryanjohnson.dev)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[Electron.com]: https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white
[Electron-url]: https://www.electronjs.org/
[SolidJS.dev]: https://img.shields.io/badge/SolidJS-2C4F7C?style=for-the-badge&logo=solid&logoColor=white
[SolidJS-url]: https://www.solidjs.com/
[SolidStart.dev]: https://img.shields.io/badge/SolidStart-2C4F7C?style=for-the-badge&logo=solid&logoColor=white
[SolidStart-url]: https://start.solidjs.com/
