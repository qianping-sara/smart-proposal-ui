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
  contactTitle?: string
  companyName?: string
  companyShortName?: string
  companyAddress?: string
}

const MOCK_DEAL_INFO_BY_CHAT: Record<string, DealInfo> = {
  'Parable Church Ltd - Audit Proposal': {
    dealName: 'Parable Church Ltd - Audit Proposal',
    pipeline: 'Audit',
    contactPerson: 'Sarah Chen',
    contactEmail: 'sarah.chen@parablechurch.org',
    contactTitle: 'Finance Director',
    companyName: 'Parable Church Ltd',
    companyShortName: 'PCL',
    companyAddress: '12 Worship Lane, Sydney NSW 2000',
  },
  'Janus Electric Limited': {
    dealName: 'Janus Electric Limited',
    pipeline: 'Audit',
    contactPerson: 'James Wong',
    contactEmail: 'j.wong@januselectric.com.au',
    contactTitle: 'CFO',
    companyName: 'Janus Electric Limited',
    companyShortName: 'JAN',
    companyAddress: '45 Power Road, Melbourne VIC 3000',
  },
  'Viridis Green Data Centres Limited': {
    dealName: 'Viridis Green Data Centres Limited',
    pipeline: 'Audit',
    contactPerson: 'Emma Liu',
    contactEmail: 'emma.liu@viridisgreen.com',
    contactTitle: 'Head of Finance',
    companyName: 'Viridis Green Data Centres Limited',
    companyShortName: 'VGDC',
    companyAddress: '88 Green Tech Park, Brisbane QLD 4000',
  },
  'Omni Tanker Holdings Ltd': {
    dealName: 'Omni Tanker Holdings Ltd',
    pipeline: 'Audit',
    contactPerson: 'Michael Brown',
    contactEmail: 'm.brown@omnitanker.com',
    contactTitle: 'Finance Manager',
    companyName: 'Omni Tanker Holdings Ltd',
    companyShortName: 'OTH',
    companyAddress: '200 Harbour Drive, Perth WA 6000',
  },
  'Supa Technologies Audit': {
    dealName: 'Supa Technologies Audit',
    pipeline: 'Audit',
    contactPerson: 'Alex Rivera',
    contactEmail: 'alex.rivera@supatech.io',
    contactTitle: 'COO',
    companyName: 'Supa Technologies Pty Ltd',
    companyShortName: 'SUPA',
    companyAddress: 'Level 5, 100 Innovation Way, Sydney NSW 2000',
  },
}

function buildInitialChatHistories(): Record<string, ChatMessage[]> {
  const next: Record<string, ChatMessage[]> = {}
  INITIAL_OPEN_CHATS.forEach((name) => {
    next[name] = getDefaultChatMessages()
  })
  return next
}

function buildInitialDealInfoByChat(): Record<string, DealInfo> {
  const next: Record<string, DealInfo> = {}
  INITIAL_OPEN_CHATS.forEach((name) => {
    const mock = MOCK_DEAL_INFO_BY_CHAT[name]
    if (mock) next[name] = mock
  })
  return next
}

export default function Page() {
  const [currentView, setCurrentView] = useState<'new' | 'chat'>('new')
  const [currentChat, setCurrentChat] = useState<string | null>(null)
  const [openChats, setOpenChats] = useState<string[]>([...INITIAL_OPEN_CHATS])
  const [closedChats, setClosedChats] = useState<string[]>([])
  const [dealInfoByChat, setDealInfoByChat] = useState<Record<string, DealInfo>>(buildInitialDealInfoByChat)
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
