"use client";

import React, { useEffect, useState } from "react";
import Call from "@/components/Call";

export default function CallPage() {
  const [startCall, setStartCall] = useState(false);
  const [isAgentTalking, setIsAgentTalking] = useState(false); // State to track agent talking

  useEffect(() => {
    setStartCall(true); // Trigger call start when the page loads
  }, []);

  // Function to update the agent talking state
  const handleAgentTalkingChange = (isTalking: boolean) => {
    setIsAgentTalking(isTalking);
  };

  return (
    <div className="relative bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
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
      `}</style>
    </div>
  );
}