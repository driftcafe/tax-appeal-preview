import type { ComparablesResponse } from "./api";

const KEY = (id: string) => `ptaai:lookup:${id}`;
const EMAIL_KEY = (id: string) => `ptaai:email:${id}`;

export function saveLookup(data: ComparablesResponse) {
  try {
    sessionStorage.setItem(KEY(data.lookup_id), JSON.stringify({ ...data, _saved_at: Date.now() }));
  } catch {}
}

export function loadLookup(id: string): ComparablesResponse | null {
  try {
    const raw = sessionStorage.getItem(KEY(id));
    if (!raw) return null;
    return JSON.parse(raw) as ComparablesResponse;
  } catch {
    return null;
  }
}

export function saveEmail(id: string, email: string) {
  try { sessionStorage.setItem(EMAIL_KEY(id), email); } catch {}
}

export function loadEmail(id: string): string | null {
  try { return sessionStorage.getItem(EMAIL_KEY(id)); } catch { return null; }
}
