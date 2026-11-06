const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function saveToken(token) {
  if (typeof window !== "undefined") localStorage.setItem("manobsheba-token", token);
}
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("manobsheba-token");
}
export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem("manobsheba-token");
}

// FIX: token expire hoise kina check koro, expire hole notun token ano
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function getJwtToken(email, forceRefresh = false) {
  if (!email) return null;
  if (forceRefresh) clearToken();
  let token = getToken();
  // FIX: cached token thakleo expire hole fele dao
  if (token && !isTokenExpired(token)) return token;
  if (token && isTokenExpired(token)) clearToken();

  const res = await fetch(`${API_URL}/api/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (data.token) {
    saveToken(data.token);
    return data.token;
  }
  return null;
}

async function getHeaders(email, forceRefresh = false) {
  const token = await getJwtToken(email, forceRefresh);
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// FIX: 401 hole 1 bar token refresh kore retry - sob mutating call er jonno
async function fetchWithRetry(url, options, email) {
  let res = await fetch(url, options);
  if (res.status === 401) {
    clearToken();
    const newHeaders = await getHeaders(email, true);
    res = await fetch(url, { ...options, headers: newHeaders });
  }
  return res;
}

async function handleError(res, fallback) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || fallback);
  }
  return res.json();
}

export async function getEvents(search = "", type = "") {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (type) params.append("type", type);
  const res = await fetch(`${API_URL}/api/events?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function getRecentEvents() {
  const res = await fetch(`${API_URL}/api/events/recent`);
  if (!res.ok) throw new Error("Failed to fetch recent events");
  return res.json();
}

export async function getEventById(id) {
  const res = await fetch(`${API_URL}/api/events/${id}`);
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
}

export async function createEvent(eventData, email) {
  const headers = await getHeaders(email);
  const res = await fetchWithRetry(`${API_URL}/api/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(eventData),
  }, email);
  return handleError(res, "Failed to create event");
}

export async function getMyEvents(email) {
  const headers = await getHeaders(email);
  const res = await fetchWithRetry(`${API_URL}/api/events/my/${email}`, { headers }, email);
  return handleError(res, "Failed to fetch my events");
}

export async function updateEvent(id, eventData, email) {
  const headers = await getHeaders(email);
  const res = await fetchWithRetry(`${API_URL}/api/events/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(eventData),
  }, email);
  return handleError(res, "Failed to update event");
}

export async function deleteEvent(id, email) {
  const headers = await getHeaders(email);
  const res = await fetchWithRetry(`${API_URL}/api/events/${id}`, {
    method: "DELETE",
    headers,
  }, email);
  // FIX: age generic message dito, ekhon server er asol message dekhabe - jemon "Forbidden: not your event"
  return handleError(res, "Failed to delete event");
}

export async function joinEvent(joinData, email) {
  const headers = await getHeaders(email);
  const res = await fetchWithRetry(`${API_URL}/api/joined`, {
    method: "POST",
    headers,
    body: JSON.stringify(joinData),
  }, email);
  return handleError(res, "Failed to join event");
}

export async function getJoinedEvents(email) {
  const headers = await getHeaders(email);
  const res = await fetchWithRetry(`${API_URL}/api/joined/${email}`, { headers }, email);
  return handleError(res, "Failed to fetch joined events");
}

export async function leaveEvent(eventId, email) {
  const headers = await getHeaders(email);
  const res = await fetchWithRetry(`${API_URL}/api/joined/${eventId}`, {
    method: "DELETE",
    headers,
  }, email);
  return handleError(res, "Failed to leave event");
}

// Alias - joined-events page eita khuje
export const leaveJoinedEvent = leaveEvent;

export async function getJoinedCount(eventId) {
  const res = await fetch(`${API_URL}/api/joined/count/${eventId}`);
  if (!res.ok) return 0;
  const data = await res.json();
  return data.count || 0;
}