"use client";

import React, { useEffect, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import Link from "next/link"; // Import the Link component

const agentId = "agent_367bca6a3560b537e878082e49";

interface RegisterCallResponse {
  access_token: string;
}

const retellWebClient = new RetellWebClient();

const Call = ({
  startCall,
  onAgentTalkingChange,
}: {
  startCall: boolean;
  onAgentTalkingChange: (isTalking: boolean) => void;
}) => {
  const [isCalling, setIsCalling] = useState(false);
  const [showRizzScore, setShowRizzScore] = useState(false); // State to handle rizz score visibility
  const [rizzScore, setRizzScore] = useState<number | null>(null); // Store the rizz score
  const [loading, setLoading] = useState(true); // State for loading text
  const [showListeningText, setShowListeningText] = useState(false); // State to control visibility of the "Your alpha is listening..." text
  const [showHangUpButton, setShowHangUpButton] = useState(false); // State to control visibility of Hang Up button

  // Initialize the SDK and start the call automatically
  useEffect(() => {
    const handleCall = async () => {
      const registerCallResponse = await registerCall(agentId);
      if (registerCallResponse.access_token) {
        retellWebClient
          .startCall({
            accessToken: registerCallResponse.access_token,
          })
          .catch(console.error);
        setIsCalling(true);
      }
    };

    if (startCall) {
      handleCall();
    }

    retellWebClient.on("call_started", () => {
      console.log("call started");
    });

    retellWebClient.on("call_ended", () => {
      console.log("call ended");
      setIsCalling(false);
      onAgentTalkingChange(false); // Update agent talking state
      setRizzScore(Math.floor(Math.random() * 100) + 1); // Example rizz score generation
      setShowRizzScore(true); // Show rizz score after the call ends
      setShowListeningText(false); // Hide "Your alpha is listening..." text after call ends
    });

    retellWebClient.on("agent_start_talking", () => {
      console.log("agent_start_talking");
      onAgentTalkingChange(true); // Notify parent of talking state
    });

    retellWebClient.on("agent_stop_talking", () => {
      console.log("agent_stop_talking");
      onAgentTalkingChange(false); // Notify parent of talking state
    });

    retellWebClient.on("error", (error) => {
      console.error("An error occurred:", error);
      // Stop the call
      retellWebClient.stopCall();
    });
  }, [startCall]);

  // Handle the loading state delay
  useEffect(() => {
    if (startCall) {
      const timer = setTimeout(() => {
        setLoading(false); // Change loading text after 4 seconds
        setShowListeningText(true); // Show the "Your alpha is listening..." text
        setShowHangUpButton(true); // Show the "Hang Up" button after 4 seconds
      }, 4000); // 4 second delay

      return () => clearTimeout(timer);
    }
  }, [startCall]);

  const toggleConversation = async () => {
    if (isCalling) {
      retellWebClient.stopCall();
    } else {
      const registerCallResponse = await registerCall(agentId);
      if (registerCallResponse.access_token) {
        retellWebClient
          .startCall({
            accessToken: registerCallResponse.access_token,
          })
          .catch(console.error);
        setIsCalling(true);
      }
    }
  };

  async function registerCall(agentId: string): Promise<RegisterCallResponse> {
    try {
      const response = await fetch("/api/create-web-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: RegisterCallResponse = await response.json();
      return data;
    } catch (err) {
      console.error("Error registering call:", err);
      throw new Error("Failed to register call");
    }
  }

  return (
    <div>
      {showRizzScore ? (
        <div className="text-center mt-8">
          <p className="text-2xl text-green-500">Your Rizz Score: {rizzScore}</p>
          <Link href="/" passHref>
            <button className="bg-[#BE4DFD] hover:bg-[#CC72FF] text-white font-bold py-2 px-6 rounded-full mt-4">
              Dare to Rizz Again?
            </button>
          </Link>
        </div>
      ) : (
        <div className="text-center">
          {loading && (
            <>
              <p className="text-lg mb-4 italic">Connecting to your alpha...</p>
              <button
                onClick={toggleConversation}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 mt-3 rounded-full"
              >
                Calling your alpha...
              </button>
            </>
          )}

          {showListeningText && !loading && (
            <>
              <p className="text-lg mb-4 italic">Your alpha is listening...</p>
              {showHangUpButton && (
                <button
                  onClick={toggleConversation}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 mt-3 rounded-full"
                >
                  Hang Up
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Call;