import { ApiFetchConfig, ServiceError } from '@/lib/types/common';

const DEFAULT_TIMEOUT_MS = 12000;

function withTimeoutSignal(timeoutMs: number, signal?: AbortSignal | null): AbortSignal {
  if (signal) return signal;
  return AbortSignal.timeout(timeoutMs);
}

export async function safeApiFetch<T>(
  url: string,
  init: RequestInit = {},
  config: ApiFetchConfig = {},
): Promise<T> {
  const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      signal: withTimeoutSignal(timeoutMs, init.signal),
      next: config.nextRevalidate ? { revalidate: config.nextRevalidate, tags: config.tags } : undefined,
    });
  } catch (error) {
    throw new ServiceError({
      message: `Network request failed for ${url}`,
      code: 'NETWORK_ERROR',
      cause: error,
    });
  }

  if (!response.ok) {
    throw new ServiceError({
      message: `API error ${response.status} for ${url}`,
      status: response.status,
      code: 'API_ERROR',
    });
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new ServiceError({
      message: `Invalid JSON response from ${url}`,
      code: 'INVALID_RESPONSE',
      cause: error,
    });
  }
}

export function fallbackOnError<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return promise.catch(() => fallback);
}
