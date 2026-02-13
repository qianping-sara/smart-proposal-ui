'use client'

import { useState } from 'react'
import { NewProposalForm } from '@/components/new-proposal-form'
import { ChatInterface } from '@/components/chat-interface'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import {
  getDefaultChatMessages,
  INITIAL_OPEN_CHATS,
  type ChatMessage,
} from '@/lib/chat-types'

export type DealInfo = {
  dealName: string
  pipeline: string
  contactPerson: string
  contactEmail: string
}

function buildInitialChatHistories(): Record<string, ChatMessage[]> {
  const next: Record<string, ChatMessage[]> = {}
  INITIAL_OPEN_CHATS.forEach((name) => {
    next[name] = getDefaultChatMessages()
  })
  return next
}

export default function Page() {
  const [currentView, setCurrentView] = useState<'new' | 'chat'>('new')
  const [currentChat, setCurrentChat] = useState<string | null>(null)
  const [openChats, setOpenChats] = useState<string[]>([...INITIAL_OPEN_CHATS])
  const [closedChats, setClosedChats] = useState<string[]>([])
  const [dealInfoByChat, setDealInfoByChat] = useState<Record<string, DealInfo>>({})
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(
    buildInitialChatHistories
  )

  const dealInfo: DealInfo | null = currentChat ? dealInfoByChat[currentChat] ?? null : null
  const currentChatMessages = currentChat
    ? (chatHistories[currentChat] ?? getDefaultChatMessages())
    : []

  const handleStartProposal = (data: DealInfo) => {
    const { dealName } = data
    setOpenChats((prev) => [dealName, ...prev.filter((c) => c !== dealName)])
    setDealInfoByChat((prev) => ({ ...prev, [dealName]: data }))
    setChatHistories((prev) => ({
      ...prev,
      [dealName]: prev[dealName] ?? getDefaultChatMessages(),
    }))
    setCurrentChat(dealName)
    setCurrentView('chat')
  }

  const handleNewProposal = () => {
    setCurrentView('new')
    setCurrentChat(null)
  }

  const handleSelectChat = (chatName: string) => {
    setCurrentChat(chatName)
    setCurrentView('chat')
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        {currentView === 'new' ? (
          <>
            <AppSidebar
              openChats={openChats}
              closedChats={closedChats}
              onNewProposal={handleNewProposal}
              onSelectChat={handleSelectChat}
              currentChat={currentChat}
            />
            <NewProposalForm onStart={handleStartProposal} />
          </>
        ) : (
          <>
            <AppSidebar
              openChats={openChats}
              closedChats={closedChats}
              onNewProposal={handleNewProposal}
              onSelectChat={handleSelectChat}
              currentChat={currentChat}
            />
            <ChatInterface
              dealInfo={dealInfo}
              dealName={currentChat ?? 'testing'}
              messages={currentChatMessages}
            />
          </>
        )}
      </div>
    </div>
  )
}
