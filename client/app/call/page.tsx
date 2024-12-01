"use client";

import React, { useEffect, useState } from "react";
import Call from "@/components/Call";
import Rizzometer from "@/components/Rizzometer";

// Function to analyze the Rizz
const analyzeRizz = async (userTranscript: string) => {
  const API_KEY = 'your-api-key'; // Insert your OpenAI API key here
  console.log("User transcript:", userTranscript);

  const prompt = `Your prompt text...`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userTranscript },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await res.json();
    console.log("OpenAI response:", data);
    const score = parseInt(data.choices[0].message.content.trim(), 10);
    return score;
  } catch (error) {
    console.error("Error fetching data from OpenAI:", error);
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
  const handleAgentTalkingChange = async (isTalking: boolean, updateObject: any) => {
    setIsAgentTalking(isTalking);

    // Get the user's transcript from the updateObject
    const userTranscript = updateObject.transcript?.find((item: any) => item.role === 'user')?.content;

    // Ensure userTranscript exists before analyzing
    if (isTalking && userTranscript) {
      console.log("Analyzing user transcript:", userTranscript);
      let score = await analyzeRizz(userTranscript);
      setRizzScore((prevScore) => prevScore + score);
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
        <img
          src="/assets/giga-chad.jpg"
          alt="Giga Chad Front Profile"
          className={`w-60 h-60 rounded-full object-cover object-center transition-all duration-300 ${
            isAgentTalking ? "glow-border" : ""
          }`}
        />
      </div>

      <div className="mt-8 mb-4 flex items-center space-x-6 justify-center">
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