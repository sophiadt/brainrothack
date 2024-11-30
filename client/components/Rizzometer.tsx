'use client'

import { useState, useEffect } from 'react';

export default function Rizzometer() {
    const [rizzScore, setRizzScore] = useState(50); // Move useState inside the component

    useEffect(() => {
        const websocket = new WebSocket("ws://localhost:8000");

        websocket.onopen = () => {
            console.log('WebSocket connection established');
        };

        websocket.onmessage = (message) => {
            const data = JSON.parse(message.data);
            setRizzScore(data.rizzscore);
        };

        return () => {
            websocket.close(); // Clean up the WebSocket when the component unmounts
        };
    }, []);

    return (
        <div>
            <p>Rizz o'meter: {rizzScore}%</p>
            <progress value={rizzScore} max="100" />
        </div>
    );
}