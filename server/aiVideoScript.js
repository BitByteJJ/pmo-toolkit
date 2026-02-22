// server/aiVideoScript.ts
var SYSTEM_PROMPT = `You are a project management educator writing engaging video scripts for a YouTube/LinkedIn audience.

Write a ~2-minute video script (approximately 300-350 words when spoken at a natural pace) for a PMO card.

The script must be:
- Conversational and human \u2014 like a knowledgeable friend explaining it, not a textbook
- Engaging from the first sentence \u2014 hook the viewer immediately
- Practical \u2014 include a concrete real-world example
- Structured with clear section markers

Reply ONLY with JSON in this exact format:
{
  "hook": "1-2 punchy sentences that grab attention and set up the problem this tool solves. Ask a relatable question or describe a frustrating scenario.",
  "coreConcept": "2-3 sentences explaining what this tool/technique IS in plain language. No jargon. Explain it like you're talking to a smart friend who doesn't know PM.",
  "whyItWorks": "2-3 sentences on the psychology or logic behind why this approach is effective. What insight does it leverage?",
  "whatItDoes": "3-4 sentences on what it actually does in practice. Walk through the key steps or components concisely.",
  "whenToUse": "2 sentences on the ideal conditions for using this. Be specific \u2014 what situation, what project type, what signal tells you to reach for this tool?",
  "whenNotToUse": "2 sentences on when to avoid it. What conditions make it the wrong choice?",
  "callToAction": "1-2 sentences wrapping up and encouraging the viewer to try it. Keep it energetic and actionable."
}`;
async function handleAiVideoScript(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  let cardTitle;
  let cardTagline;
  let cardWhatItIs;
  let cardCode;
  let cardWhenToUse;
  try {
    let parsed;
    if (req._parsedBody) {
      parsed = req._parsedBody;
    } else {
      let body = "";
      await new Promise((resolve, reject) => {
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", resolve);
        req.on("error", reject);
      });
      parsed = JSON.parse(body);
    }
    cardTitle = parsed.title?.trim();
    cardTagline = parsed.tagline?.trim() || "";
    cardWhatItIs = parsed.whatItIs?.trim() || "";
    cardCode = parsed.code?.trim() || "";
    cardWhenToUse = parsed.whenToUse?.trim() || "";
    if (!cardTitle) throw new Error("Missing title");
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid request body. Expected { title, tagline, whatItIs, code, whenToUse }" }));
    return;
  }
  const apiUrl = process.env.OPENAI_BASE_URL || process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.OPENAI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY;
  if (!apiUrl || !apiKey) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "LLM API not configured" }));
    return;
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25e3);
  const userPrompt = `Card: ${cardCode} \u2014 ${cardTitle}
Tagline: ${cardTagline}
What it is: ${cardWhatItIs}
When to use: ${cardWhenToUse}

Write the video script for this PMO card.`;
  try {
    const llmRes = await fetch(`${apiUrl}/v1/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gemini-2.0-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 900
      })
    });
    clearTimeout(timeoutId);
    if (!llmRes.ok) {
      const errText = await llmRes.text();
      console.error("[AI Video Script] LLM error:", llmRes.status, errText);
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "LLM request failed", detail: errText }));
      return;
    }
    const llmData = await llmRes.json();
    const content = llmData.choices?.[0]?.message?.content ?? "";
    let parsed;
    try {
      const cleaned = content.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("[AI Video Script] Failed to parse LLM JSON:", content);
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to parse LLM response", raw: content }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(parsed));
  } catch (err) {
    clearTimeout(timeoutId);
    if (err?.name === "AbortError") {
      console.error("[AI Video Script] Request timed out");
      res.writeHead(504, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Request timed out. Please try again." }));
    } else {
      console.error("[AI Video Script] Unexpected error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
}
export {
  handleAiVideoScript
};
