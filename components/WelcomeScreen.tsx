import { AlertTriangle, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black transition-opacity duration-1000">
        <div className="churuli-spiral animate-pulse-slow"></div>
        <div className="churuli-spiral" style={{ width: '500px', height: '500px', borderColor: 'rgba(255,255,255,0.05)', animationDirection: 'reverse' }}></div>

        <div className="z-10 text-center px-6 max-w-md w-full">
            <h1 className="text-6xl md:text-8xl font-malayalam text-white font-bold mb-2 tracking-tighter animate-flicker neon-text">ചുരുളി</h1>
            <p className="text-neon-blue tracking-[0.5em] text-xs uppercase mb-12 opacity-70">The Labyrinth</p>

            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-8 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-2 text-red-500">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="font-bold text-sm">WARNING: 18+ CONTENT</span>
                </div>
                <p className="font-malayalam text-gray-400 text-sm leading-relaxed">
                    നിങ്ങൾ ചുരുളിയിലേക്ക് പ്രവേശിക്കുകയാണ്. നിയമങ്ങൾ ഇവിടെ ബാധകമല്ല. ഭാഷ കഠിനമായിരിക്കും. സ്വന്തം ഉത്തരവാദിത്തത്തിൽ മാത്രം മുന്നോട്ട് പോവുക.
                </p>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wide">Strong Language • Adult Themes • Sci-Fi Horror</p>
            </div>

            <button onClick={onEnter} className="group relative px-8 py-4 bg-transparent border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-all duration-300 rounded font-bold uppercase tracking-widest text-sm w-full cursor-pointer">
                <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>Enter Churuli</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-neon-blue/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
        </div>
    </div>
  );
}
