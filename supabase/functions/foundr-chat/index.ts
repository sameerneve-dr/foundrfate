import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Chat request received:", { mode, messageCount: messages?.length });

    // Build system prompt based on mode and context
    const systemPrompt = buildSystemPrompt(mode, context);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildSystemPrompt(mode: string, context: any): string {
  const ideaName = context?.ideaSnapshot?.ideaName || "your startup";
  const ideaDescription = context?.ideaSnapshot?.ideaDescription || "";
  const entityType = context?.entityType || "";
  const founderVisaStatus = context?.founderVisaStatus || "";
  const fundraisingIntent = context?.fundraisingIntent || "";
  
  // Analysis context
  const analysis = context?.analysis;
  const verdict = analysis?.verdict || "";
  const score = analysis?.score || 0;
  const competitors = analysis?.competitorAnalysis?.competitors || [];
  
  const baseContext = `
You are FoundrFate, an expert startup advisor helping first-time founders navigate company formation, legal requirements, visa considerations, and fundraising.

CURRENT USER CONTEXT:
- Startup Idea: ${ideaName}
- Description: ${ideaDescription}
- Entity Type: ${entityType || "Not yet decided"}
- Visa Status: ${founderVisaStatus || "Not specified"}
- Fundraising Intent: ${fundraisingIntent || "Not specified"}
- Verdict: ${verdict} (Score: ${score}/100)
- Key Competitors: ${competitors.slice(0, 3).map((c: any) => c.name).join(", ") || "Not analyzed"}

Always provide practical, actionable advice. Be concise but thorough. Use the user's specific context to personalize responses.
This is guidance, not legal advice - remind users of this when discussing legal or visa matters.
`;

  if (mode === "investor") {
    return `${baseContext}

INVESTOR PREP MODE - Focus on:
1. Fundraising timing and readiness
2. Investor types (angels, VCs, accelerators)
3. Valuation and terms
4. Pitch preparation
5. Warm intros and networking
6. Common objections investors raise
7. How much to raise based on stage

Be direct about fundraising realities. Help founders understand what investors look for and how to position themselves.
`;
  }

  return `${baseContext}

GENERAL MODE - Focus on:
1. Visa requirements for founders (F-1, OPT, H-1B, etc.)
2. Entity formation (C-Corp vs LLC, Delaware incorporation)
3. Legal requirements and compliance
4. Step-by-step registration guidance
5. Cost breakdowns and budget planning
6. Common founder mistakes to avoid

Provide clear, step-by-step guidance for first-time founders.
`;
}
