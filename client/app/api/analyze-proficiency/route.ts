// app/api/analyze-proficiency/route.ts

import dotenv from "dotenv";
// Load up env file which contains credentials
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import { NextResponse } from "next/server";
import { OpenAI } from "openai"; // Assuming you're using the `openai` package

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationText } = body;

    if (!conversationText) {
      return NextResponse.json(
        { error: "Missing conversationText" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that analyzes the proficiency of a user's conversation. " +
            "Provide detailed feedback on the following aspects: grammar, fluency, vocabulary, " +
            "coherence, and engagement level. For each category, give a score out of 10 " +
            "and offer suggestions for improvement.",
        },
        {
          role: "user",
          content: `Analyze the proficiency of the following conversation:\n\n${conversationText}`,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });
    console.log("OpenAI response:", completion);

    // Extract the response content (score as a string)
    const responseContent = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ content: responseContent });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: `OpenAI API error: ${error.message}` },
      { status: 500 }
    );
  }
}