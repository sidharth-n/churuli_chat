'use client';

import { useState, useRef } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleEnter = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
    setHasEntered(true);
  };

  return (
    <main className="min-h-screen bg-black text-white relative">
      <audio ref={audioRef} loop>
        <source src="bgm.mp3" type="audio/mpeg" />
      </audio>

      {!hasEntered && <WelcomeScreen onEnter={handleEnter} />}
      {hasEntered && <ChatInterface audioRef={audioRef} />}
      
      <div className="bg-scanlines pointer-events-none"></div>
    </main>
  );
}
