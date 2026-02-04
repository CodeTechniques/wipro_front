
const API_BASE = "http://127.0.0.1:8000/api";
// const API_BASE = "https://backend.wipogroup.in/api";
const REFRESH_ENDPOINT = "/auth/token/refresh/";

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(promise => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  refreshQueue = [];
};

export const apiFetch = async (endpoint, options = {}) => {
  const accessToken = localStorage.getItem("access_token");
  const isFormData = options.body instanceof FormData;

  const makeRequest = (token) => {
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    return fetch(`${API_BASE}${endpoint}`, {
      method: options.method || "GET",
      headers,
      body: options.body || null,
    });
  };

  let response = await makeRequest(accessToken);


  if (response.status === 401 && !endpoint.includes(REFRESH_ENDPOINT)) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      forceLogout();
      throw new Error("Session expired");
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            makeRequest(token)
              .then(res => res.json())
              .then(resolve)
              .catch(reject);
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshRes = await fetch(`${API_BASE}${REFRESH_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!refreshRes.ok) {
        throw new Error("Refresh token expired");
      }

      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData.access;

      localStorage.setItem("access_token", newAccessToken);
      processQueue(null, newAccessToken);

      // 🔁 Retry original request
      response = await makeRequest(newAccessToken);

    } catch (err) {
      processQueue(err, null);
      forceLogout();
      throw err;
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};

const forceLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};
