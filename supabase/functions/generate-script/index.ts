import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, tone, length } = await req.json();
    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const lengthGuide = length === "short" ? "about 1 minute (150 words)" : length === "long" ? "about 5 minutes (750 words)" : "about 3 minutes (450 words)";
    const toneGuide = tone ? `Use a ${tone} tone.` : "Use an engaging, conversational tone.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a professional YouTube script writer. Write engaging scripts optimized for YouTube. ${toneGuide} Target length: ${lengthGuide}. Format with clear sections: Hook, Intro, Main Content, Call to Action, Outro. Also suggest a catchy title and 5 relevant tags.`,
          },
          { role: "user", content: `Write a YouTube script about: ${topic}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "format_script",
            description: "Return the formatted YouTube script with title and tags",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Catchy YouTube video title" },
                script: { type: "string", description: "The full script text with sections" },
                tags: { type: "array", items: { type: "string" }, description: "5 relevant tags" },
              },
              required: ["title", "script", "tags"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "format_script" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: return raw content
    const content = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ title: topic, script: content, tags: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-script error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
