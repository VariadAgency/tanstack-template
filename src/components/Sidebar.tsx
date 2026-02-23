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
        className="fixed inset-0 z-40 bg-black/50 md:hidden" 
        onClick={onClose}
      />
    )}
    
    <div className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 glass-sidebar transition-transform duration-500 ease-in-out md:relative md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-4 mb-2">
        <button
          onClick={() => {
            handleNewChat();
            if (window.innerWidth < 768) onClose();
          }}
          className="flex items-center justify-center w-full gap-2 px-3 py-2.5 text-xs font-bold tracking-widest text-white uppercase rounded-xl bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300"
        >
          <PlusCircle className="w-4 h-4" />
          New Thread
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 px-2">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl transition-all duration-200 border border-transparent ${
              chat.id === currentConversationId 
                ? 'bg-white/10 border-white/10 text-white' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
            onClick={() => {
              setCurrentConversationId(chat.id);
              if (window.innerWidth < 768) onClose();
            }}
          >
            <MessageCircle className={`w-4 h-4 ${chat.id === currentConversationId ? 'text-cyan-400' : 'text-slate-500'}`} />
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
                className="flex-1 text-sm bg-transparent focus:outline-none text-white"
                autoFocus
              />
            ) : (
              <span className="flex-1 text-sm truncate">
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
                className="p-1 text-slate-500 hover:text-cyan-400 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteChat(chat.id)
                }}
                className="p-1 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
); 