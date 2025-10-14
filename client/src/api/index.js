const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const uid = localStorage.getItem('carpinchos.uid') || '';
  const username = localStorage.getItem('carpinchos.username') || '';
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': uid,
      'X-User-Name': username,
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.json();
}