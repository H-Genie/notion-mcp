import OpenAI from "openai";

const baseURL =
  process.env.OLLAMA_BASE_URL?.replace(/\/$/, "") || "http://localhost:11434";

/**
 * Ollama 서버(localhost:11434)에 연결하는 OpenAI 호환 클라이언트
 * @see https://github.com/ollama/ollama/blob/main/docs/api.md
 */
export const ollama = new OpenAI({
  baseURL: `${baseURL}/v1`,
  apiKey: "ollama",
});

export const OLLAMA_BASE_URL = baseURL;

export const defaultModel = process.env.OLLAMA_MODEL || "gemma3:4b";
