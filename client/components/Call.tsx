"use client";

import React, { useEffect, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import "./Call.css";

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
      <button
        onClick={toggleConversation}
        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full"
      >
        {isCalling ? "Hang Up" : "Calling your alpha..."}
      </button>
    </div>
  );
};

export default Call;
