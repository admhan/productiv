import { getApiKey } from './storage';

/**
 * Async stub for AI-powered text processing.
 * Intended for future LLM integration (auto-sorting inbox items, summarizing notes, etc.).
 * Currently returns the input text unchanged.
 * When implemented, this will use the stored API key to call an LLM endpoint.
 */
export async function processWithAI(text: string): Promise<string> {
  void getApiKey();
  return Promise.resolve(text);
}
