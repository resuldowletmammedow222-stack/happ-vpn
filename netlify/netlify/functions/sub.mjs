import {
  keysStore,
  loadServers,
  b64,
  timeLeft,
  stateOf,
  placeholderLink,
  GB,
  DEFAULT_ANNOUNCE,
  DEFAULT_TITLE,
  TOKEN_RE,
} from "../../lib/common.mjs";

// Public subscription endpoint: https://<site>/sub/<token>
// VPN apps (Happ and others) open this link, read the server list and refresh it on a schedule.

const clip = (text, max) => Array.from(String(text)).slice(0, max).join("");

function plain(body, status) {
  return new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}

export default async (req) => {
  if (req.method !== "GET" && req.method !== "HEAD") return plain("Method not allowed", 405);

  const url = new URL(req.url);
  const token = url.pathname.split("/").filter(Boolean).pop() || "";
  if (!TOKEN_RE.test(token)) return plain("Not found", 404);

  const store = keysStore();
  const key = await store.get(token, { type: "json" });
  if (!key) return plain("Not found", 404);

  const now = Date.now();
  let state = stateOf(key, now);

  // Device limit: clients such as Happ send a hardware id header with every subscription request.
  const hwid = clip((req.headers.get("x-hwid") || "").trim(), 128);
  if (state === "active" && hwid) {
    key.hwids = key.hwids || [];
    if (!key.hwids.some((d) => d.id === hwid)) {
      if (key.devices > 0 && key.hwids.length >= key.devices) {
        state = "devices";
      } else if (key.hwids.length < 200) {
        key.hwids.push({
          id: hwid,
          os: clip(req.headers.get("x-device-os") || "", 32),
          model: clip(req.headers.get("x-device-model") || "", 64),
          at: now,
        });
        await store.setJSON(token, key);
      }
    }
  }

  let lines;
  let announce;
  if (state === "active") {
    lines = key.configs && key.configs.length ? key.configs : (await loadServers())[key.country] || [];
    if (!lines.length) lines = [placeholderLink("⚠ Serwer entek goşulmady")];
    announce = (key.announce || DEFAULT_ANNOUNCE)
      .replaceAll("{USERNAME}", key.name)
      .replaceAll("{TIME_LEFT}", timeLeft(key.expiresAt, now));
  } else if (state === "expired") {
    lines = [placeholderLink("⛔ Möhleti gutardy")];
    announce = "Abunaňyzyň möhleti gutardy. Dowam etdirmek üçin admin bilen habarlaşyň.";
  } else if (state === "devices") {
    lines = [placeholderLink("⛔ Cihaz çägi doldy")];
    announce = "Cihaz çägi doldy (" + key.devices + "). Admin bilen habarlaşyň.";
  } else {
    lines = [placeholderLink("⛔ Abuna öçürilen")];
    announce = "Abunaňyz öçürilen. Admin bilen habarlaşyň.";
  }

  const headers = {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
    "profile-title": "base64:" + b64(clip(key.title || DEFAULT_TITLE, 25)),
    "profile-update-interval": "12",
    "subscription-userinfo":
      "upload=0; download=0; total=" + Math.round((key.gb || 0) * GB) + "; expire=" + Math.floor(key.expiresAt / 1000),
    announce: "base64:" + b64(clip(announce, 200)),
    "profile-web-page-url": url.origin,
  };

  return new Response(req.method === "HEAD" ? null : b64(lines.join("\n")), { status: 200, headers });
};

export const config = { path: "/sub/*" };
