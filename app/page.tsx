'use client'

import { useState } from 'react'
import { NewProposalForm } from '@/components/new-proposal-form'
import { ChatInterface } from '@/components/chat-interface'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'

export default function Page() {
  const [currentView, setCurrentView] = useState<'new' | 'chat'>('new')
  const [currentChat, setCurrentChat] = useState<string | null>(null)
  const [dealInfo, setDealInfo] = useState<{
    dealName: string
    pipeline: string
    contactPerson: string
    contactEmail: string
  } | null>(null)

  const handleStartProposal = (data: {
    dealName: string
    pipeline: string
    contactPerson: string
    contactEmail: string
  }) => {
    setDealInfo(data)
    setCurrentChat(data.dealName)
    setCurrentView('chat')
  }

  const handleNewProposal = () => {
    setCurrentView('new')
    setCurrentChat(null)
    setDealInfo(null)
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
              onNewProposal={handleNewProposal}
              onSelectChat={handleSelectChat}
              currentChat={currentChat}
            />
            <NewProposalForm onStart={handleStartProposal} />
          </>
        ) : (
          <>
            <AppSidebar
              onNewProposal={handleNewProposal}
              onSelectChat={handleSelectChat}
              currentChat={currentChat}
            />
            <ChatInterface dealInfo={dealInfo} />
          </>
        )}
      </div>
    </div>
  )
}
