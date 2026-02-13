import { useState, useEffect, useRef } from "react";
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

  const generateRandomPosition = () => {
    const btnWidth = 160;
    const btnHeight = 60;
    
    // TARGETED AVOIDANCE: Only avoid the specific 'Yes' button area
    // This is a small box in the center-left (or center-top on mobile)
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let newX, newY;
    let attempts = 0;

    do {
      newX = Math.max(10, Math.floor(Math.random() * (windowWidth - btnWidth)));
      newY = Math.max(10, Math.floor(Math.random() * (windowHeight - btnHeight)));
      
      // Calculate distance from the center where the buttons live
     // const distToCenterX = Math.abs(newX - (windowWidth / 2 - 80)); 
      const distToCenterY = Math.abs(newY - (windowHeight / 2 + 50)); 

      attempts++;
      // If the button is too close to the 'Yes' position (approx 100px radius), try again
    } while (attempts < 50 && (Math.abs(newX - (windowWidth / 2)) < 150 && Math.abs(newY - (windowHeight / 2)) < 150));

    return { x: newX, y: newY };
  };

  const moveButton = () => {
    if (!isFloating) setIsFloating(true);
    setNoPosition(generateRandomPosition());
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
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-red-100 to-pink-300 overflow-hidden">
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=romantic-love-111017.mp3" autoPlay loop />

      {/* Main Card */}
      <div className="relative z-10 w-[85%] max-w-2xl p-10 md:p-20 text-center shadow-[0_20px_50px_rgba(255,182,193,0.5)] rounded-[3rem] bg-white/90 backdrop-blur-sm border border-white">
        <h1 className="text-4xl md:text-6xl font-black text-red-500 mb-16 leading-tight drop-shadow-sm">
          Shivani, will you be my Valentine? 💖
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <motion.div key={pulseTrigger} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.3 }}>
            <button
              onClick={handleAccept}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xl md:text-2xl w-40 md:w-48 py-4 md:py-5 rounded-full font-bold shadow-lg transition-all active:scale-90"
            >
              Yes ❤️
            </button>
          </motion.div>

          {!isFloating && (
            <button
              onMouseEnter={moveButton}
              onTouchStart={moveButton}
              className="bg-slate-200 text-slate-600 text-xl md:text-2xl w-40 md:w-48 py-4 md:py-5 rounded-full font-bold border-2 border-slate-300 transition-all"
            >
              No 😢
            </button>
          )}
        </div>
      </div>

      {/* Floating "No" Button */}
      {isFloating && (
        <motion.div
          className="fixed z-50 pointer-events-auto"
          animate={{ x: noPosition.x, y: noPosition.y }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          onMouseEnter={moveButton}
          onTouchStart={moveButton}
          style={{ top: 0, left: 0 }}
        >
          <button className="bg-slate-200 text-slate-600 text-xl w-40 py-4 rounded-full font-bold shadow-xl border border-slate-300">
            No 😢
          </button>
        </motion.div>
      )}
    </div>
  );
}
