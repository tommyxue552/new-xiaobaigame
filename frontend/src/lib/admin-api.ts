import { API_BASE_URL } from "@/lib/constants";
import { useAdminAuthStore } from "@/store/admin-auth";

export class APIError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.name = "APIError";
    this.code = code;
  }
}

interface APIResponse<T> {
  code: number;
  message: string;
  data: T;
}

async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = useAdminAuthStore.getState().token;
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    useAdminAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new APIError("Unauthorized", 401);
  }

  if (!res.ok) {
    throw new APIError(`HTTP ${res.status}`, res.status);
  }

  const json: APIResponse<T> = await res.json();

  if (json.code !== 0) {
    throw new APIError(json.message || "Unknown API error", json.code);
  }

  return json.data;
}

export { adminFetch };
