import type { FetchOptions, ServiceError, ServiceResult } from "@/lib/types/common";

const DEFAULT_TIMEOUT_MS = 10_000;

function createError(code: string, message: string, status?: number, cause?: unknown): ServiceError {
  return { code, message, status, cause };
}

export async function safeFetchJson<T>(
  url: string,
  init?: RequestInit,
  options: FetchOptions = {},
): Promise<ServiceResult<T>> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      cache: options.cache ?? "force-cache",
      next: {
        revalidate: options.revalidate ?? 300,
        tags: options.tags,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        data: null,
        error: createError("HTTP_ERROR", `Request failed with status ${response.status}.`, response.status),
        fetchedAt: new Date().toISOString(),
        fromCache: false,
      };
    }

    const body = (await response.json()) as T;
    if (body == null || typeof body !== "object") {
      return {
        data: null,
        error: createError("INVALID_RESPONSE", "API returned an invalid payload."),
        fetchedAt: new Date().toISOString(),
        fromCache: false,
      };
    }

    return {
      data: body,
      error: null,
      fetchedAt: new Date().toISOString(),
      fromCache: false,
    };
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === "AbortError";

    return {
      data: null,
      error: createError(
        isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
        isTimeout ? "Request timed out." : "Network request failed.",
        undefined,
        error,
      ),
      fetchedAt: new Date().toISOString(),
      fromCache: false,
    };
  } finally {
    clearTimeout(timeout);
  }
}
