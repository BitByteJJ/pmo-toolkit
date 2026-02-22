// server/aiDeepDive.ts
// AI-powered Deep Dive generator for PMO cards
// Returns 5 structured sections: Core Concept, How It Works, Real-World Example, Common Mistakes, When NOT to Use

import type { IncomingMessage, ServerResponse } from 'http';

const SYSTEM_PROMPT = `You are a senior project management educator writing engaging, practical deep-dive content for project managers.

Given a PMO card (tool, technique, or methodology), write a structured deep dive with EXACTLY these 5 sections.
Write in a clear, professional but human tone — like a knowledgeable colleague explaining it over coffee.
Be specific and practical. Use concrete examples. Avoid jargon where possible.

Reply ONLY with JSON in this exact format:
{
  "coreConcept": "2-3 sentences explaining the fundamental idea behind this tool/technique. What problem does it solve? What's the core insight?",
  "howItWorks": "3-4 sentences explaining the mechanics. How do you actually use it? What are the key steps or components? Be specific.",
  "realWorldExample": "3-4 sentences describing a concrete real-world scenario. Name a realistic project type, describe the situation, and show exactly how this tool was applied and what outcome it produced.",
  "commonMistakes": "3-4 sentences describing the 2-3 most common mistakes people make when using this. Be specific about what goes wrong and why.",
  "whenNotToUse": "2-3 sentences describing the situations where this tool is the wrong choice. What conditions make it ineffective or counterproductive?"
}`;

export async function handleAiDeepDive(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Parse request body
  let cardTitle: string;
  let cardTagline: string;
  let cardWhatItIs: string;
  let cardCode: string;

  try {
    let parsed: any;
    if ((req as any)._parsedBody) {
      parsed = (req as any)._parsedBody;
    } else {
      let body = '';
      await new Promise<void>((resolve, reject) => {
        req.on('data', (chunk) => { body += chunk.toString(); });
        req.on('end', resolve);
        req.on('error', reject);
      });
      parsed = JSON.parse(body);
    }
    cardTitle = parsed.title?.trim();
    cardTagline = parsed.tagline?.trim() || '';
    cardWhatItIs = parsed.whatItIs?.trim() || '';
    cardCode = parsed.code?.trim() || '';
    if (!cardTitle) throw new Error('Missing title');
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid request body. Expected { title, tagline, whatItIs, code }' }));
    return;
  }

  const apiUrl = process.env.OPENAI_BASE_URL || process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.OPENAI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'LLM API not configured' }));
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  const userPrompt = `Card: ${cardCode} — ${cardTitle}
Tagline: ${cardTagline}
What it is: ${cardWhatItIs}

Write the deep dive for this PMO card.`;

  try {
    const llmRes = await fetch(`${apiUrl}/v1/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 800,
      }),
    });
    clearTimeout(timeoutId);

    if (!llmRes.ok) {
      const errText = await llmRes.text();
      console.error('[AI Deep Dive] LLM error:', llmRes.status, errText);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'LLM request failed', detail: errText }));
      return;
    }

    const llmData = await llmRes.json() as { choices: Array<{ message: { content: string } }> };
    const content = llmData.choices?.[0]?.message?.content ?? '';

    let parsed: {
      coreConcept: string;
      howItWorks: string;
      realWorldExample: string;
      commonMistakes: string;
      whenNotToUse: string;
    };
    try {
      const cleaned = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[AI Deep Dive] Failed to parse LLM JSON:', content);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to parse LLM response', raw: content }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(parsed));
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === 'AbortError') {
      console.error('[AI Deep Dive] Request timed out');
      res.writeHead(504, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Request timed out. Please try again.' }));
    } else {
      console.error('[AI Deep Dive] Unexpected error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
}
