import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { Button } from "@kobalte/core/button";
import { createSignal, For } from "solid-js";
import { oauthLinkRefusal, OIDC_PROVIDERS, startLogin, unknownProviderNote, type OidcProviderId } from "~/lib/oidc-login";
import { writeSession } from "~/lib/session";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = createSignal<string | null>(null);

  const onSubmit = (ev: SubmitEvent) => {
    ev.preventDefault();
    setError(null);
    const form = ev.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const username = String(data.get("username") || "").trim();
    const password = String(data.get("password") || "");
    if (!username || !password) {
      setError("Enter a username and password to continue.");
      return;
    }
    writeSession({ username, email: "", createdAt: new Date().toISOString() });
    navigate("/app", { replace: true });
  };

  const onProvider = async (id: OidcProviderId) => {
    setError(null);
    const message = await startLogin(id);
    if (message) setError(message);
  };

  const onUnknown = () => {
    setError(oauthLinkRefusal() ?? unknownProviderNote());
  };

  return (
    <section class="login">
      <Title>Sign in — userdata.cloud</Title>
      <h1>Sign in</h1>
      <p>
        Sign in with your username and password. That login still works if a provider later closes the external
        account.
      </p>

      <form class="form" onSubmit={onSubmit}>
        <div class="form__field">
          <label class="label" for="username">
            Username
          </label>
          <input class="input" id="username" name="username" type="text" autocomplete="username" />
        </div>
        <div class="form__field">
          <label class="label" for="password">
            Password
          </label>
          <input class="input" id="password" name="password" type="password" autocomplete="current-password" />
        </div>
        <div class="form__actions">
          <Button class="btn--signin" type="submit">
            Sign in
          </Button>
        </div>
      </form>

      <h2 class="login__providers">Link a provider</h2>
      <p class="login__oauth-note" id="oauth-note">
        Google, Microsoft, Apple, and Firefox stay off until this account has an email and a password. They do not
        create the account. They are an extra door onto the username and password.
      </p>
      <div class="oauth-grid">
        <For each={OIDC_PROVIDERS}>
          {(provider) => (
            <button
              class="btn--signin"
              type="button"
              id={`oauth-${provider.id}`}
              disabled={oauthLinkRefusal() !== null}
              aria-describedby="oauth-note"
              onClick={() => void onProvider(provider.id)}
            >
              {provider.label}
            </button>
          )}
        </For>
        <button
          class="btn--signin"
          type="button"
          id="oauth-unknown"
          disabled={oauthLinkRefusal() !== null}
          aria-describedby="oauth-note"
          onClick={onUnknown}
        >
          Another provider
        </button>
      </div>
      {error() ? <p class="login__error">{error()}</p> : null}
    </section>
  );
}
