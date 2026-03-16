const DEFAULT_TIMEOUT_MS = 10_000;

export async function fetchWithTimeout(
  input: string | URL,
  init: (RequestInit & { timeoutMs?: number }) | undefined = undefined,
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...rest } = init ?? {};

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input.toString(), {
      ...rest,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The request took too long to respond. Please check your connection and try again.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

