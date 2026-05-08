import type { Conversation } from "./mockData";

/** Mask a phone like +91 98765 32108 → +91 98••• •2108 */
export function maskPhone(handle: string): string {
  // Keep country code + first 2 digits + last 4 digits
  const digits = handle.replace(/\D/g, "");
  if (digits.length < 7) return handle;
  const cc = handle.startsWith("+") ? handle.split(" ")[0] : "";
  const last4 = digits.slice(-4);
  const first2 = digits.slice(cc ? cc.replace(/\D/g, "").length : 0).slice(0, 2);
  return `${cc} ${first2}••• •${last4}`.trim();
}

export function getDisplayName(c: Pick<Conversation, "name" | "handle">): string {
  if (c.name) return c.name;
  if (c.handle.startsWith("+")) return maskPhone(c.handle);
  return c.handle; // @handle
}

export function getInitials(c: Pick<Conversation, "name" | "handle">): string {
  if (c.name) {
    return c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  }
  if (c.handle.startsWith("@")) return c.handle.replace("@", "").slice(0, 2).toUpperCase();
  // phone — use ? icon style
  return "#";
}

export function isUnknown(c: Pick<Conversation, "name">): boolean {
  return !c.name;
}
