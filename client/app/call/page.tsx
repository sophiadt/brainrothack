"use client";

import React, { useEffect, useState } from "react";
import Call from "@/components/Call";

export default function CallPage() {
  const [startCall, setStartCall] = useState(false);

  useEffect(() => {
    setStartCall(true); // Trigger call start when the page loads
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <Call startCall={startCall} />
      <h1 className="text-4xl font-bold mb-4">Giga Chad Lv. 1</h1>
      <p className="text-lg">Listening...</p>
      <div className="mt-8 flex items-center space-x-6">
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full"
          onClick={() => setStartCall(false)} // Optional: stop the call
        >
          Hang Up
        </button>
        <button
          style={{ backgroundColor: "#BE4DFD" }}
          className="hover:opacity-90 text-white px-6 py-3 rounded-full"
        >
          See Analysis
        </button>
      </div>
    </div>
  );
}