const SESSION_KEY = "prv_web_session_v1";

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeSession(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export type WebSession = {
  /** Mailbox on the account. Empty until one is saved. A username is not an email. */
  email: string;
  username?: string;
  /** True only when a password is stored for this account. The password value is never kept here. */
  hasPassword?: boolean;
  createdAt: string;
};

export function accountName(session: WebSession | null | undefined): string {
  if (!session) return "";
  return session.username?.trim() || session.email.trim();
}

export function readSession(): WebSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WebSession;
  } catch {
    return null;
  }
}

export function writeSession(session: WebSession): void {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  emit();
}

export function clearSession(): void {
  window.sessionStorage.removeItem(SESSION_KEY);
  emit();
}
