import useAuthStore from "../store/authStore";

const API_BASE_URL = "http://localhost:8080/api/v1";

/**
 * Custom fetch wrapper that automatically injects the auth token
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  
  const headers = new Headers(options.headers);
  
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = "/login";
  }

  return response;
}
