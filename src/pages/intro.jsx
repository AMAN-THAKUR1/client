import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/intro.css";

function Intro() {
  const navigate = useNavigate();
  const handleClick = () => navigate("/home");
  const [log, setLog] = useState("text-red-500");

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="w-full max-w-full p-6 text-center">
      <motion.div
        className="heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="my-big-font font-bold">Anon me</h1>
      </motion.div>
      <motion.div
        className="buttons"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button
          className={`btn ${log} my-btn`}
          onClick={handleClick}
          onMouseLeave={() => {
            setLog("text-red-500");
          }}
          onMouseEnter={() => {
            setLog("text-green-500");
          }}
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
}

export default Intro;
