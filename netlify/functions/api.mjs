import { randomBytes } from "node:crypto";
import {
  keysStore,
  settingsStore,
  loadServers,
  json,
  parseConfigs,
  stateOf,
  checkPassword,
  clampInt,
  clampNum,
  DAY,
  DEFAULT_ANNOUNCE,
  TOKEN_RE,
} from "../../lib/common.mjs";

// Admin API used by the panel page. Every call needs the ADMIN_PASSWORD (Authorization: Bearer <password>).

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function publicKey(key, servers, now = Date.now()) {
  const own = key.configs || [];
  return {
    id: key.id,
    name: key.name,
    country: key.country,
    createdAt: key.createdAt,
    expiresAt: key.expiresAt,
    devices: key.devices,
    gb: key.gb,
    title: key.title || "",
    announce: key.announce,
    active: key.active,
    state: stateOf(key, now),
    ownConfigs: own.length > 0,
    configCount: own.length || (servers[key.country] || []).length,
    deviceCount: (key.hwids || []).length,
  };
}

function cleanServers(input) {
  const out = {};
  if (input && typeof input === "object") {
    for (const [country, value] of Object.entries(input).slice(0, 60)) {
      const lines = parseConfigs(value);
      if (lines.length) out[String(country).slice(0, 40)] = lines;
    }
  }
  return out;
}

export default async (req) => {
  const url = new URL(req.url);
  const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);

  const given = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const auth = checkPassword(given);
  if (auth === "unset") {
    return json({ error: "ADMIN_PASSWORD gurnalmady (Netlify → Site configuration → Environment variables)" }, 500);
  }
  if (!auth) {
    await sleep(400);
    return json({ error: "Parol ýalňyş" }, 401);
  }

  const method = req.method;
  const store = keysStore();
  const body = method === "POST" || method === "PUT" || method === "PATCH" ? await req.json().catch(() => ({})) : {};
  const [resource, id, action] = parts;

  if (resource === "ping" && method === "GET") return json({ ok: true });

  // ---- servers per country ----
  if (resource === "servers") {
    if (method === "GET") return json({ servers: await loadServers() });
    if (method === "PUT") {
      const servers = cleanServers(body.servers);
      await settingsStore().setJSON("servers", servers);
      return json({ servers });
    }
    return json({ error: "Method not allowed" }, 405);
  }

  if (resource !== "keys") return json({ error: "Not found" }, 404);

  // ---- list / create ----
  if (!id) {
    if (method === "GET") {
      const servers = await loadServers();
      const { blobs } = await store.list();
      const keys = (await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })))).filter(Boolean);
      keys.sort((a, b) => b.createdAt - a.createdAt);
      return json({ keys: keys.map((k) => publicKey(k, servers)) });
    }
    if (method === "POST") {
      const name = String(body.name || "").trim().slice(0, 60);
      if (!name) return json({ error: "Açaryň adyny giriziň" }, 400);
      const now = Date.now();
      const key = {
        id: randomBytes(12).toString("hex"),
        name,
        country: String(body.country || "").trim().slice(0, 40) || "—",
        createdAt: now,
        expiresAt: now + clampInt(body.days, 1, 3650, 30) * DAY,
        devices: clampInt(body.devices, 0, 1000, 0),
        gb: clampNum(body.gb, 0, 100000, 0),
        title: String(body.title || "").trim().slice(0, 25),
        announce: String(body.announce || "").trim().slice(0, 200) || DEFAULT_ANNOUNCE,
        active: true,
        configs: parseConfigs(body.configs),
        hwids: [],
      };
      await store.setJSON(key.id, key);
      return json({ key: publicKey(key, await loadServers()) }, 201);
    }
    return json({ error: "Method not allowed" }, 405);
  }

  if (!TOKEN_RE.test(id)) return json({ error: "Not found" }, 404);
  const key = await store.get(id, { type: "json" });
  if (!key) return json({ error: "Abuna tapylmady" }, 404);

  // ---- delete ----
  if (method === "DELETE" && !action) {
    await store.delete(id);
    return json({ ok: true });
  }

  // ---- forget the devices that were counted ----
  if (method === "POST" && action === "reset-devices") {
    key.hwids = [];
    await store.setJSON(id, key);
    return json({ key: publicKey(key, await loadServers()) });
  }

  // ---- edit ----
  if (method === "PATCH" && !action) {
    if (typeof body.active === "boolean") key.active = body.active;
    if (body.extendDays !== undefined) {
      const n = clampInt(body.extendDays, -3650, 3650, 0);
      const base = n > 0 ? Math.max(key.expiresAt, Date.now()) : key.expiresAt;
      key.expiresAt = base + n * DAY;
    }
    if (body.devices !== undefined) key.devices = clampInt(body.devices, 0, 1000, key.devices);
    if (body.gb !== undefined) key.gb = clampNum(body.gb, 0, 100000, key.gb);
    if (typeof body.name === "string" && body.name.trim()) key.name = body.name.trim().slice(0, 60);
    if (typeof body.title === "string") key.title = body.title.trim().slice(0, 25);
    if (typeof body.announce === "string") key.announce = body.announce.trim().slice(0, 200) || DEFAULT_ANNOUNCE;
    if (body.configs !== undefined) key.configs = parseConfigs(body.configs);
    await store.setJSON(id, key);
    return json({ key: publicKey(key, await loadServers()) });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config = { path: "/api/*" };
