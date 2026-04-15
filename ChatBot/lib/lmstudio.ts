export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LmStudioChatOptions = {
  baseUrl: string;
  apiKey?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
};

type LmStudioChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

export async function lmStudioChat(
  messages: ChatMessage[],
  options: LmStudioChatOptions,
): Promise<string> {
  const url = `${normalizeBaseUrl(options.baseUrl)}/chat/completions`;
  const apiKey = options.apiKey?.trim();

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 60_000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens,
        stream: false,
      }),
      signal: controller.signal,
    });

    const text = await res.text();
    let json: LmStudioChatCompletionResponse | null = null;
    try {
      json = text ? (JSON.parse(text) as LmStudioChatCompletionResponse) : null;
    } catch {
      // ignore JSON parse errors; handled below
    }

    if (!res.ok) {
      const message =
        json?.error?.message ??
        (text ? text.slice(0, 500) : `HTTP ${res.status}`);
      throw new Error(message);
    }

    return json?.choices?.[0]?.message?.content ?? "";
  } finally {
    clearTimeout(timeout);
  }
}

