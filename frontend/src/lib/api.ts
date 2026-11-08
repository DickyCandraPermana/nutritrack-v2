import useAuthStore from "../store/authStore";

const DEFAULT_API_BASE_URL = "http://localhost:8080/api/v1";

const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "") ||
  DEFAULT_API_BASE_URL
).trim();

/**
 * Structured error class representing API and HTTP failures.
 */
export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly data: T;

  constructor(status: number, statusText: string, data: T, message?: string) {
    const defaultMessage =
      typeof data === "object" && data !== null && "message" in data && typeof (data as Record<string, unknown>).message === "string"
        ? ((data as Record<string, unknown>).message as string)
        : `Request failed with status ${status}: ${statusText}`;

    super(message || defaultMessage);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Resolves full API URL with leading slash normalization.
 */
function resolveUrl(endpoint: string): string {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
}

/**
 * Handles 401 unauthorized errors by evicting auth state and redirecting to login.
 */
function handleUnauthorized(): void {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

/**
 * Low-level fetch wrapper that automatically injects auth token and handles 401.
 * Preserved for full backward compatibility with existing callers.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(resolveUrl(endpoint), {
    ...options,
    headers,
  });

  if (response.status === 401) {
    handleUnauthorized();
  }

  return response;
}

/**
 * High-level typed generic request helper.
 * Parses JSON response, handles no-content (204), and raises ApiError on failures.
 */
export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetchApi(endpoint, options);

  if (!response.ok) {
    let errorData: unknown;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
    } else {
      errorData = await response.text();
    }

    throw new ApiError(response.status, response.statusText, errorData);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

/**
 * Convenient REST verb wrapper methods.
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
