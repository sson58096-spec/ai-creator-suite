import { supabase } from "@/integrations/supabase/client";

// --- Script Generation ---
export interface GenerateScriptRequest {
  topic: string;
  tone?: string;
  length?: "short" | "medium" | "long";
}

export interface GenerateScriptResponse {
  script: string;
  title: string;
  tags: string[];
}

export const generateScript = async (data: GenerateScriptRequest): Promise<GenerateScriptResponse> => {
  const { data: result, error } = await supabase.functions.invoke("generate-script", {
    body: data,
  });
  if (error) throw new Error(error.message || "Failed to generate script");
  if (result?.error) throw new Error(result.error);
  return result;
};

// --- Image Generation ---
export interface GenerateImageRequest {
  prompt: string;
  style?: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
}

export const generateImage = async (data: GenerateImageRequest): Promise<GenerateImageResponse> => {
  const { data: result, error } = await supabase.functions.invoke("generate-image", {
    body: data,
  });
  if (error) throw new Error(error.message || "Failed to generate image");
  if (result?.error) throw new Error(result.error);
  return result;
};

// --- Chat (Streaming) ---
export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: ChatMessage[];
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok || !resp.body) {
    const errData = await resp.json().catch(() => ({}));
    throw new Error(errData.error || `Chat failed: ${resp.status}`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  onDone();
}
