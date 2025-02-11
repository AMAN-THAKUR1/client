import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Users, LogOut, Menu } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/Sidebar.css"

function Sidebar({ code, users }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleUnload = async () => {
    await fetch("https://server-pqo0.onrender.com/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code: code }),
    }).then(() => localStorage.removeItem("code"));

    navigate("/home");
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <motion.div
        className={`w-[280px] border-r min-h-screen bg-gray-800 text-white ${isVisible ? 'block' : 'hidden'}`}
        initial={{ x: -280 }}
        animate={{ x: isVisible ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        <div className="p-4 bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="font-bold text-lg">Room {code}</span>
            </div>
            <button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-300 hover:bg-gray-700"
              onClick={handleUnload}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {users.length > 1 ? (
            users.map((user, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
                <span style={{ color: user.color }}>{user.name}</span>
              </motion.div>
            ))
          ) : (
            <div className="px-4 py-3 text-red-600">
              No users are connected
            </div>
          )}
        </div>
      </motion.div>
      <button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 text-black"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}

export default Sidebar;
