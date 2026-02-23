import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import type { Message } from '../utils'

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

export const ChatMessage = ({ message, isStreaming = false }: ChatMessageProps) => (
  <div
    className={`py-12 px-4 md:px-0 transition-all duration-300 ${
      message.role === 'assistant'
        ? 'bg-white/[0.01] border-y border-white/[0.02]'
        : 'bg-transparent'
    }`}
  >
    <div className="flex items-start w-full max-w-3xl gap-6 mx-auto md:gap-12">
      {message.role === 'assistant' ? (
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-[9px] font-bold tracking-tighter text-white rounded bg-blue-600 shadow-2xl shadow-blue-500/20">
          TIM
        </div>
      ) : (
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-[9px] font-bold text-slate-500 border border-white/10 rounded uppercase">
          YOU
        </div>
      )}
      <div className={`flex-1 min-w-0 ${isStreaming ? 'streaming-cursor' : ''}`}>
        <div className="overflow-x-auto prose dark:prose-invert max-w-none prose-sm md:prose-base leading-relaxed text-slate-300">
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
