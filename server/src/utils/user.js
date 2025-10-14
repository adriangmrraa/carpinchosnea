export function resolveUser(req) {
  const id = String(req.headers["x-user-id"] || req.body?.userId || "anon-server");
  const username = String(req.headers["x-user-name"] || "vecino");
  return { id, username };
}