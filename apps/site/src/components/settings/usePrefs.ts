import { createSignal, onCleanup, onMount } from "solid-js";

import {
  readPreferences,
  subscribePreferences,
  writePreferences,
  type Preferences
} from "~/lib/preferences";

export function usePrefs() {
  const [prefs, setPrefs] = createSignal<Preferences>(readPreferences());
  const [saved, setSaved] = createSignal(false);

  onMount(() => {
    setPrefs(readPreferences());
    const off = subscribePreferences(() => setPrefs(readPreferences()));
    onCleanup(off);
  });

  function patch(partial: Partial<Preferences>) {
    setSaved(false);
    setPrefs({ ...prefs(), ...partial });
  }

  function save(event: SubmitEvent) {
    event.preventDefault();
    writePreferences(prefs());
    setSaved(true);
  }

  return { prefs, patch, save, saved };
}
