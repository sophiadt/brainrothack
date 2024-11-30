"use client";

import React, { useEffect, useState } from "react";
import Call from "@/components/Call";

export default function CallPage() {
  const [startCall, setStartCall] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStartCall(true); // Trigger call start when the page loads
  }, []);

  useEffect(() => {
    if (startCall) {
      // Simulate a delay for the call to start
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // Adjust the delay as needed

      return () => clearTimeout(timer);
    }
  }, [startCall]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Giga Chad Lv. 1</h1>
      <div className="mt-8 mb-4">
        <img
          src="/assets/giga-chad.jpg"
          alt="Giga Chad Front Profile"
          className="w-60 h-60 rounded-full object-cover object-center"
        />
      </div>
      <p className="text-lg mb-2">{loading ? "Connecting to your alpha..." : "Your alpha is listening..."}</p>
      <div className="mt-8 flex items-center space-x-6">
        <Call startCall={startCall} />
        {/* <button
          style={{ backgroundColor: "#BE4DFD" }}
          className="hover:opacity-90 text-white px-6 py-3 rounded-full"
        >
          See Analysis
        </button> */}
      </div>
    </div>
  );
}