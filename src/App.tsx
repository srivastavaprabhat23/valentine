import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function ValentinesSpecial() {
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [isFloating, setIsFloating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#ff69b4", "#ffffff"],
    });
  };

  const generateRandomPosition = (currentX: number, currentY: number) => {
    const btnWidth = 160; 
    const btnHeight = 60;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const yesButtonArea = {
      left: windowWidth / 2 - 150, 
      right: windowWidth / 2 + 150,
      top: windowHeight / 2 - 150,
      bottom: windowHeight / 2 + 150,
    };

    let newX, newY;
    let attempts = 0;

    while (attempts < 100) {
      newX = Math.max(20, Math.floor(Math.random() * (windowWidth - btnWidth)));
      newY = Math.max(20, Math.floor(Math.random() * (windowHeight - btnHeight)));
      attempts++;

      // 1. Collision check (Yes button)
      const overlapsYes = newX + btnWidth > yesButtonArea.left && newX < yesButtonArea.right &&
                          newY + btnHeight > yesButtonArea.top && newY < yesButtonArea.bottom;
      
      // 2. Distance check (Ensure it jumps at least 300px away from current spot)
      const distance = Math.sqrt(Math.pow(newX - currentX, 2) + Math.pow(newY - currentY, 2));

      if (!overlapsYes && distance > 300) break; 
    }

    return { x: newX, y: newY };
  };

  const moveButton = () => {
    if (!isFloating) setIsFloating(true);
    const nextPos = generateRandomPosition(noPosition.x, noPosition.y);
    setNoPosition(nextPos);
    setPulseTrigger((prev) => prev + 1);
  };

  if (accepted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-pink-100 z-[100]">
        <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=romantic-love-111017.mp3" autoPlay loop />
        <div className="w-[90%] max-w-2xl p-8 md:p-16 text-center shadow-2xl rounded-3xl bg-white border-4 border-pink-300">
          <motion.h1 initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl md:text-7xl font-bold text-pink-600 mb-4">Yayyyy!! 🎉</motion.h1>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-2xl md:text-4xl font-semibold text-red-500 mb-8">Best decision ever ❤️</motion.h2>
          <img src="https://res.cloudinary.com/dpnadwynk/image/upload/v1770967027/f1-movie_vzgs3s.gif" className="mx-auto rounded-2xl w-72 md:w-96 mb-8 shadow-lg" alt="celebration" />
          <p className="text-3xl font-bold text-pink-500 animate-pulse">I love you Shivani 💖</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-red-100 to-pink-300 overflow-hidden touch-none">
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=romantic-love-111017.mp3" autoPlay loop />

      <div className="relative z-10 w-[85%] max-w-2xl p-10 md:p-20 text-center shadow-[0_20px_50px_rgba(255,182,193,0.5)] rounded-[3rem] bg-white/90 backdrop-blur-sm border border-white">
        <h1 className="text-4xl md:text-6xl font-black text-red-500 mb-16 leading-tight drop-shadow-sm">
          Shivani, will you be my Valentine? 💖
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <motion.div key={pulseTrigger} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.2 }}>
            <button
              onClick={handleAccept}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl md:text-2xl w-40 md:w-48 py-4 md:py-5 rounded-full font-bold shadow-lg active:scale-90"
            >
              Yes ❤️
            </button>
          </motion.div>

          {!isFloating && (
            <button
              onMouseEnter={moveButton}
              onTouchStart={moveButton}
              className="bg-slate-200 text-slate-600 text-xl md:text-2xl w-40 md:w-48 py-4 md:py-5 rounded-full font-bold border-2 border-slate-300"
            >
              No 😢
            </button>
          )}
        </div>
      </div>

      {isFloating && (
        <motion.div
          className="fixed z-50 p-12" // Padding here creates the "Invisible hitbox"
          animate={{ x: noPosition.x - 48, y: noPosition.y - 48 }} // Offsetting the padding
          transition={{ type: "spring", stiffness: 1000, damping: 40 }}
          onMouseEnter={moveButton}
          onTouchStart={moveButton}
          style={{ top: 0, left: 0 }}
        >
          <button className="bg-slate-200 text-slate-600 text-xl w-40 py-4 rounded-full font-bold shadow-xl border border-slate-300 pointer-events-none">
            No 😢
          </button>
        </motion.div>
      )}
    </div>
  );
}
