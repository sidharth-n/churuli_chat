import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  langMode: string;
  setLangMode: (mode: string) => void;
  mode: string;
  setMode: (mode: string) => void;
}

export default function SettingsModal({ isOpen, onClose, langMode, setLangMode, mode, setMode }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
        <div className="glass-panel w-full max-w-sm rounded-xl p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-mono text-neon-blue mb-6 border-b border-gray-700 pb-2">SETTINGS</h3>
            
            <div className="space-y-6">
                {/* Language Mode */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Bot Language Mode</label>
                    <select 
                        value={langMode}
                        onChange={(e) => setLangMode(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white font-mono focus:border-neon-blue focus:outline-none"
                    >
                        <option value="malayalam">Pure Malayalam</option>
                        <option value="manglish">Manglish (Lazy Mode)</option>
                    </select>
                </div>

                {/* Thankan Mode */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Thankan Mode</label>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setMode('unreal')}
                            className={`flex-1 py-2 rounded text-sm font-mono border transition-all ${
                                mode === 'unreal' 
                                ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' 
                                : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                            }`}
                        >
                            UNREAL
                        </button>
                        <button 
                            onClick={() => setMode('real')}
                            className={`flex-1 py-2 rounded text-sm font-mono border transition-all ${
                                mode === 'real' 
                                ? 'bg-red-500/20 border-red-500 text-red-500' 
                                : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                            }`}
                        >
                            REAL
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">
                        {mode === 'unreal' ? 'Suspicious but clean language.' : 'Uncensored. 18+ Vulgarity. Use at own risk.'}
                    </p>
                </div>

                <div className="pt-4">
                    <button onClick={onClose} className="w-full py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm text-white font-mono transition-colors cursor-pointer">
                        SAVE CHANGES
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
