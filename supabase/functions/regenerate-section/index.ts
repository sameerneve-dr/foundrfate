import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sectionPrompts: Record<string, string> = {
  competitors: `Analyze the competitive landscape for this startup idea. Focus on identifying:
- Direct competitors (companies solving the same problem)
- Indirect competitors (alternative solutions)
- What's already solved in the market
- What gaps remain as opportunities

Return ONLY a valid JSON object with this exact structure:
{
  "directCompetitors": [{"name": "", "coreOffering": "", "strength": "", "weakness": "", "marketGap": ""}],
  "indirectCompetitors": [{"name": "", "coreOffering": "", "strength": "", "weakness": ""}],
  "marketCrowded": boolean,
  "whatIsSolved": "",
  "whatIsNot": ""
}`,

  value: `Analyze the value proposition for this startup idea. Quantify the value in terms of:
- Time saved for users
- Money saved for users
- Risk reduced
- Revenue unlocked
- A compelling reason why this company should exist

Return ONLY a valid JSON object with this exact structure:
{
  "timeSaved": "",
  "moneySaved": "",
  "riskReduced": "",
  "revenueUnlocked": "",
  "whyExist": ""
}`,

  pitch: `Create a compelling 2-3 minute story-driven pitch for this startup idea. The pitch should:
- Start with the user's pain
- Show failure of existing solutions
- Introduce the idea as the turning point
- End with vision and impact

Return ONLY a valid JSON object with this exact structure:
{
  "pitchStory": "The full pitch narrative here..."
}`,

  deck: `Create a pitch deck outline for this startup idea. Cover each essential slide with compelling, specific content.

Return ONLY a valid JSON object with this exact structure:
{
  "problem": "",
  "whyNow": "",
  "solution": "",
  "marketSize": "",
  "businessModel": "",
  "goToMarket": "",
  "differentiator": ""
}`,

  company: `Provide company formation guidance for this startup idea. Consider the purpose, scale intent, and founder background.

Return ONLY a valid JSON object with this exact structure:
{
  "entityType": "LLC" | "C-Corp (Delaware)" | "Non-profit",
  "entityReason": "",
  "whenToIncorporate": "",
  "equityAdvice": ""
}`,

  timeline: `Create a realistic execution timeline for this startup idea. Break it into phases with specific, actionable tasks.

Return ONLY a valid JSON object with this exact structure:
{
  "month0to1": ["task1", "task2", "task3"],
  "month2to3": ["task1", "task2", "task3"],
  "month4to6": ["task1", "task2", "task3"],
  "month7plus": ["task1", "task2", "task3"]
}`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ideaData, section, customInstructions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const sectionPrompt = sectionPrompts[section];
    if (!sectionPrompt) {
      throw new Error(`Unknown section: ${section}`);
    }

    const userPrompt = `${sectionPrompt}

${customInstructions ? `Additional Instructions: ${customInstructions}\n\n` : ''}
Idea Details:
**Idea Name:** ${ideaData.ideaName}
**Problem Statement:** ${ideaData.problemStatement}
**Proposed Solution:** ${ideaData.proposedSolution}
**Target Audience:** ${ideaData.targetAudience}
**Existing Alternatives Known:** ${ideaData.existingAlternatives}
**Purpose:** ${ideaData.purpose === 'hackathon' ? 'Hackathon only' : ideaData.purpose === 'side-project' ? 'Side project' : 'Real startup'}
**Scale Intent:** ${ideaData.scaleIntent === 'lifestyle' ? 'Lifestyle business' : ideaData.scaleIntent === 'venture-scale' ? 'Venture-scale startup' : 'Non-profit / social impact'}
**Founder Background:** ${ideaData.founderBackground}
**Timeline Expectations:** ${ideaData.timeline}`;

    console.log(`Regenerating section: ${section}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are FoundrFate, an AI Startup Architect. Return ONLY valid JSON, no markdown, no explanation." },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from AI");
    }

    console.log("Raw section response:", content);

    let sectionJson;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      sectionJson = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log("Section regenerated successfully");

    return new Response(JSON.stringify({ section, data: sectionJson }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in regenerate-section function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
