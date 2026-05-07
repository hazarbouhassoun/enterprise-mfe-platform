/** Resolves after `ms` unless `signal` aborts — matches `fetch` cancellation semantics for TanStack Query. */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(finish, ms);
    function finish() {
      cleanup();
      resolve();
    }
    function onAbort() {
      cleanup();
      reject(new DOMException('Aborted', 'AbortError'));
    }
    function cleanup() {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }
    signal?.addEventListener('abort', onAbort);
  });
}
