import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { sendToGemini, type ChatMessage } from '../lib/gemini'
import { smartOfflineReply } from '../lib/offlineAI'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export function FloatingChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I am VolunAI assistant 🤝 How can I help you today?',
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages, open])

  async function sendMessage() {
    if (!input.trim() || isTyping) return
    const userText = input.trim()
    const userMessage: Message = { role: 'user', content: userText }

    const history: ChatMessage[] = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: 'assistant', content: '...' },
    ])
    setInput('')
    setIsTyping(true)

    try {
      const reply = await sendToGemini(history)
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: reply },
      ])
    } catch {
      // Smart offline fallback — answers any question intelligently
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: smartOfflineReply(userText) },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="flex w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-indigo-600 px-4 py-3 text-white">
            <div className="inline-flex items-center gap-2 text-sm font-semibold">
              <MessageCircle className="size-4" />
              VolunAI Chat
              {isTyping && (
                <span className="ml-1 animate-pulse text-xs font-normal opacity-80">
                  typing…
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={logRef}
            className="h-[320px] space-y-2 overflow-y-auto bg-slate-50 p-3"
          >
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                className={[
                  'max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line',
                  msg.role === 'user'
                    ? 'ml-auto bg-indigo-600 text-white'
                    : 'mr-auto border border-slate-200 bg-white text-slate-800',
                ].join(' ')}
              >
                <span className="font-semibold">
                  {msg.role === 'user' ? 'You' : 'VolunAI'}:
                </span>{' '}
                {msg.content === '...' ? (
                  <span className="inline-flex gap-0.5">
                    <span className="animate-bounce">·</span>
                    <span className="animate-bounce [animation-delay:0.15s]">·</span>
                    <span className="animate-bounce [animation-delay:0.3s]">·</span>
                  </span>
                ) : (
                  msg.content
                )}
              </div>
            ))}
          </div>

          {/* Input row */}
          <div className="flex gap-2 border-t border-slate-200 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void sendMessage()}
              placeholder="Ask me anything…"
              disabled={isTyping}
              className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={isTyping || !input.trim()}
              className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500"
        >
          <MessageCircle className="size-4" />
          Chat with VolunAI
        </button>
      )}
    </div>
  )
}
