import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR } from "@kobalte/core";
import { MetaProvider, Title } from "@solidjs/meta";
import "./fonts/sora-latin.css";
import "./fonts/doto-regular.css";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { clientOnly } from "@solidjs/start";
import { Suspense } from "solid-js";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/http";

import SiteChrome from "~/components/SiteChrome";
import "./app.css";

const ClientPrivacyBootstrap = clientOnly(() => import("~/components/ClientPrivacyBootstrap"));

function getServerCookies() {
  "use server";
  const colorMode = getCookie("kb-color-mode");
  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export default function App() {
  const storageManager = cookieStorageManagerSSR(isServer ? getServerCookies() : document.cookie);

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <ColorModeScript storageType={storageManager.type} />
          <ColorModeProvider storageManager={storageManager}>
            <Title>userdata.cloud</Title>
            <SiteChrome>
              <ClientPrivacyBootstrap />
              <Suspense>{props.children}</Suspense>
            </SiteChrome>
          </ColorModeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
