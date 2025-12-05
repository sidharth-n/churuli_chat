export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 border border-neon-blue/30 flex items-center justify-center text-xs text-neon-blue">T</div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-neon-blue rounded-full typing-dot"></div>
            <div className="w-1.5 h-1.5 bg-neon-blue rounded-full typing-dot"></div>
            <div className="w-1.5 h-1.5 bg-neon-blue rounded-full typing-dot"></div>
        </div>
    </div>
  );
}
