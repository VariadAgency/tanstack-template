import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import type { Message } from '../utils/ai'

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

export const ChatMessage = ({ message, isStreaming = false }: ChatMessageProps) => (
  <div
    className={`py-6 px-4 md:px-0 transition-all duration-500 rounded-3xl ${
      message.role === 'assistant'
        ? 'bg-white/5 border border-white/5 shadow-inner'
        : 'bg-transparent'
    }`}
  >
    <div className="flex items-start w-full max-w-3xl gap-4 mx-auto md:gap-6">
      {message.role === 'assistant' ? (
        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-[10px] font-black tracking-tighter text-white rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
          TIM
        </div>
      ) : (
        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-[10px] font-black text-slate-400 border border-white/10 rounded-xl bg-white/5">
          YOU
        </div>
      )}
      <div className={`flex-1 min-w-0 ${isStreaming ? 'streaming-cursor' : ''}`}>
        <div className="overflow-x-auto prose dark:prose-invert max-w-none prose-sm md:prose-base leading-relaxed">
          <ReactMarkdown
            rehypePlugins={[
              rehypeRaw,
              rehypeSanitize,
              rehypeHighlight,
            ]}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  </div>
); 