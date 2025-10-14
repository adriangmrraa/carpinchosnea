export function getOrCreateUid() {
  try {
    let uid = localStorage.getItem("pv_uid");
    if (!uid) {
      uid = "uid_" + crypto.randomUUID();
      localStorage.setItem("pv_uid", uid);
    }
    return uid;
  } catch {
    // fallback determinístico
    return "uid_fallback";
  }
}

export function getUsername() {
  try { return localStorage.getItem("pv_username") || "vecino"; } catch { return "vecino"; }
}

export function setUsername(name) {
  try { localStorage.setItem("pv_username", name || "vecino"); } catch {}
}