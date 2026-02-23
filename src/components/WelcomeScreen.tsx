import { Send } from 'lucide-react';

interface WelcomeScreenProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const WelcomeScreen = ({ 
  input, 
  setInput, 
  handleSubmit, 
  isLoading 
}: WelcomeScreenProps) => (
  <div className="flex items-center justify-center flex-1 px-4 relative z-10">
    <div className="w-full max-w-2xl mx-auto text-center">
      <h1 className="mb-6 text-5xl font-black tracking-tighter text-transparent uppercase md:text-8xl bg-gradient-to-b from-white to-blue-400 bg-clip-text drop-shadow-2xl">
        TIM-KEK
      </h1>
      <p className="w-full mx-auto mb-10 text-sm font-medium tracking-widest uppercase text-slate-500 md:text-base">
        Intelligence Redefined &bull; Since 2026
      </p>
      <form onSubmit={handleSubmit} className="px-2">
        <div className="relative group max-w-xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Ask anything..."
            className="w-full py-5 px-6 overflow-hidden text-sm text-white placeholder-slate-600 rounded-3xl glass-panel focus:bg-white/10 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-500 resize-none shadow-2xl"
            rows={1}
            style={{ minHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute p-4 text-cyan-400 transition-all -translate-y-1/2 right-3 bottom-6 hover:scale-110 active:scale-95 disabled:text-slate-600 disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  </div>
); 