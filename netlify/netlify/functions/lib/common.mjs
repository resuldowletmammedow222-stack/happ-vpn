import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

// Netlify Blobs: "keys" holds one JSON record per subscription, "settings" holds the per-country server lists.
export const keysStore = () => getStore({ name: "keys", consistency: "strong" });
export const settingsStore = () => getStore({ name: "settings", consistency: "strong" });

export const GB = 1024 ** 3;
export const DAY = 24 * 60 * 60 * 1000;
export const DEFAULT_ANNOUNCE = "Welcome {USERNAME} - {TIME_LEFT}";
export const DEFAULT_TITLE = process.env.DEFAULT_TITLE || "ResulVPN";
export const TOKEN_RE = /^[a-f0-9]{24}$/;

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export function b64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

// A server link looks like vless://..., vmess://..., trojan://..., ss://..., hysteria2://...
export function isConfigLine(line) {
  return line.length <= 4000 && /^[a-z][a-z0-9+.-]{1,20}:\/\/\S+$/i.test(line);
}

export function parseConfigs(input) {
  const lines = Array.isArray(input) ? input : String(input || "").split(/\r?\n/);
  const out = [];
  for (const raw of lines) {
    const line = String(raw).trim();
    if (line && isConfigLine(line) && !out.includes(line)) out.push(line);
  }
  return out.slice(0, 50);
}

export function stateOf(key, now = Date.now()) {
  if (!key.active) return "disabled";
  if (key.expiresAt <= now) return "expired";
  return "active";
}

export function timeLeft(expiresAt, now = Date.now()) {
  const ms = expiresAt - now;
  if (ms <= 0) return "gutardy";
  if (ms < DAY) return Math.max(1, Math.ceil(ms / 3600000)) + " sagat";
  return Math.ceil(ms / DAY) + " gün";
}

// Shown instead of real servers when a subscription is off, expired or out of devices.
// The client app replaces its list on the next update, so the user sees the reason in the server list.
export function placeholderLink(remark) {
  return (
    "vless://00000000-0000-0000-0000-000000000000@127.0.0.1:1?encryption=none&security=none&type=tcp#" +
    encodeURIComponent(remark)
  );
}

// Returns true / false, or "unset" when the ADMIN_PASSWORD environment variable is missing.
export function checkPassword(given) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return "unset";
  const a = createHash("sha256").update(String(given || "")).digest();
  const b = createHash("sha256").update(real).digest();
  return timingSafeEqual(a, b);
}

export function clampInt(value, min, max, fallback) {
  const n = Math.trunc(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function clampNum(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export async function loadServers() {
  return (await settingsStore().get("servers", { type: "json" })) || {};
}
