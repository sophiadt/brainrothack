// app/api/get-call-analysis/route.ts

import { NextRequest, NextResponse } from "next/server";
import Retell from "retell-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { call_id } = body;

    if (!call_id) {
      return NextResponse.json(
        { error: "call_id is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RETELL_API_KEY;

    if (!apiKey) {
      console.error("RETELL_API_KEY is not set");
      return NextResponse.json(
        { error: "Server is not configured with a Retell API key" },
        { status: 500 }
      );
    }

    const retellClient = new Retell({ apiKey });
    const call = await retellClient.call.retrieve(call_id);

    const customAnalysisData = call.call_analysis?.custom_analysis_data as
      | Record<string, unknown>
      | undefined;
    const rizzResults = customAnalysisData?.rizz_results;

    if (!rizzResults) {
      return NextResponse.json(
        { error: "rizz_results not found in custom analysis data" },
        { status: 404 }
      );
    }

    return NextResponse.json({ rizz_results: String(rizzResults) });
  } catch (error: unknown) {
    console.error("Error fetching call analysis:", error);
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: `Failed to fetch call analysis: ${message}` },
      { status: 500 }
    );
  }
}
