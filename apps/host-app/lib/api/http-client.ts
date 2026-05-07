import { createLogger } from '@repo/config';

const log = createLogger('host:http');

export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export type HttpClient = {
  getJson<T>(path: string): Promise<T>;
  postJson<T>(path: string, body: unknown): Promise<T>;
};

/**
 * Thin fetch wrapper — swap implementation when you wire tracing headers / refresh logic.
 */
export function createHttpClient(getToken: () => string | null): HttpClient {
  const headers = (extra?: Record<string, string>) => {
    const token = getToken();
    return {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...extra,
    };
  };

  return {
    async getJson<T>(path: string): Promise<T> {
      const res = await fetch(path, { headers: headers() });
      if (!res.ok) {
        log.warn('GET failed', { path, status: res.status });
        throw new HttpError(`Request failed: ${res.status}`, res.status);
      }
      return (await res.json()) as T;
    },
    async postJson<T>(path: string, body: unknown): Promise<T> {
      const res = await fetch(path, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        log.warn('POST failed', { path, status: res.status });
        throw new HttpError(`Request failed: ${res.status}`, res.status);
      }
      return (await res.json()) as T;
    },
  };
}
