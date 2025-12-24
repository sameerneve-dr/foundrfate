import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are FoundrFate, an AI Startup Architect & Pre-Seed Decision Engine. Your job is to stress-test startup ideas, not flatter them.

Think like a YC partner, hackathon judge, skeptical VC, and pragmatic operator combined.

You must analyze the provided startup idea and return a structured JSON response with the following format:

{
  "decision": "yes" | "conditional" | "no",
  "decisionRationale": {
    "summary": "2-3 sentence explanation of the decision",
    "marketSaturation": "low" | "medium" | "high",
    "differentiation": "weak" | "moderate" | "strong",
    "userUrgency": "low" | "medium" | "high",
    "executionComplexity": "low" | "medium" | "high",
    "founderMarketFit": "weak" | "moderate" | "strong"
  },
  "realNeedAnalysis": {
    "isPainkiller": boolean,
    "usersActivelySearching": boolean,
    "painFrequency": "rare" | "occasional" | "frequent" | "constant",
    "willingness": "Users need this" | "Founders think users need this",
    "explanation": "2-3 sentences on real vs perceived need"
  },
  "competitiveLandscape": {
    "directCompetitors": [
      {
        "name": "Competitor name or category",
        "coreOffering": "What they do",
        "strength": "Their main advantage",
        "weakness": "Their main gap",
        "marketGap": "Opportunity they leave open"
      }
    ],
    "indirectCompetitors": [
      {
        "name": "Competitor name or category",
        "coreOffering": "What they do",
        "strength": "Their main advantage",
        "weakness": "Their main gap"
      }
    ],
    "marketCrowded": boolean,
    "whatIsSolved": "What problems are already addressed",
    "whatIsNot": "What gaps remain"
  },
  "valueAnalysis": {
    "timeSaved": "Estimated time savings (e.g., '5 hrs/week')",
    "moneySaved": "Estimated cost savings (e.g., '$200-500/mo')",
    "riskReduced": "Type of risk addressed",
    "revenueUnlocked": "Potential revenue impact",
    "whyExist": "One sharp paragraph on why this company should exist"
  },
  "pitchStory": "A compelling 2-3 paragraph story-driven pitch starting with user pain, showing failure of existing solutions, introducing the idea as the turning point, and ending with vision",
  "pitchDeck": {
    "problem": "The core problem statement",
    "whyNow": "Why this timing is right",
    "solution": "The proposed solution",
    "marketSize": "TAM/SAM/SOM estimate",
    "businessModel": "How it makes money",
    "goToMarket": "Initial distribution strategy",
    "differentiator": "Key unique advantage"
  },
  "companyFormation": {
    "entityType": "LLC" | "C-Corp (Delaware)" | "Non-profit",
    "entityReason": "Why this structure",
    "whenToIncorporate": "Timing recommendation",
    "equityAdvice": "Founder split considerations"
  },
  "profitStructure": {
    "recommendation": "for-profit" | "non-profit" | "hybrid",
    "reason": "Why this structure fits"
  },
  "timeline": {
    "month0to1": ["Task 1", "Task 2", "Task 3"],
    "month2to3": ["Task 1", "Task 2", "Task 3"],
    "month4to6": ["Task 1", "Task 2", "Task 3"],
    "month7plus": ["Task 1", "Task 2", "Task 3"]
  },
  "pivotSuggestions": [
    {
      "title": "Alternative approach name",
      "description": "How this pivot changes the idea",
      "whyBetter": "Why this might work better"
    }
  ]
}

Be brutally honest. If the idea is bad, say so clearly. If the market is saturated, call it out. Your job is to save founders from wasting months on doomed ideas OR to give them the confidence and roadmap to succeed.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ideaData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `Analyze this startup idea:

**Idea Name:** ${ideaData.ideaName}

**Problem Statement:** ${ideaData.problemStatement}

**Proposed Solution:** ${ideaData.proposedSolution}

**Target Audience:** ${ideaData.targetAudience}

**Existing Alternatives Known:** ${ideaData.existingAlternatives}

**Purpose:** ${ideaData.purpose === 'hackathon' ? 'Hackathon only' : ideaData.purpose === 'side-project' ? 'Side project' : 'Real startup'}

**Scale Intent:** ${ideaData.scaleIntent === 'lifestyle' ? 'Lifestyle business' : ideaData.scaleIntent === 'venture-scale' ? 'Venture-scale startup' : 'Non-profit / social impact'}

**Founder Background:** ${ideaData.founderBackground}

**Timeline Expectations:** ${ideaData.timeline}

Provide your complete analysis as a valid JSON object. Be specific and actionable.`;

    console.log("Calling Lovable AI Gateway for idea analysis...");

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
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
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

    console.log("Raw AI response:", content);

    // Parse the JSON from the response (handle markdown code blocks if present)
    let analysisJson;
    try {
      // Try to extract JSON from markdown code block if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      analysisJson = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Content that failed to parse:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log("Analysis complete:", analysisJson.decision);

    return new Response(JSON.stringify({ analysis: analysisJson }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-idea function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
