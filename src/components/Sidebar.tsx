import { PlusCircle, MessageCircle, Trash2, Edit2 } from 'lucide-react';

interface SidebarProps {
  conversations: Array<{ id: string; title: string }>;
  currentConversationId: string | null;
  handleNewChat: () => void;
  setCurrentConversationId: (id: string) => void;
  handleDeleteChat: (id: string) => void;
  editingChatId: string | null;
  setEditingChatId: (id: string | null) => void;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  handleUpdateChatTitle: (id: string, title: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ 
  conversations, 
  currentConversationId, 
  handleNewChat, 
  setCurrentConversationId, 
  handleDeleteChat, 
  editingChatId, 
  setEditingChatId, 
  editingTitle, 
  setEditingTitle, 
  handleUpdateChatTitle,
  isOpen,
  onClose
}: SidebarProps) => (
  <>
    {/* Overlay for mobile */}
    {isOpen && (
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" 
        onClick={onClose}
      />
    )}
    
    <div className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#020617] border-r border-white/[0.04] transition-transform duration-500 ease-in-out md:relative md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6">
        <button
          onClick={() => {
            handleNewChat();
            if (window.innerWidth < 768) onClose();
          }}
          className="flex items-center justify-center w-full gap-2 px-3 py-2 text-[11px] font-bold tracking-widest text-white uppercase rounded bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-xl shadow-blue-500/10"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          New Thread
        </button>
      </div>

      <div className="px-4 mb-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
        History
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-0.5 px-3">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center gap-3 px-3 py-2 cursor-pointer rounded transition-all duration-200 ${
              chat.id === currentConversationId 
                ? 'bg-white/[0.04] text-white shadow-sm' 
                : 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-300'
            }`}
            onClick={() => {
              setCurrentConversationId(chat.id);
              if (window.innerWidth < 768) onClose();
            }}
          >
            <MessageCircle className={`w-3.5 h-3.5 ${chat.id === currentConversationId ? 'text-blue-500' : 'text-slate-600'}`} />
            {editingChatId === chat.id ? (
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onFocus={(e) => e.target.select()}
                onBlur={() => {
                  if (editingTitle.trim()) {
                    handleUpdateChatTitle(chat.id, editingTitle)
                  }
                  setEditingChatId(null)
                  setEditingTitle('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editingTitle.trim()) {
                    handleUpdateChatTitle(chat.id, editingTitle)
                  } else if (e.key === 'Escape') {
                    setEditingChatId(null)
                    setEditingTitle('')
                  }
                }}
                className="flex-1 text-xs bg-transparent focus:outline-none text-white font-medium"
                autoFocus
              />
            ) : (
              <span className="flex-1 text-[13px] font-medium truncate tracking-tight">
                {chat.title}
              </span>
            )}
            <div className="items-center hidden gap-1 group-hover:flex">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingChatId(chat.id)
                  setEditingTitle(chat.title)
                }}
                className="p-1 text-slate-600 hover:text-blue-400 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteChat(chat.id)
                }}
                className="p-1 text-slate-600 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 border-t border-white/[0.03] mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-slate-700 to-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400">
            VA
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-200">Variad Agency</span>
            <span className="text-[9px] text-slate-500 font-medium">Enterprise Edition</span>
          </div>
        </div>
      </div>
    </div>
  </>
);
