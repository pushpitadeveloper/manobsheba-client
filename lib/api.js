const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function saveToken(token) {
  if (typeof window !== "undefined") localStorage.setItem("manobsheba-token", token);
}
export function getToken() {
  if (typeof window !== "undefined") return localStorage.getItem("manobsheba-token");
  return null;
}
export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem("manobsheba-token");
}

function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getJwtToken(email) {
  const res = await fetch(`${API_URL}/api/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (data.token) saveToken(data.token);
  return data.token;
}

export async function getEvents({ search = "", type = "" } = {}) {
  const res = await fetch(`${API_URL}/api/events?search=${search}&type=${type}`, { cache: "no-store" });
  return res.json();
}

export async function getRecentEvents() {
  const res = await fetch(`${API_URL}/api/events/recent`, { cache: "no-store" });
  return res.json();
}

export async function getEventById(id) {
  const res = await fetch(`${API_URL}/api/events/${id}`, { cache: "no-store" });
  return res.json();
}

export async function createEvent(data) {
  const res = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMyEvents(email) {
  const res = await fetch(`${API_URL}/api/events/my/${email}`, { headers: getHeaders() });
  return res.json();
}

export async function updateEvent(id, data) {
  const res = await fetch(`${API_URL}/api/events/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteEvent(id) {
  const res = await fetch(`${API_URL}/api/events/${id}`, { method: "DELETE", headers: getHeaders() });
  return res.json();
}

export async function joinEvent(data) {
  const res = await fetch(`${API_URL}/api/joined`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getJoinedEvents(email) {
  const res = await fetch(`${API_URL}/api/joined/${email}`, { headers: getHeaders() });
  return res.json();
}

export async function getJoinedCount(eventId) {
  const res = await fetch(`${API_URL}/api/joined/count/${eventId}`, { cache: "no-store" });
  return res.json();
}

export async function leaveEvent(eventId, email) {
  const res = await fetch(`${API_URL}/api/joined/${eventId}?email=${email}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
}