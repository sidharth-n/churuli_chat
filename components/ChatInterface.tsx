'use client';

import { useState, useRef, useEffect } from 'react';
import { PlusCircle, Volume2, Settings, Send, VolumeX, Shield, Skull } from 'lucide-react';
import SettingsModal from './SettingsModal';
import TypingIndicator from './TypingIndicator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [langMode, setLangMode] = useState('malayalam');
  const [mode, setMode] = useState('unreal'); // Default to unreal mode
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load history and settings from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('thankan_chat_history');
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
    const savedLangMode = localStorage.getItem('thankan_lang_mode');
    if (savedLangMode) setLangMode(savedLangMode);
    
    const savedMode = localStorage.getItem('thankan_mode');
    if (savedMode) setMode(savedMode);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('thankan_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Save settings
  useEffect(() => {
    localStorage.setItem('thankan_lang_mode', langMode);
    localStorage.setItem('thankan_mode', mode);
  }, [langMode, mode]);

  // Scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    localStorage.removeItem('thankan_chat_history');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const contextMessages = messages.slice(-20);
      contextMessages.push({ role: 'user', content: userMessage });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: contextMessages, langMode, mode }),
      });

      if (!response.ok) throw new Error('Network error');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';

      // Add a placeholder message for the bot
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                botMessage += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg.role === 'assistant') {
                    lastMsg.content = botMessage;
                  }
                  return newMessages;
                });
              }
            } catch (e) { }
          }
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "പോടാ... ഇപ്പോ ബിസിയാ. ഒന്നൂടെ ചോദ്യ്ക്." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] fixed inset-0 max-w-md md:max-w-2xl mx-auto bg-[url('/background.jpeg')] bg-cover bg-center md:bg-none md:bg-deep-black z-30 shadow-2xl border-x border-gray-800">

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/90 backdrop-blur z-20 shrink-0 sticky top-0">
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden border border-neon-blue/50">
                    <img src="/profile.jpg" alt="Thankan" className="w-full h-full object-cover opacity-80 grayscale contrast-125" />
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black animate-pulse ${mode === 'real' ? 'bg-red-500' : 'bg-green-500'}`}></div>
            </div>
            <div>
                <h2 className="font-malayalam font-bold text-white text-lg leading-none">തങ്കൻ</h2>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-neon-blue uppercase tracking-wider">Online | Churuli</span>
                    {mode === 'real' && <Skull className="w-3 h-3 text-red-500" />}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={startNewChat} className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer" title="New Chat">
                <PlusCircle className="w-5 h-5" />
            </button>
            <button onClick={toggleSound} className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer relative">
                <Settings className="w-5 h-5" />
                {mode === 'real' && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}
            </button>
        </div>
      </header>

      {/* Chat Container */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative scroll-smooth min-h-0">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Initial Message */}
        {messages.length === 0 && (
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 border border-neon-blue/30 overflow-hidden">
                    <img src="/profile.jpg" alt="Thankan" className="w-full h-full object-cover opacity-80 grayscale contrast-125" />
                </div>
                <div className="max-w-[85%] bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-none p-3 shadow-lg">
                    <p className="font-malayalam text-gray-200 text-sm leading-relaxed">
                        {mode === 'real' 
                            ? "ആരാടാ നീയൊക്കെ? ചുരുളിയിൽ എന്തിനാടാ വന്നത്?" 
                            : "ആരാണ് നീ? എന്തിനാണ് ഇവിടെ വന്നത്?"}
                        <br/><br/>
                        <span className="text-xs text-gray-500 italic font-mono block mt-1">Translation: Who are you? Why have you come to Churuli? </span>
                    </p>
                    <span className="text-[10px] text-gray-600 mt-1 block text-right font-mono">Just now</span>
                </div>
            </div>
        )}

        {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'user' ? (
                    <>
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 border border-white/10 flex items-center justify-center text-xs">You</div>
                        <div className="max-w-[85%] bg-neon-blue/10 border border-neon-blue/30 rounded-2xl rounded-tr-none p-3 shadow-lg">
                            <p className="font-malayalam text-gray-100 text-sm leading-relaxed">{msg.content}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 border border-neon-blue/30 overflow-hidden">
                            <img src="/profile.jpg" alt="Thankan" className="w-full h-full object-cover opacity-80 grayscale contrast-125" />
                        </div>
                        <div className="max-w-[85%] bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl rounded-tl-none p-3 shadow-lg">
                            <p className="font-malayalam text-gray-200 text-sm leading-relaxed">{msg.content}</p>
                            <span className="text-[10px] text-gray-600 mt-1 block text-right font-mono">Just now</span>
                        </div>
                    </>
                )}
            </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
      </div>

      {/* Input Area */}
      <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] border-t border-gray-800 bg-black/60 backdrop-blur-md z-20 shrink-0 sticky bottom-0">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all font-malayalam placeholder-gray-600 text-base"
                    placeholder="Type something here..." 
                    autoComplete="off"
                />
            </div>
            <button type="submit" disabled={isLoading} className="p-3 bg-neon-blue text-black rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(0,243,255,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="w-5 h-5" />
            </button>
        </form>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-600 font-mono">Powered by LJP • Secure Connection</p>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        langMode={langMode} 
        setLangMode={setLangMode} 
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
}
