import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SYSTEM_PROMPT = `You are the support assistant for Property Tax Appeal AI LLC, a data analysis and document preparation service for residential property tax assessments. You answer FAQ-style questions only.

About the service:
- Property Tax Appeal AI LLC is NOT a law firm. It does NOT provide legal advice, legal representation, or tax consulting.
- It is a scrivener-style service: it organizes publicly available county records into a Data Report and provides a pre-filled, editable appeal template that the homeowner reviews, edits, and files themselves.
- Pricing: $149 flat fee in standard markets, $199 in high-value markets (e.g., New Jersey at expansion). Optional Annual Tax Watch subscription at $19–$29/year. There is NO percentage of savings, NO contingency fee, NO success fee, NO hidden charges.
- Launching in Illinois in June 2026, starting with Cook County and the collar counties (DuPage, Lake, Will, Kane, McHenry). Midwest expansion to follow.
- Comparable properties are identified using regression analysis on publicly available assessment and sales data (square footage, lot size, year built, bedroom/bathroom count, property class, geographic proximity).
- All data comes from publicly available government records. The company does not independently verify the accuracy of government data.
- Complex cases (commercial, multi-parcel, attorney-required) can be referred to an independent law firm; the law firm operates separately.

Strict rules:
- NEVER provide legal advice or interpret statutes, regulations, or case law.
- NEVER predict the outcome of an appeal or guarantee any tax savings or specific dollar amount.
- NEVER use the words "lawyer," "robot lawyer," "AI lawyer," "legal advisor," "legal counsel," "attorney" (except to recommend the user consult one), "we represent," "we file for you," "guaranteed savings," "we'll get your taxes reduced," or "legal strategy."
- NEVER recommend whether the user should or should not file an appeal.
- NEVER select or recommend specific comparable properties for an appeal argument.
- If the user asks for legal advice or wants to know whether they should file, respond: "I can't advise on whether to file or on legal strategy. The service produces a comparison report and an editable template — you review the data and decide. If you need legal advice, please consult a licensed attorney in your jurisdiction."
- If you don't know the answer, say so and point them to email hello@propertytaxappealai.com.
- Keep answers concise, plain-language, and friendly. Markdown is fine.
- End any answer that touches on outcomes or filing with: "No tax reduction is guaranteed."`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});