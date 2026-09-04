// app/api/analyze-rizz/route.ts
//
// Scores a single user utterance for "rizz". The OpenAI key stays on the
// server; the browser only ever sees the resulting number.

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const SYSTEM_PROMPT =
  "You rate how much 'rizz' (charisma, smoothness, flirtatious confidence) a " +
  "single line of dialogue has. Reply with ONLY an integer between -10 and 10: " +
  "negative for cringe or awkward, positive for smooth and charming, 0 for neutral. " +
  "No words, no punctuation, just the integer.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript } = body;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "transcript is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Demo mode: with no key configured the site should still work, so return a
    // neutral score rather than an error. `configured` lets the UI tell the
    // difference between "scored 0" and "scoring is switched off".
    if (!apiKey) {
      return NextResponse.json({ score: 0, configured: false });
    }

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: transcript },
      ],
      max_tokens: 8,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    const parsed = Number.parseInt(raw, 10);

    return NextResponse.json({
      score: Number.isNaN(parsed) ? 0 : parsed,
      configured: true,
    });
  } catch (error: unknown) {
    console.error("Error analyzing rizz:", error);
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: `Failed to analyze rizz: ${message}` },
      { status: 500 }
    );
  }
}
