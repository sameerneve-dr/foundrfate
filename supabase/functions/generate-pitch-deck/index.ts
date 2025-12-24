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
    const { ideaSnapshot, analysis, entityType, fundraisingIntent } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating pitch deck for:", ideaSnapshot?.ideaName);

    const prompt = buildPitchDeckPrompt(ideaSnapshot, analysis, entityType, fundraisingIntent);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert pitch deck creator. Generate professional, investor-ready pitch deck content." },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_pitch_deck",
              description: "Generate a complete pitch deck with slides",
              parameters: {
                type: "object",
                properties: {
                  slides: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        subtitle: { type: "string" },
                        bullets: { 
                          type: "array",
                          items: { type: "string" }
                        },
                        notes: { type: "string" }
                      },
                      required: ["id", "title", "bullets"]
                    }
                  }
                },
                required: ["slides"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_pitch_deck" } }
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
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate pitch deck");
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const pitchDeck = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(pitchDeck), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid response format from AI");
  } catch (error) {
    console.error("Pitch deck generation error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildPitchDeckPrompt(ideaSnapshot: any, analysis: any, entityType: string, fundraisingIntent: string): string {
  const competitors = analysis?.competitorAnalysis?.competitors || [];
  const directCompetitors = competitors.filter((c: any) => c.type === 'direct').slice(0, 3);
  
  return `Generate a professional 10-slide pitch deck for this startup:

STARTUP INFO:
- Name: ${ideaSnapshot?.ideaName || "Unnamed Startup"}
- Description: ${ideaSnapshot?.ideaDescription || "No description"}
- Target Customer: ${ideaSnapshot?.targetCustomer || "Not specified"}
- Problem: ${ideaSnapshot?.problemStatement || "Not specified"}
- Solution: ${ideaSnapshot?.solutionApproach || "Not specified"}

ANALYSIS:
- Verdict: ${analysis?.verdict || "N/A"} (Score: ${analysis?.score || 0}/100)
- Market Saturation: ${analysis?.decisionRationale?.marketSaturation || "Unknown"}
- Differentiation: ${analysis?.decisionRationale?.differentiation || "Unknown"}
- User Urgency: ${analysis?.decisionRationale?.userUrgency || "Unknown"}

COMPETITORS:
${directCompetitors.map((c: any) => `- ${c.name}: ${c.coreOffering || "N/A"}`).join("\n") || "No competitors analyzed"}

CONTEXT:
- Entity Type: ${entityType || "Not decided"}
- Fundraising Intent: ${fundraisingIntent || "Not specified"}

Generate slides for:
1. Title Slide (company name, tagline)
2. Problem (the pain point you're solving)
3. Solution (your product/service)
4. Market Opportunity (TAM/SAM/SOM if possible)
5. Product (key features, how it works)
6. Business Model (how you make money)
7. Traction (or planned milestones if pre-launch)
8. Competition (landscape and your advantage)
9. Team (placeholder for founder info)
10. Ask (funding amount and use of funds)

Make each slide concise with 3-5 bullet points. Use the actual startup context provided.`;
}
