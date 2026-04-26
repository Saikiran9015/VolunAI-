import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { sendToGemini, type ChatMessage } from '../lib/gemini'
import { smartOfflineReply } from '../lib/offlineAI'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'How do I register as a Donor?',
  'What is the volunteer process?',
  'How do emergency alerts work?',
  'What NGO features are available?',
]

export function ChatBoxPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi! I am VolunAI 🤝 Ask me anything about donations, volunteering, NGO workflows, emergency relief, or how the platform works!',
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatLogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend(text?: string) {
    const userText = (text ?? input).trim()
    if (!userText || isTyping) return

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
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: smartOfflineReply(userText) },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2 text-white">
              <span className="text-xl">🤝</span> VolunAI Chat Assistant
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Ask me anything about donations, volunteering, NGOs, or the platform
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 p-4">
            {/* Chat log */}
            <div
              ref={chatLogRef}
              className="h-[420px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={[
                    'mb-3 max-w-[90%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-line',
                    msg.role === 'user'
                      ? 'ml-auto bg-indigo-600 text-white'
                      : 'mr-auto border border-slate-200 bg-white text-slate-800',
                  ].join(' ')}
                >
                  <b>{msg.role === 'user' ? 'You' : 'VolunAI'}:</b>{' '}
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
              {isTyping && (
                <div className="text-xs text-slate-400">VolunAI is thinking…</div>
              )}
            </div>

            {/* Quick suggestion chips */}
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void handleSend(s)}
                  disabled={isTyping}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void handleSend()}
                placeholder="Ask me anything…"
                disabled={isTyping}
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
              />
              <Button
                onClick={() => void handleSend()}
                disabled={isTyping || !input.trim()}
              >
                Send
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <Link to="/">
                <Button variant="ghost">← Back</Button>
              </Link>
              <div className="text-xs text-slate-400">VolunAI · AI-Powered NGO Platform</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
