import { API_BASE_URL } from "@/lib/constants";

/** Custom error class for API calls */
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

/**
 * Base fetch wrapper for internal API routes.
 * Automatically prepends API_BASE_URL, parses the envelope,
 * and throws APIError on non-zero response codes.
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new APIError(
      `HTTP ${res.status}: ${res.statusText}`,
      res.status
    );
  }

  const json: APIResponse<T> = await res.json();

  if (json.code !== 0) {
    throw new APIError(json.message || "Unknown API error", json.code);
  }

  return json.data;
}

/**
 * Build a query string from a params object, omitting undefined values.
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}
