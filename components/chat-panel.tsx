'use client'

import { useState } from 'react'
import { Plus, Copy, Mic, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ChatMessage } from '@/lib/chat-types'

interface ChatPanelProps {
  dealName: string
  messages: ChatMessage[]
  onSendMessage?: (text: string) => void
}

export function ChatPanel({ dealName, messages, onSendMessage }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    const t = inputValue.trim()
    if (!t || !onSendMessage) return
    onSendMessage(t)
    setInputValue('')
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="mx-auto max-w-3xl space-y-3 px-6 py-4">
          {messages.map((message, index) => (
            <div key={index}>
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="rounded-lg bg-gray-200 px-3 py-2 text-sm text-black max-w-[85%]">
                    {message.content}
                  </div>
                </div>
              )}
              {message.type === 'assistant-loading' && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm">
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-600" />
                    <span className="text-gray-700">{message.step}</span>
                  </div>
                </div>
              )}
              {message.type === 'assistant' && (
                <div className="flex justify-start">
                  <div className="space-y-2 rounded-lg bg-gray-50 px-3 py-2 max-w-[85%]">
                    <p className="text-sm leading-relaxed text-gray-900">{message.content}</p>
                    {message.list && (
                      <ul className="ml-4 list-disc space-y-0.5 text-sm text-gray-900">
                        {message.list.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {message.numberedList && (
                      <ol className="ml-4 list-decimal space-y-0.5 text-sm text-gray-900">
                        {message.numberedList.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ol>
                    )}
                    {message.highlight && (
                      <p className="text-sm text-gray-900">
                        {'Next, tell me a bit more about what the client is looking for and I\'ll help you find relevant '}
                        <span className="font-semibold text-gray-800">{message.highlight[0]}</span>
                        {' and '}
                        <span className="font-semibold text-gray-800">{message.highlight[1]}</span>
                        {'.'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-3 shrink-0">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Please enter a prompt"
              className="border-0 p-0 text-base shadow-none focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-7 w-7 shrink-0 rounded-full bg-gray-600 hover:bg-gray-700"
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8L14 8M14 8L9 3M14 8L9 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
