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
  <div className="w-full max-w-xl px-4 animate-in fade-in duration-1000">
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-4">
        TIM-KEK
      </h1>
      <p className="text-[10px] md:text-xs font-bold text-slate-500 tracking-[0.3em] uppercase">
        Intelligence Redefined &bull; Variad Edition
      </p>
    </div>
    
    <form onSubmit={handleSubmit} className="relative group">
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          placeholder="Start a new discussion..."
          className="w-full py-6 px-8 overflow-hidden text-sm text-white placeholder-slate-600 rounded-2xl bg-white/[0.02] border border-white/[0.05] focus:bg-white/[0.04] focus:border-blue-500/30 transition-all duration-500 resize-none shadow-2xl focus:outline-none"
          rows={1}
          style={{ minHeight: '140px' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute p-4 text-blue-500 transition-all -translate-y-1/2 right-4 bottom-8 hover:scale-110 active:scale-95 disabled:text-slate-700 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
    
    <div className="mt-8 flex justify-center gap-8 opacity-40">
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Core</span>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Agency</span>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logic</span>
    </div>
  </div>
);
