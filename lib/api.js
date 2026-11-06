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

export async function getJwtToken(email) {
  if (!email) return null;
  let token = getToken();
  if (token) return token;
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

async function getHeaders(email) {
  const token = await getJwtToken(email);
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
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
  let headers = await getHeaders(email);
  let res = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(eventData),
  });
  // Token expired hole 1 bar retry
  if (res.status === 401) {
    clearToken();
    headers = await getHeaders(email);
    res = await fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers,
      body: JSON.stringify(eventData),
    });
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create event");
  }
  return res.json();
}

export async function getMyEvents(email) {
  const headers = await getHeaders(email);
  const res = await fetch(`${API_URL}/api/events/my/${email}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch my events");
  return res.json();
}

export async function updateEvent(id, eventData, email) {
  const headers = await getHeaders(email);
  const res = await fetch(`${API_URL}/api/events/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(eventData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update event");
  }
  return res.json();
}

export async function deleteEvent(id, email) {
  const headers = await getHeaders(email);
  const res = await fetch(`${API_URL}/api/events/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete event");
  return res.json();
}

export async function joinEvent(joinData, email) {
  const headers = await getHeaders(email);
  const res = await fetch(`${API_URL}/api/joined`, {
    method: "POST",
    headers,
    body: JSON.stringify(joinData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to join event");
  }
  return res.json();
}

export async function getJoinedEvents(email) {
  const headers = await getHeaders(email);
  const res = await fetch(`${API_URL}/api/joined/${email}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch joined events");
  return res.json();
}

export async function leaveEvent(eventId, email) {
  const headers = await getHeaders(email);
  const res = await fetch(`${API_URL}/api/joined/${eventId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to leave event");
  return res.json();
}

// Alias - joined-events page eita khuje
export const leaveJoinedEvent = leaveEvent;

export async function getJoinedCount(eventId) {
  const res = await fetch(`${API_URL}/api/joined/count/${eventId}`);
  if (!res.ok) return 0;
  const data = await res.json();
  return data.count || 0;
}