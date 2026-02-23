export const LoadingIndicator = () => (
  <div className="px-6 py-8 glass-panel rounded-3xl animate-pulse">
    <div className="flex items-start w-full max-w-3xl gap-4 mx-auto md:gap-6">
      <div className="relative flex-shrink-0 w-10 h-10">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 animate-spin blur-sm opacity-50"></div>
        <div className="absolute inset-[2px] rounded-xl bg-slate-900 flex items-center justify-center">
          <span className="text-[10px] font-black tracking-tighter text-cyan-400">
            TIM
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium tracking-wide text-cyan-400/80 uppercase">
          KI verbessert Prompt und generiert Antwort...
        </div>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  </div>
);
