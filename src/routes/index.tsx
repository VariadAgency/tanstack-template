import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { Settings, Menu } from 'lucide-react'
import {
  SettingsDialog,
  ChatMessage,
  LoadingIndicator,
  ChatInput,
  Sidebar,
  WelcomeScreen,
  TopBanner
} from '../components'
import { useConversations, useAppState, actions } from '../store'
import { type Message } from '../utils'

function Home() {
  const {
    conversations,
    currentConversationId,
    currentConversation,
    setCurrentConversationId,
    createNewConversation,
    updateConversationTitle,
    deleteConversation,
    addMessage,
  } = useConversations()
  
  const { isLoading, setLoading } = useAppState()

  // Memoize messages to prevent unnecessary re-renders
  const messages = useMemo(() => currentConversation?.messages || [], [currentConversation]);

  // Local state
  const [input, setInput] = useState('')
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null)
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = useCallback((smooth: boolean = false) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  }, []);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom(false)
  }, [messages, scrollToBottom])

  // Smooth scroll during loading
  useEffect(() => {
    if (isLoading) {
      scrollToBottom(true)
    }
  }, [isLoading, scrollToBottom])

  const createTitleFromInput = useCallback((text: string) => {
    const words = text.trim().split(/\s+/)
    const firstThreeWords = words.slice(0, 3).join(' ')
    return firstThreeWords + (words.length > 3 ? '...' : '')
  }, []);

  // New helper function to process response from n8n
  const processN8NResponse = useCallback(async (conversationId: string, userMessage: Message) => {
    const N8N_WEBHOOK_URL = 'http://76.13.155.84:22612/webhook/843de30d-bcca-49f6-a8a2-9e5670add116';
    
    try {
      setLoading(true);
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage.content
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract the response text - assuming n8n returns something like { "output": "..." } or just the text
      // We'll try common response fields or stringify if it's an object
      let responseText = '';
      if (typeof data === 'string') {
        responseText = data;
      } else if (data.output) {
        responseText = data.output;
      } else if (data.response) {
        responseText = data.response;
      } else if (data.text) {
        responseText = data.text;
      } else {
        responseText = JSON.stringify(data, null, 2);
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: responseText,
      };

      await addMessage(conversationId, assistantMessage);
      
    } catch (error) {
      console.error('Error in n8n response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Fehler: Der n8n-Server ist nicht erreichbar oder hat ungültig geantwortet. Bitte prüfe den Webhook.',
      };
      await addMessage(conversationId, errorMessage);
    } finally {
      setLoading(false);
    }
  }, [addMessage, setLoading]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const currentInput = input
    setInput('') // Clear input early for better UX
    setError(null)
    
    const conversationTitle = createTitleFromInput(currentInput)

    try {
      // Create the user message object
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: currentInput.trim(),
      }
      
      let conversationId = currentConversationId

      // If no current conversation, create one in Convex first
      if (!conversationId) {
        try {
          const convexId = await createNewConversation(conversationTitle)
          if (convexId) {
            conversationId = convexId
            await addMessage(conversationId, userMessage)
          } else {
            // Fallback to local
            const tempId = Date.now().toString()
            actions.addConversation({ id: tempId, title: conversationTitle, messages: [] })
            conversationId = tempId
            actions.addMessage(conversationId, userMessage)
          }
        } catch (error) {
          console.error('Error creating conversation:', error)
          throw new Error('Failed to create conversation')
        }
      } else {
        await addMessage(conversationId, userMessage)
      }
      
      // Process with n8n instead of internal AI
      await processN8NResponse(conversationId, userMessage)
      
    } catch (error) {
      console.error('Error:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred.')
      }
    }
  }, [input, isLoading, createTitleFromInput, currentConversationId, createNewConversation, addMessage, processN8NResponse]);

  const handleNewChat = useCallback(() => {
    createNewConversation()
  }, [createNewConversation]);

  const handleDeleteChat = useCallback(async (id: string) => {
    await deleteConversation(id)
  }, [deleteConversation]);

  const handleUpdateChatTitle = useCallback(async (id: string, title: string) => {
    await updateConversationTitle(id, title)
    setEditingChatId(null)
    setEditingTitle('')
  }, [updateConversationTitle]);

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* Variad Style Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]" />
      
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md md:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500">
          TIM-KEK &bull; Variad Edition
        </span>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        conversations={conversations}
        currentConversationId={currentConversationId}
        handleNewChat={handleNewChat}
        setCurrentConversationId={setCurrentConversationId}
        handleDeleteChat={handleDeleteChat}
        editingChatId={editingChatId}
        setEditingChatId={setEditingChatId}
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
        handleUpdateChatTitle={handleUpdateChatTitle}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        {error && (
          <div className="w-full max-w-3xl px-4 mx-auto mt-20 md:mt-8">
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium">
              {error}
            </div>
          </div>
        )}
        
        {currentConversationId ? (
          <>
            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 pb-32 overflow-y-auto no-scrollbar pt-20 md:pt-8"
            >
              <div className="w-full max-w-3xl px-4 mx-auto space-y-8">
                {[...messages, pendingMessage]
                  .filter((message): message is Message => message !== null)
                  .map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isStreaming={message === pendingMessage && isLoading}
                    />
                  ))}
                {isLoading && <LoadingIndicator />}
              </div>
            </div>

            {/* Input */}
            <ChatInput 
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <WelcomeScreen 
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})
