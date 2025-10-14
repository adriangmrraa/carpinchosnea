import { getOrCreateUid, getUsername } from "../session/uid";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, { method = "GET", headers = {}, body, signal } = {}) {
  const url = `${API_BASE}${path}`;
  const uid = getOrCreateUid();
  const uname = getUsername();

  const res = await fetch(url, {
    method,
    headers: {
      "X-User-Id": uid,
      "X-User-Name": uname,
      ...(body && !headers["Content-Type"] ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    signal
  });

  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const msg = ct.includes("application/json") ? (await res.json()).message : await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }
  if (!ct.includes("application/json")) {
    const txt = await res.text();
    throw new Error(`Respuesta no JSON: ${txt.slice(0,120)}`);
  }
  return res.json();
}

export const api = {
  listProjects: (q) => request(`/projects?${new URLSearchParams(q)}`),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (body) => request(`/projects`, { method: "POST", body }),
  vote: (id, value) => request(`/projects/${id}/vote`, { method: "POST", body: { value } }),
};