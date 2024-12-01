"use client";

import dotenv from "dotenv";
// Load up env file which contains credentials
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import React, { useState, useEffect } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import Link from "next/link"; // Import the Link component
import Retell from "retell-sdk"; // Import the Retell SDK

const agentId = "agent_5e9cb4810e60247b0a957428ff";

interface RegisterCallResponse {
  access_token: string;
  call_id: string; // Add call_id to the response
}

const retellWebClient = new RetellWebClient();

const Call = ({
  startCall,
  onAgentTalkingChange,
}: {
  startCall: boolean;
  onAgentTalkingChange: (isTalking: boolean, userTranscript: string) => void;
}) => {
  const [isCalling, setIsCalling] = useState(false);
  const [showRizzScore, setShowRizzScore] = useState(false); // State to handle rizz score visibility
  const [rizzMessage, setRizzMessage] = useState<string>(""); // Store rizz results message
  const [loading, setLoading] = useState(false); // State for loading text
  const [showHangUpButton, setShowHangUpButton] = useState(false); // State to control visibility of Hang Up button
  const [showListeningText, setShowListeningText] = useState(false); // State to control visibility of the "Your alpha is listening..." text
  const [transcriptContent, setTranscriptContent] = useState<string>(""); // State to store the most recent transcript content
  const [callId, setCallId] = useState<string>(""); // State to store the call_id after registering the call
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false); // State to manage loading animation for the call analysis

  const retellClient = new Retell({
    apiKey: "", // Fetch API key from environment variables
  });

  console.log("apikey", process.env.RETELL_API_KEY);

  // Initialize the SDK and start the call manually
  useEffect(() => {
    let callStarted = false; // To prevent duplicate calls

    const handleCall = async () => {
      if (callStarted) return; // Skip if already started
      callStarted = true;

      try {
        const registerCallResponse = await registerCall(agentId);
        if (registerCallResponse.access_token) {
          await retellWebClient.startCall({
            accessToken: registerCallResponse.access_token,
          });
          setIsCalling(true);

          // Store the call_id so it can be used after the call ends
          setCallId(registerCallResponse.call_id);
        }
      } catch (err) {
        console.error("Error starting call:", err);
      }
    };

    retellWebClient.on("call_started", () => {
      console.log("Call started");
    });

    retellWebClient.on("call_ended", async () => {
      console.log("Call ended");
      setIsCalling(false);
      onAgentTalkingChange(false, ""); // Update agent talking state
      setShowRizzScore(true); // Show rizz score after the call ends
      setShowListeningText(false); // Hide "Your alpha is listening..." text after call ends

      // After the call ends, fetch the call analysis using callId
      if (callId) {
        console.log("Fetching call analysis...", callId);

        setIsLoadingAnalysis(true); // Start the loading animation
        await delay(2000); // Delay before fetching analysis
        const callAnalysis = await getCallAnalysis(callId);
        setRizzMessage(callAnalysis); // Set rizz results
        setIsLoadingAnalysis(false); // Stop the loading animation
      }
    });

    retellWebClient.on("agent_start_talking", () => {
      console.log("agent_start_talking");
      onAgentTalkingChange(true, transcriptContent); // Notify parent of talking state and pass the user transcript
    });

    retellWebClient.on("agent_stop_talking", () => {
      console.log("agent_stop_talking");
      onAgentTalkingChange(false, ""); // Notify parent of talking state
    });

    // Update message such as transcript
    retellWebClient.on("update", (update) => {
      if (update.transcript.length > 0) {
        const latestContent = update.transcript[update.transcript.length - 1]?.content;
        setTranscriptContent(latestContent);
      }
    });

    retellWebClient.on("error", (error) => {
      console.error("An error occurred:", error);
      // Stop the call
      retellWebClient.stopCall();
    });
  }, [callId]);

  // Handle the loading state delay
  useEffect(() => {
    if (isCalling) {
      const timer = setTimeout(() => {
        setLoading(false); // Change loading text after 0 seconds
        setShowListeningText(true); // Show the "Your alpha is listening..." text
        setShowHangUpButton(true); // Show the "Hang Up" button after 0 seconds
      }, 0); // 0 second delay

      return () => clearTimeout(timer);
    }
  }, [isCalling]);

  const toggleConversation = async () => {
    if (isCalling) {
      retellWebClient.stopCall();
      setIsCalling(false);
      setShowHangUpButton(false);
      setShowListeningText(false);
    } else {
      setLoading(true); // Show loading text immediately
      const registerCallResponse = await registerCall(agentId);
      if (registerCallResponse.access_token) {
        await retellWebClient
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
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data: RegisterCallResponse = await response.json();
      return data;
    } catch (err) {
      console.error("Error in registerCall function:", err.message);
      throw new Error("Failed to register call: " + err.message);
    }
  }

  // Fetch the call analysis using call_id after the call ends
  async function getCallAnalysis(callId: string) {
    try {
      const response = await retellClient.call.retrieve(callId);

      // Check if 'call_analysis' and 'custom_analysis_data' exist in the response
      if (response.call_analysis && response.call_analysis.custom_analysis_data) {
        const customAnalysisData = response.call_analysis.custom_analysis_data;

        // Check if rizz_results is available
        if (customAnalysisData.rizz_results) {
          return customAnalysisData.rizz_results; // Return rizz_results
        } else {
          throw new Error("rizz_results not found in custom analysis data");
        }
      } else {
        throw new Error("No call analysis or custom analysis data available");
      }
    } catch (err) {
      console.error("Error fetching call analysis:", err);
      return "Error retrieving rizz results"; // Return error message
    }
  }

  return (
    <div>
      {showRizzScore ? (
        <div className="text-center mt-8">
          <p className="text-2xl text-white">Rizz Results: {rizzMessage}</p>
          <Link href="/" passHref>
            <button className="bg-[#BE4DFD] hover:bg-[#CC72FF] text-white font-bold py-2 px-6 rounded-full mt-4">
              End Gooning Session
            </button>
          </Link>
        </div>
      ) : (
        <div className="text-center">
          {!isCalling && !loading && (
            <button
              onClick={toggleConversation}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 mt-3 rounded-full"
            >
              Call Alpha
            </button>
          )}

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
              {/* Transcript Box with fixed size */}
              <div
                className="transcript-box"
                style={{
                  maxWidth: "40rem", // Adjust width as needed
                  margin: "0 auto",
                  whiteSpace: "pre-wrap", // Ensures line breaks are respected
                  wordWrap: "break-word", // Prevents overflow of long words
                }}
              >
                <p className="text-lg mb-4 italic">{transcriptContent || "Your alpha is listening..."}</p>
              </div>

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

          {isLoadingAnalysis && (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p className="mt-4 text-lg">Fetching rizz results...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Call;