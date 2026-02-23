import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput = ({ 
  input, 
  setInput, 
  handleSubmit, 
  isLoading 
}: ChatInputProps) => (
  <div className="fixed bottom-0 left-0 right-0 z-20 md:left-64 p-4 md:p-8">
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Talk to TIM-KEK..."
            className="w-full py-4 pl-6 pr-14 overflow-hidden text-sm text-white placeholder-slate-500 rounded-2xl glass-panel focus:bg-white/10 focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/30 transition-all duration-300 resize-none shadow-2xl"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '200px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height =
                Math.min(target.scrollHeight, 200) + 'px'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute p-3 text-cyan-400 transition-all -translate-y-1/2 right-2 top-1/2 hover:scale-110 active:scale-95 disabled:text-slate-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  </div>
); 