"use client";

import React, { useEffect, useState } from "react";
import Call from "@/components/Call";
import Rizzometer from "@/components/Rizzometer";

const analyzeRizz = async (userTranscript: string) => {
  const API_KEY = ''; // Insert your OpenAI API key here
  console.log("User transcript:", userTranscript);

  const prompt = `
      You are a rizz expert analyzing the responses of the user who is trying to rizz the male lead of an otome game. The male lead has the personality of a "Giga Chad"—an egotistical sigma male alpha who uses a lot of brainrot humor and modern lingo. Based on the user response, your task is to evaluate and assign a whole number score from -10 to 10, based on the following criteria:

      - **Flirting Ability**: How effectively does the user convey interest or attraction?
      - **Romanticness**: How romantic is the response?
      - **Rizzness**: How well does the response handle rizz (effortless charm)?
      - **Brainrot Compatibility**: How well does the user's response match the brainrot and modern lingo personality of the male lead?

      # Scoring Breakdown

      - Score from **-10** to **10** based on:
      - Effectiveness of flirting and romance.
      - Compatibility with the "Giga Chad" personality.
      - Memorability—does the response stand out?

      # Output Format

      Provide the score as a whole number from -10 to 10.

      # Examples

      - **Score -10 Example**:  
      **User Response**: "I think you're okay, I guess, but whatever."  
      **Score**: -10  

      - **Score 0 Example**:  
      **User Response**: "My name is Gojo."  
      **Score**: 0  

      - **Score 10 Example**:  
      **User Response**: "I'd let you bench-press me any day, big guy."  
      **Score**: 10  

      # Notes

      - Make sure to consider the balance of romance and flirtation within the context of the exaggerated personality of the male lead.
      - A higher score should also reflect good adaptation to brainrot humor and modern slang that the male lead might appreciate.`;

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
          {
            role: "user",
            content: userTranscript,
          },
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
  const [isAgentTalking, setIsAgentTalking] = useState(false); // State to track agent talking
  const [rizzScore, setRizzScore] = useState(50); // Initial Rizzometer score at 50%

  useEffect(() => {
    setStartCall(true); // Trigger call start when the page loads
  }, []);

  // Function to update the agent talking state and analyze rizz
  const handleAgentTalkingChange = async (isTalking: boolean, userTranscript: string) => {
    setIsAgentTalking(isTalking);
    if (isTalking && userTranscript) {
      console.log("Analyzing user transcript:", userTranscript);
      let score = await analyzeRizz(userTranscript);
      setRizzScore((prevScore) => prevScore + score);
    }
  };

  return (
    <div className="relative bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <Rizzometer score={rizzScore} />
      <h1 className="text-4xl mb-4">
        <span className="font-extrabold">Giga Chad</span> Lv. 1
      </h1>
      <div className="mt-8 mb-8">
        <img
          src="/assets/giga-chad.jpg"
          alt="Giga Chad Front Profile"
          className={`w-60 h-60 rounded-full object-cover object-center transition-all duration-300 ${
            isAgentTalking ? "glow-border" : ""
          }`}
        />
      </div>
      <div className="mt-8 mb-4 flex items-center space-x-6">
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