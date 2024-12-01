import React, { useEffect, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import Link from "next/link";
import Retell from "retell-sdk";

const agentId = "agent_5e9cb4810e60247b0a957428ff";

interface RegisterCallResponse {
  access_token: string;
  call_id: string;
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
  const [showRizzScore, setShowRizzScore] = useState(false);
  const [rizzMessage, setRizzMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showHangUpButton, setShowHangUpButton] = useState(false);
  const [showListeningText, setShowListeningText] = useState(false);
  const [transcriptContent, setTranscriptContent] = useState<string>("");
  const [callId, setCallId] = useState<string>("");
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const retellClient = new Retell({
    apiKey: "",
  });

  // Handle start call and register the call
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
        setCallId(registerCallResponse.call_id);  // Store the call ID
      }
    };

    if (startCall) {
      handleCall();
    }

    retellWebClient.on("call_started", () => {
      console.log("call started");
    });

    retellWebClient.on("call_ended", async () => {
      console.log("call ended");
      setIsCalling(false);
      onAgentTalkingChange(false, "");
      setShowRizzScore(true);
      setShowListeningText(false);
    });

    retellWebClient.on("agent_start_talking", () => {
      console.log("agent_start_talking");
      onAgentTalkingChange(true, transcriptContent);
    });

    retellWebClient.on("agent_stop_talking", () => {
      console.log("agent_stop_talking");
      onAgentTalkingChange(false, "");
    });

    retellWebClient.on("update", (update) => {
      if (update.transcript.length > 0) {
        const latestContent = update.transcript[update.transcript.length - 1]?.content;
        setTranscriptContent(latestContent);
      }
    });

    retellWebClient.on("error", (error) => {
      console.error("An error occurred:", error);
      retellWebClient.stopCall();
    });
  }, [startCall]); // Only depends on startCall

  // Handle the loading state delay and show listening text after startCall is true
  useEffect(() => {
    if (startCall) {
      const timer = setTimeout(() => {
        setLoading(false);
        setShowListeningText(true);
        setShowHangUpButton(true);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [startCall]);

  // Fetch the call analysis once the callId is set and the call has ended
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (callId && !isCalling) { // Check if the call has ended and the callId is set
        setIsLoadingAnalysis(true);
        await delay(5000); // Delay before fetching analysis
        const callAnalysis = await getCallAnalysis(callId);
        setRizzMessage(callAnalysis);
        setIsLoadingAnalysis(false);
      }
    };

    if (callId && !isCalling) {
      fetchAnalysis();
    }
  }, [callId, isCalling]); // Depends on callId and isCalling

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

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

      const responseBody = await response.text();
      if (!responseBody) {
        throw new Error("Empty response body");
      }

      const data: RegisterCallResponse = JSON.parse(responseBody);
      return data;
    } catch (err) {
      console.error("Error registering call:", err);
      throw new Error("Failed to register call");
    }
  }

  async function getCallAnalysis(callId: string) {
    try {
      const response = await retellClient.call.retrieve(callId);
      if (response.call_analysis && response.call_analysis.custom_analysis_data) {
        const customAnalysisData = response.call_analysis.custom_analysis_data;
        if (customAnalysisData.rizz_results) {
          return customAnalysisData.rizz_results;
        } else {
          throw new Error("rizz_results not found in custom analysis data");
        }
      } else {
        throw new Error("No call analysis or custom analysis data available");
      }
    } catch (err) {
      console.error("Error fetching call analysis:", err);
      return "Error retrieving rizz results";
    }
  }

  return (
    <div>
      {showRizzScore ? (
        <div className="text-center mt-8">
          <p className="text-2xl text-green-500">Rizz Feedback: {rizzMessage}</p>
          <Link href="/" passHref>
            <button className="bg-[#BE4DFD] hover:bg-[#CC72FF] text-white font-bold py-2 px-6 rounded-full mt-4">
              End Gooning Session
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
              <div
                className="transcript-box"
                style={{
                  maxWidth: "40rem",
                  margin: "0 auto",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
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