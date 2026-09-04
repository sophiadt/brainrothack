"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Rizzometer from "@/components/Rizzometer";

// The Retell web SDK is ~95kB and is only needed once the call UI mounts.
// Loading it lazily lets the page paint immediately.
const Call = dynamic(() => import("@/components/Call"), {
  ssr: false,
  loading: () => (
    <p className="text-lg mb-4 italic">Connecting to Giga Chad...</p>
  ),
});

// Ask the server to score the transcript. The OpenAI key lives in the route,
// never in the browser bundle.
const analyzeRizz = async (userTranscript: string) => {
  try {
    const res = await fetch("/api/analyze-rizz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript: userTranscript }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Error: ${res.status}`);
    }

    return typeof data.score === "number" ? data.score : 0;
  } catch (error) {
    // Scoring is a nice-to-have; the demo keeps running without it.
    console.error("Error analyzing rizz:", error);
    return 0;
  }
};

export default function CallPage() {
  const [startCall, setStartCall] = useState(false);
  const [isAgentTalking, setIsAgentTalking] = useState(false);
  const [rizzScore, setRizzScore] = useState(50); // Initial Rizzometer score at 50%

  useEffect(() => {
    setStartCall(true); // Trigger call start when the page loads
  }, []);

  // Function to update the agent talking state and analyze rizz
  const handleAgentTalkingChange = async (isTalking: boolean, userTranscript: string) => {
    setIsAgentTalking(isTalking);

    // Ensure userTranscript exists before analyzing
    if (isTalking && userTranscript) {
      const score = await analyzeRizz(userTranscript);
      // Keep the meter inside 0-100 so the bar can't overflow its track.
      setRizzScore((prevScore) => Math.min(100, Math.max(0, prevScore + score)));
    }
  };

  return (
    <div className="relative bg-gray-900 text-white min-h-screen flex flex-col justify-center">
      {/* Center Rizzometer and Giga Chad image */}
      <div className="text-center">
        <Rizzometer score={rizzScore} />
        <h1 className="text-4xl mb-4">
          <span className="font-extrabold">Giga Chad</span> Lv. 1
        </h1>
      </div>

      {/* Centered image */}
      <div className="flex justify-center mt-8 mb-8">
        <Image
          src="/assets/giga-chad.jpg"
          alt="Giga Chad Front Profile"
          width={240}
          height={240}
          priority
          className={`w-60 h-60 rounded-full object-cover object-center transition-all duration-300 ${
            isAgentTalking ? "glow-border" : ""
          }`}
        />
      </div>

      <div className="mt-1 mb-4 flex items-center space-x-6 justify-center">
        <Call
          startCall={startCall}
          onAgentTalkingChange={handleAgentTalkingChange} // Pass the handler
        />
      </div>

      <style jsx>{`
        .glow-border {
          box-shadow: 0 0 25px 8px rgba(190, 77, 253, 0.8); /* Brighter and blurrier purple glow */
        }
      `}</style>
    </div>
  );
}
