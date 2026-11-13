import { useColorMode } from "@kobalte/core";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { For } from "solid-js";

import { usePrefs } from "~/components/settings/usePrefs";
import { setBlind } from "~/lib/privacy-hub";
import { clearSession, readSession, subscribeSession } from "~/lib/session";
import type { Digest } from "~/lib/preferences";

function SaveRow(props: { saved: boolean }) {
  return (
    <div class="form__actions">
      <button class="btn btn--primary" type="submit">
        Save changes
      </button>
      <Show when={props.saved}>
        <span class="save-note">Saved</span>
      </Show>
    </div>
  );
}

export function AccountSettings() {
  const { prefs, patch, save, saved } = usePrefs();
  const [photoError, setPhotoError] = createSignal<string | null>(null);
  const [email, setEmail] = createSignal("");

  onMount(() => {
    const sync = () => setEmail(readSession()?.email ?? "");
    sync();
    const off = subscribeSession(sync);
    onCleanup(off);
  });

  const onPhoto = (file: File | undefined) => {
    setPhotoError(null);
    if (!file) return;
    if (file.size > 400_000) {
      setPhotoError("Choose a picture smaller than 400 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch({ avatarDataUrl: String(reader.result || "") });
    reader.readAsDataURL(file);
  };

  return (
    <form class="settings-form" onSubmit={save}>
      <h1>Account</h1>
      <p>The name and picture shown on this browser. Sign-in stays on this device.</p>
      <div class="form__field">
        <label class="label" for="displayName">Display name</label>
        <input
          class="input"
          id="displayName"
          value={prefs().displayName}
          onInput={(e) => patch({ displayName: e.currentTarget.value })}
        />
      </div>
      <div class="form__field">
        <label class="label" for="accountEmail">Sign-in email</label>
        <input class="input" id="accountEmail" value={email()} readOnly />
      </div>
      <div class="form__field">
        <label class="label" for="avatar">Profile picture</label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => onPhoto(e.currentTarget.files?.[0])}
        />
        <Show when={photoError()}>
          <p class="field-error">{photoError()}</p>
        </Show>
        <Show when={prefs().avatarDataUrl}>
          <img class="account-photo settings-preview" src={prefs().avatarDataUrl} alt="" />
          <button class="btn" type="button" onClick={() => patch({ avatarDataUrl: "" })}>
            Remove picture
          </button>
        </Show>
      </div>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function IdentitySettings() {
  const { prefs, patch, save, saved } = usePrefs();
  return (
    <form class="settings-form" onSubmit={save}>
      <h1>Identity</h1>
      <p>Your vault key stays in this browser. These choices only change what the page shows.</p>
      <label class="check">
        <input
          type="checkbox"
          checked={prefs().showDid}
          onChange={(e) => patch({ showDid: e.currentTarget.checked })}
        />
        Show the did:key on the identity page
      </label>
      <div class="form__field">
        <label class="label" for="recovery">Recovery hint</label>
        <input
          class="input"
          id="recovery"
          value={prefs().recoveryHint}
          placeholder="A reminder only you would understand"
          onInput={(e) => patch({ recoveryHint: e.currentTarget.value })}
        />
      </div>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function VaultSettings() {
  const { prefs, patch, save, saved } = usePrefs();
  return (
    <form class="settings-form" onSubmit={save}>
      <h1>Vault</h1>
      <p>These prompts run before this browser opens a local folder.</p>
      <label class="check">
        <input
          type="checkbox"
          checked={prefs().promptUsb}
          onChange={(e) => patch({ promptUsb: e.currentTarget.checked })}
        />
        Ask before opening a removable drive
      </label>
      <label class="check">
        <input
          type="checkbox"
          checked={prefs().reopenLastVault}
          onChange={(e) => patch({ reopenLastVault: e.currentTarget.checked })}
        />
        Offer the last folder the next time you open the web vault
      </label>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function MailSettings() {
  const { prefs, patch, save, saved } = usePrefs();
  return (
    <form class="settings-form" onSubmit={save}>
      <h1>Mail ingestion</h1>
      <p>Receipts and warranties can arrive as mail. The address below is stored on this browser until a mailbox is issued.</p>
      <div class="form__field">
        <label class="label" for="mailLocal">Address name</label>
        <input
          class="input"
          id="mailLocal"
          value={prefs().mailLocalPart}
          placeholder="you"
          onInput={(e) => patch({ mailLocalPart: e.currentTarget.value })}
        />
      </div>
      <label class="check">
        <input
          type="checkbox"
          checked={prefs().keepMailOriginals}
          onChange={(e) => patch({ keepMailOriginals: e.currentTarget.checked })}
        />
        Keep the original message beside the structured record
      </label>
      <label class="check">
        <input
          type="checkbox"
          checked={prefs().acceptReceipts}
          onChange={(e) => patch({ acceptReceipts: e.currentTarget.checked })}
        />
        File purchase receipts automatically
      </label>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function SharingSettings() {
  const { prefs, patch, save, saved } = usePrefs();
  let nameEl: HTMLInputElement | undefined;
  let emailEl: HTMLInputElement | undefined;

  const addMember = () => {
    const name = nameEl?.value.trim() ?? "";
    const email = emailEl?.value.trim() ?? "";
    if (!name || !email) return;
    patch({ members: [...prefs().members, { name, email }] });
    if (nameEl) nameEl.value = "";
    if (emailEl) emailEl.value = "";
  };

  return (
    <form class="settings-form" onSubmit={save}>
      <h1>Household</h1>
      <p>People who may ask this vault for a record. Nothing is sent until you share it.</p>
      <ul class="member-list">
        <For each={prefs().members}>
          {(member) => (
            <li>
              <span>{member.name}</span>
              <span>{member.email}</span>
              <button
                class="btn"
                type="button"
                onClick={() => patch({ members: prefs().members.filter((row) => row !== member) })}
              >
                Remove
              </button>
            </li>
          )}
        </For>
      </ul>
      <div class="member-add">
        <input class="input" placeholder="Name" ref={nameEl} />
        <input class="input" placeholder="Email" type="email" ref={emailEl} />
        <button class="btn" type="button" onClick={addMember}>
          Add person
        </button>
      </div>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function NotificationSettings() {
  const { prefs, patch, save, saved } = usePrefs();
  return (
    <form class="settings-form" onSubmit={save}>
      <h1>Notifications</h1>
      <p>These stay on this browser until an inbox is connected.</p>
      <label class="check">
        <input
          type="checkbox"
          checked={prefs().notifyRecord}
          onChange={(e) => patch({ notifyRecord: e.currentTarget.checked })}
        />
        Tell me when a new record is filed
      </label>
      <label class="check">
        <input
          type="checkbox"
          checked={prefs().notifyWarranty}
          onChange={(e) => patch({ notifyWarranty: e.currentTarget.checked })}
        />
        Tell me before a warranty date
      </label>
      <div class="form__field">
        <label class="label" for="digest">Summary</label>
        <select
          class="input"
          id="digest"
          value={prefs().notifyDigest}
          onChange={(e) => patch({ notifyDigest: e.currentTarget.value as Digest })}
        >
          <option value="off">Off</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function PrivacySettings() {
  const { prefs, patch, save, saved } = usePrefs();
  return (
    <form
      class="settings-form"
      onSubmit={(event) => {
        setBlind(prefs().withholdIdentity);
        save(event);
      }}
    >
      <h1>Privacy</h1>
      <p>Withholding identity hides your email in the header and drops the open vault from this tab.</p>
      <label class="check">
        <input
          type="checkbox"
          checked={prefs().withholdIdentity}
          onChange={(e) => patch({ withholdIdentity: e.currentTarget.checked })}
        />
        Withhold identity in this browser
      </label>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function AppearanceSettings() {
  const { setColorMode, colorMode } = useColorMode();
  const { save, saved } = usePrefs();
  return (
    <form class="settings-form" onSubmit={save}>
      <h1>Appearance</h1>
      <p>Auto follows this device. The same choice sits in the top bar.</p>
      <fieldset class="theme-choices">
        <legend class="label">Theme</legend>
        <label class="check">
          <input
            type="radio"
            name="theme"
            checked={colorMode() === "light"}
            onChange={() => setColorMode("light")}
          />
          Light
        </label>
        <label class="check">
          <input
            type="radio"
            name="theme"
            checked={colorMode() === "dark"}
            onChange={() => setColorMode("dark")}
          />
          Dark
        </label>
        <label class="check">
          <input
            type="radio"
            name="theme"
            checked={colorMode() === "system"}
            onChange={() => setColorMode("system")}
          />
          Auto
        </label>
      </fieldset>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function ProviderSettings() {
  const { prefs, patch, save, saved } = usePrefs();
  return (
    <form class="settings-form" onSubmit={save}>
      <h1>Issuers</h1>
      <p>Shops and services you expect records from. One name per line.</p>
      <div class="form__field">
        <label class="label" for="issuers">Expected issuers</label>
        <textarea
          class="input"
          id="issuers"
          rows={6}
          value={prefs().trustedIssuers}
          onInput={(e) => patch({ trustedIssuers: e.currentTarget.value })}
        />
      </div>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function ExtensionSettings() {
  const { prefs, patch, save, saved } = usePrefs();
  return (
    <form class="settings-form" onSubmit={save}>
      <h1>Browser companion</h1>
      <p>The extension can notice a receipt page. It does not read the vault unless you open it.</p>
      <label class="check">
        <input
          type="checkbox"
          checked={prefs().extensionEnabled}
          onChange={(e) => patch({ extensionEnabled: e.currentTarget.checked })}
        />
        Allow the companion on this browser profile
      </label>
      <div class="form__field">
        <label class="label" for="hosts">Sites to watch</label>
        <textarea
          class="input"
          id="hosts"
          rows={4}
          placeholder="One site per line"
          value={prefs().extensionHosts}
          onInput={(e) => patch({ extensionHosts: e.currentTarget.value })}
        />
      </div>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function DeveloperSettings() {
  const { prefs, patch, save, saved } = usePrefs();
  const [started, setStarted] = createSignal("Not signed in");
  onMount(() => {
    const sync = () => setStarted(readSession()?.createdAt ?? "Not signed in");
    sync();
    const off = subscribeSession(sync);
    onCleanup(off);
  });
  return (
    <form class="settings-form" onSubmit={save}>
      <h1>Developers</h1>
      <p>No API key is issued yet. The session marker below never leaves this tab.</p>
      <div class="form__field">
        <label class="label" for="sessionStarted">Session started</label>
        <input class="input" id="sessionStarted" readOnly value={started()} />
      </div>
      <div class="form__field">
        <label class="label" for="devNote">Note for a future key</label>
        <input
          class="input"
          id="devNote"
          value={prefs().developerNote}
          onInput={(e) => patch({ developerNote: e.currentTarget.value })}
        />
      </div>
      <SaveRow saved={saved()} />
    </form>
  );
}

export function SessionSettings() {
  return (
    <section class="settings-form">
      <h1>This browser</h1>
      <p>Sign out clears the session marker. Saved settings stay in local storage until you remove them.</p>
      <div class="form__actions">
        <button
          class="btn"
          type="button"
          onClick={() => {
            clearSession();
            window.location.assign("/");
          }}
        >
          Sign out
        </button>
        <button
          class="btn"
          type="button"
          onClick={() => {
            window.localStorage.removeItem("prv_preferences_v1");
            window.location.reload();
          }}
        >
          Clear saved settings
        </button>
      </div>
    </section>
  );
}
