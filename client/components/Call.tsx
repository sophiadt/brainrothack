import { useState } from 'react';
import Retell from 'retell-sdk';

const client = new Retell({
  apiKey: '', // Add your API Key here
});

const Call = () => {
  const [isCalling, setIsCalling] = useState(false);

  // Toggle Call Start/Stop
  const toggleConversation = async () => {
    if (isCalling) {
      console.log('Stopping the call...');
      // Stop the conversation
      await client.call.stopCall().catch(console.error);
      setIsCalling(false); // Update button state
    } else {
      console.log('Starting a new call...');
      const agentId = 'agent_88b28ca227d74c2fc74b776ad0'; // Replace with your agent ID
      try {
        const registerCallResponse = await registerCall(agentId);
        if (registerCallResponse.access_token) {
          await client.call
            .startCall({
              accessToken: registerCallResponse.access_token,
            })
            .catch(console.error);
          setIsCalling(true); // Update button state
        }
      } catch (error) {
        console.error('Failed to start the call:', error);
      }
    }
  };

  // Register a Web Call
  const registerCall = async (agentId: string) => {
    try {
      const response = await fetch('http://localhost:8080/create-web-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agent_id: agentId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json(); // Return parsed JSON
    } catch (error) {
      console.error('Error registering call:', error);
      throw error;
    }
  };

  return (
    <div>
      <header>
        <h1>AI Call Page</h1>
        <button onClick={toggleConversation}>
          {isCalling ? 'Stop' : 'Start'}
        </button>
      </header>
    </div>
  );
};

export default Call;
