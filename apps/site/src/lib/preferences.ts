const KEY = "prv_preferences_v1";

export type Digest = "off" | "weekly" | "monthly";

export type HouseholdMember = {
  name: string;
  email: string;
};

export type Preferences = {
  displayName: string;
  avatarDataUrl: string;
  showDid: boolean;
  recoveryHint: string;
  promptUsb: boolean;
  reopenLastVault: boolean;
  mailLocalPart: string;
  keepMailOriginals: boolean;
  acceptReceipts: boolean;
  notifyRecord: boolean;
  notifyWarranty: boolean;
  notifyDigest: Digest;
  withholdIdentity: boolean;
  extensionEnabled: boolean;
  extensionHosts: string;
  trustedIssuers: string;
  developerNote: string;
  members: HouseholdMember[];
};

export const defaultPreferences: Preferences = {
  displayName: "",
  avatarDataUrl: "",
  showDid: false,
  recoveryHint: "",
  promptUsb: true,
  reopenLastVault: true,
  mailLocalPart: "",
  keepMailOriginals: true,
  acceptReceipts: true,
  notifyRecord: true,
  notifyWarranty: true,
  notifyDigest: "weekly",
  withholdIdentity: false,
  extensionEnabled: false,
  extensionHosts: "",
  trustedIssuers: "",
  developerNote: "",
  members: []
};

type Listener = () => void;
const listeners = new Set<Listener>();

function load(): Preferences {
  if (typeof window === "undefined") return defaultPreferences;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return defaultPreferences;
  try {
    return { ...defaultPreferences, ...(JSON.parse(raw) as Partial<Preferences>) };
  } catch {
    return defaultPreferences;
  }
}

let current = load();

export function readPreferences(): Preferences {
  return current;
}

export function writePreferences(next: Preferences): void {
  current = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  for (const listener of listeners) listener();
}

export function subscribePreferences(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function initials(name: string, email: string): string {
  const source = name.trim() || email.trim();
  if (!source) return "?";
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (letters || source[0] || "?").toUpperCase();
}
