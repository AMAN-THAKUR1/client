import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/Room.css';

const Jroom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setRoomCode(e.target.value);
  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://server-pqo0.onrender.com/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: roomCode }),
      });
      if (response.ok) {
        localStorage.setItem("code", JSON.stringify(roomCode));
        setValid(false);
        navigate("https://client-xi-sooty.vercel.app/Croom");
      } else {
        setValid(true);
      }
    } catch (error) {
      setValid(true);
    }
  };

  useEffect(() => { valid && setValid(false); }, [valid]);

  return (
    <div className="room-container animate-fade-in">
      <div className="glass-card max-w-md mx-auto p-8 rounded-xl">
        <h2 className="text-2xl font-semibold mb-6">Join a Room</h2>
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1">
              Room Code
            </label>
            <input
              type="number"
              id="roomCode"
              value={roomCode}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter room code"
              onInput={(e) => e.target.value = e.target.value.slice(0, 5)}
            />
          </div>
          {valid && <p className="font-extrabold text-red-600">Room code is not valid</p>}
          <button type="submit" className="btn-primary w-full">
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default Jroom;