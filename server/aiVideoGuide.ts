import type { IncomingMessage, ServerResponse } from 'http';
const LLM_URL = process.env.BUILT_IN_FORGE_API_URL
  ? `${process.env.BUILT_IN_FORGE_API_URL}/v1/chat/completions`
  : 'https://forge.manus.ai/v1/chat/completions';
const LLM_KEY = process.env.BUILT_IN_FORGE_API_KEY || '';

const SYSTEM_PROMPT = `You are an expert instructional designer creating animated motion graphics video guides for project management concepts.

Your task is to generate a structured scene script for an in-browser animated explainer video.

SCENE TYPES available:
- "title": Opening title card. Fields: heading, leftText (subtitle/tagline)
- "bullet-reveal": Animated bullet points. Fields: heading, bullets (array of 3-5 short points)
- "quote": A memorable quote or key insight. Fields: quote (one impactful sentence)
- "split": Text left + icon right. Fields: heading, leftText, rightIcon (single emoji)
- "diagram": Visual diagram. Fields: heading, diagram: { type: "matrix"|"flow"|"cycle"|"list", labels?: string[], steps?: string[] }
- "summary": Key takeaways. Fields: heading, summaryPoints (array of 3-4 short points)

RULES:
- Generate exactly 6-7 scenes for each card
- Scene order: title → hook/why → core concept → how it works → diagram/example → when to use → summary
- narration: conversational, human, warm tone — like explaining to a colleague over coffee. 2-4 sentences per scene.
- Each narration should flow naturally into the next scene
- bullets/summaryPoints: max 5 words each — punchy, memorable
- diagram labels/steps: max 3 words each
- rightIcon: single relevant emoji
- DO NOT use jargon without explaining it
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

export async function handleAiVideoGuide(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method not allowed');
    return;
  }

  // Parse body
  let body: { cardId?: string; cardTitle?: string; tagline?: string; whatItIs?: string; whenToUse?: string; steps?: string[] } = {};
  try {
    const raw = (req as any).body;
    if (raw && typeof raw === 'object') {
      body = raw;
    } else {
      const chunks: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', resolve);
        req.on('error', reject);
      });
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    }
  } catch {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  const { cardId, cardTitle, tagline, whatItIs, whenToUse, steps } = body;
  if (!cardId || !cardTitle) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'cardId and cardTitle are required' }));
    return;
  }

  const userPrompt = `Create a video guide scene script for this project management card:

Card ID: ${cardId}
Title: ${cardTitle}
Tagline: ${tagline || ''}
What it is: ${whatItIs || ''}
When to use: ${whenToUse || ''}
Key steps: ${steps ? steps.slice(0, 5).join('; ') : ''}

Generate 6-7 engaging scenes that explain this concept clearly and memorably.`;

  try {
    const response = await fetch(LLM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LLM_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 1200,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[AI Video Guide] LLM error:', response.status, errText);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'LLM request failed' }));
      return;
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'No content from LLM' }));
      return;
    }

    // Parse and validate
    const parsed = JSON.parse(content);
    if (!parsed.scenes || !Array.isArray(parsed.scenes)) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Invalid scene structure from LLM' }));
      return;
    }

    // Ensure each scene has an id
    const scenes = parsed.scenes.map((s: Record<string, unknown>, i: number) => ({
      id: s.id || `scene-${i + 1}`,
      ...s,
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ scenes }));
  } catch (err) {
    console.error('[AI Video Guide] Error:', err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}
