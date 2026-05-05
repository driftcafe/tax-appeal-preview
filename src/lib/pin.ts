// PIN normalization and detection utilities for IL property tax PINs.
// Counties have different PIN formats; we keep validation loose on purpose.

export function normalizePin(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

export function looksLikePin(raw: string): boolean {
  const cleaned = normalizePin(raw.trim());
  // PINs are all digits, typically 10-18 chars across IL counties.
  return /^\d{10,18}$/.test(cleaned);
}

export function formatCookPin(raw: string): string {
  const d = normalizePin(raw);
  if (d.length !== 14) return raw;
  // Conventional Cook format: xx-xx-xxx-xxx-xxxx
  return `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4, 7)}-${d.slice(7, 10)}-${d.slice(10, 14)}`;
}
