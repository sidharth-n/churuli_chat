import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  langMode: string;
  setLangMode: (mode: string) => void;
}

export default function SettingsModal({ isOpen, onClose, langMode, setLangMode }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
        <div className="glass-panel w-full max-w-sm rounded-xl p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-mono text-neon-blue mb-6 border-b border-gray-700 pb-2">SETTINGS</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Bot Language Mode</label>
                    <select 
                        value={langMode}
                        onChange={(e) => setLangMode(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded p-2 text-sm text-white font-mono focus:border-neon-blue focus:outline-none"
                    >
                        <option value="malayalam">Pure Malayalam</option>
                        <option value="manglish">Manglish (Lazy Mode)</option>
                    </select>
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
