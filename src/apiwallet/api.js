const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("access_token");
  const isFormData = options.body instanceof FormData;

  const config = {
    method: options.method || "GET",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body || null,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    throw data || { detail: "Session expired" };
  }

  if (!res.ok) {
    throw data || { detail: "Request failed" };
  }

  return data;
};
