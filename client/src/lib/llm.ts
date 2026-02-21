// StratAlign — Frontend LLM helper
// Uses the Manus built-in Forge API (VITE_FRONTEND_FORGE_API_KEY / VITE_FRONTEND_FORGE_API_URL)
// to make LLM calls from the browser. Credentials are scoped to the frontend.

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  messages: Message[];
  stream?: boolean;
  onChunk?: (chunk: string) => void;
}

export async function invokeLLM({ messages, stream = false, onChunk }: LLMOptions): Promise<string> {
  const apiUrl = import.meta.env.VITE_FRONTEND_FORGE_API_URL;
  const apiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('LLM API not configured. VITE_FRONTEND_FORGE_API_URL and VITE_FRONTEND_FORGE_API_KEY are required.');
  }

  const response = await fetch(`${apiUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages,
      stream,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API error ${response.status}: ${errorText}`);
  }

  if (stream && onChunk) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    if (!reader) throw new Error('No response body');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content ?? '';
          if (content) {
            fullText += content;
            onChunk(content);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }

    return fullText;
  } else {
    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? '';
  }
}
