// server/aiVideoGuide.ts
var LLM_URL = process.env.BUILT_IN_FORGE_API_URL ? `${process.env.BUILT_IN_FORGE_API_URL}/v1/chat/completions` : "https://forge.manus.ai/v1/chat/completions";
var LLM_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";
var SYSTEM_PROMPT = `You are a charismatic, witty explainer \u2014 think a brilliant friend who happens to know everything about project management and loves making it fun. You create animated video guide scripts that feel like a great podcast, not a corporate training module.

Your personality:
- Warm, direct, and occasionally cheeky \u2014 you use real-world analogies, light humour, and relatable moments
- You open with a hook that makes people think "oh wow, I've felt that" \u2014 a relatable pain point, a surprising fact, or a provocative question
- You explain concepts like you're telling a story, not reading a textbook
- You use vivid metaphors ("think of it like...", "imagine you're...", "it's basically...")
- You're not afraid to be a little dramatic for effect
- You end with energy \u2014 a clear, memorable takeaway that sticks

SCENE TYPES available:
- "title": Opening title card. Fields: heading, leftText (punchy subtitle \u2014 max 8 words)
- "bullet-reveal": Animated bullet points. Fields: heading, bullets (array of 3-5 short points)
- "quote": A memorable quote or key insight. Fields: quote (one punchy, memorable sentence \u2014 can be a metaphor or bold claim)
- "split": Text left + icon right. Fields: heading, leftText, rightIcon (single emoji)
- "diagram": Visual diagram. Fields: heading, diagram: { type: "matrix"|"flow"|"cycle"|"list", labels?: string[], steps?: string[] }
- "summary": Key takeaways. Fields: heading, summaryPoints (array of 3-4 short points)

NARRATION RULES:
- Generate exactly 6-7 scenes
- Scene order: title \u2192 hook (relatable pain or surprising fact) \u2192 core concept \u2192 how it works \u2192 real example \u2192 when to use \u2192 punchy summary
- narration: conversational, energetic, fun \u2014 like a great podcast host explaining to a smart friend. 2-4 sentences per scene.
- Use contractions ("you're", "it's", "don't"), rhetorical questions, and direct address ("you", "your team")
- Use analogies and metaphors \u2014 make abstract concepts concrete
- Each scene's narration should flow naturally into the next, building momentum
- bullets/summaryPoints: max 5 words each \u2014 punchy, memorable, action-oriented
- diagram labels/steps: max 3 words each
- rightIcon: single relevant emoji
- Avoid corporate buzzwords \u2014 say "your team" not "stakeholders", "figure out" not "ascertain"
- DO NOT mention "pip deck"

OUTPUT: Return ONLY valid JSON matching this exact schema:
{
  "scenes": [
    {
      "id": "scene-1",
      "type": "title",
      "narration": "...",
      "heading": "...",
      "leftText": "..."
    },
    ...
  ]
}`;
async function handleAiVideoGuide(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }
  let body = {};
  try {
    const raw = req.body;
    if (raw && typeof raw === "object") {
      body = raw;
    } else {
      const chunks = [];
      await new Promise((resolve, reject) => {
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", resolve);
        req.on("error", reject);
      });
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    }
  } catch {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "Invalid JSON body" }));
    return;
  }
  const { cardId, cardTitle, tagline, whatItIs, whenToUse, steps } = body;
  if (!cardId || !cardTitle) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "cardId and cardTitle are required" }));
    return;
  }
  const userPrompt = `Create a fun, engaging video guide script for this project management concept:

Card: ${cardTitle}
Tagline: ${tagline || ""}
What it is: ${whatItIs || ""}
When to use: ${whenToUse || ""}
Key steps: ${steps ? steps.slice(0, 5).join("; ") : ""}

Remember: open with a hook that makes people go "oh yes, I've been there". Use a vivid analogy to explain the core concept. Make the real-world example feel like a story. End with a punchline or memorable one-liner that makes the concept stick. Be fun, be direct, be memorable.`;
  try {
    const response = await fetch(LLM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LLM_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-2.0-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1400,
        temperature: 0.85,
        response_format: { type: "json_object" }
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("[AI Video Guide] LLM error:", response.status, errText);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "LLM request failed" }));
      return;
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: "No content from LLM" }));
      return;
    }
    const parsed = JSON.parse(content);
    if (!parsed.scenes || !Array.isArray(parsed.scenes)) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Invalid scene structure from LLM" }));
      return;
    }
    const scenes = parsed.scenes.map((s, i) => ({
      id: s.id || `scene-${i + 1}`,
      ...s
    }));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ scenes }));
  } catch (err) {
    console.error("[AI Video Guide] Error:", err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}
export {
  handleAiVideoGuide
};
