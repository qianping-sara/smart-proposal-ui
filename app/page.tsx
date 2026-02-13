'use client'

import { useState, useCallback, useRef } from 'react'
import { NewProposalForm } from '@/components/new-proposal-form'
import { ChatInterface } from '@/components/chat-interface'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import {
  getDefaultChatMessages,
  INITIAL_OPEN_CHATS,
  type ChatMessage,
} from '@/lib/chat-types'

export const AUDIT_SERVICES_LIST = [
  'Year-end audit of financial report',
  'Review of half-year financial report',
  'Statutory audit of financial statements',
] as const

export type CustomServiceRow = { description: string; oneOff: string; recurring: string }

function lastAssistantMessageHasNumberedList(messages: ChatMessage[]): boolean {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.type === 'user') return false
    if (m.type === 'assistant' && m.numberedList && m.numberedList.length > 0) return true
  }
  return false
}

function parseServiceSelection(text: string, maxIndex: number): number[] {
  const t = text.trim()
  const numbers: number[] = []
  const parts = t.split(/[\s,，、]+/)
  for (const p of parts) {
    const n = parseInt(p, 10)
    if (n >= 1 && n <= maxIndex && !numbers.includes(n)) numbers.push(n)
  }
  return numbers.sort((a, b) => a - b)
}

function normalizeDescription(d: string): string {
  return d.trim().toLowerCase()
}

function extractCompanyNameFromInput(text: string): string | null {
  const t = text.trim()
  const lower = t.toLowerCase()
  if (lower.startsWith('please add company info:') || lower.startsWith('add company info:')) {
    const after = t.split(/:\s*/i)[1]?.trim()
    return after || null
  }
  if (lower.startsWith('company ')) {
    return t.slice(8).trim() || null
  }
  return null
}

function isConfirmAddAuditServices(text: string): boolean {
  const t = text.trim().toLowerCase()
  return ['yes', '要', '对', '是的', 'y', 'ok', 'sure'].some((w) => t === w || t.startsWith(w + ' ') || t.endsWith(' ' + w))
}

function wantsAuditServiceList(text: string): boolean {
  const t = text.trim().toLowerCase()
  return (
    /add\s+audit\s+service/i.test(t) ||
    /audit\s+related\s+service/i.test(t) ||
    /audit\s+service/i.test(t) ||
    /show\s+audit\s+service/i.test(t) ||
    /list\s+audit\s+service/i.test(t) ||
    /audit\s+service\s+list/i.test(t)
  )
}

function lastAssistantAskedAddAuditServices(messages: ChatMessage[]): boolean {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.type === 'user') return false
    if (m.type === 'assistant' && m.content) {
      return /add audit-related services|audit-related services for this client/i.test(m.content)
    }
  }
  return false
}

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
  const [customServicesByChat, setCustomServicesByChat] = useState<Record<string, CustomServiceRow[]>>({})
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(
    buildInitialChatHistories
  )

  const dealInfo: DealInfo | null = currentChat ? dealInfoByChat[currentChat] ?? null : null
  const currentChatMessages = currentChat
    ? (chatHistories[currentChat] ?? getDefaultChatMessages())
    : []
  const currentCustomServices = currentChat ? (customServicesByChat[currentChat] ?? []) : []
  const setCurrentCustomServices = useCallback(
    (updater: CustomServiceRow[] | ((prev: CustomServiceRow[]) => CustomServiceRow[])) => {
      if (!currentChat) return
      setCustomServicesByChat((prev) => ({
        ...prev,
        [currentChat]: typeof updater === 'function' ? updater(prev[currentChat] ?? []) : updater,
      }))
    },
    [currentChat]
  )
  const serviceAddReplyRef = useRef<string | null>(null)
  const showAuditListRef = useRef<boolean>(false)

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

  const handleSendMessage = useCallback((chatName: string, text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = { type: 'user', content: text.trim() }
    const companyName = extractCompanyNameFromInput(text)
    const messagesNow = chatHistories[chatName] ?? []
    const isServiceSelection =
      lastAssistantMessageHasNumberedList(messagesNow) &&
      parseServiceSelection(text, AUDIT_SERVICES_LIST.length).length > 0

    if (isServiceSelection) {
      const indices = parseServiceSelection(text, AUDIT_SERVICES_LIST.length)
      const selectedDescriptions = indices.map((i) => AUDIT_SERVICES_LIST[i - 1])
      setCustomServicesByChat((prev) => {
        const current = prev[chatName] ?? []
        const existingSet = new Set(current.map((r) => normalizeDescription(r.description)))
        const toAdd = selectedDescriptions.filter((d) => !existingSet.has(normalizeDescription(d)))
        const duplicated = selectedDescriptions.filter((d) => existingSet.has(normalizeDescription(d)))
        if (toAdd.length === 0 && duplicated.length > 0) {
          serviceAddReplyRef.current =
            'The Custom services table already has the selected service(s); no duplicates added.'
        } else if (toAdd.length > 0 && duplicated.length > 0) {
          serviceAddReplyRef.current =
            'Some items were already in the table. Only the new service(s) have been added.'
        } else if (toAdd.length > 0) {
          serviceAddReplyRef.current =
            'Done. The selected service(s) have been added to Value Added Services > Custom services. Please fill in the fee columns as needed.'
        } else {
          serviceAddReplyRef.current = 'No valid selection was added.'
        }
        return {
          ...prev,
          [chatName]: [...current, ...toAdd.map((d) => ({ description: d, oneOff: '', recurring: '' }))],
        }
      })
      setChatHistories((prev) => ({
        ...prev,
        [chatName]: [...(prev[chatName] ?? []), userMsg, { type: 'assistant-loading', step: 'Planning' }],
      }))
      setTimeout(() => {
        setChatHistories((prev) => {
          const list = (prev[chatName] ?? []).filter((m) => m.type !== 'assistant-loading')
          return { ...prev, [chatName]: [...list, { type: 'assistant-loading', step: 'Gathering information' }] }
        })
      }, 1200)
      setTimeout(() => {
        setChatHistories((prev) => {
          const list = (prev[chatName] ?? []).filter((m) => m.type !== 'assistant-loading')
          return {
            ...prev,
            [chatName]: [
              ...list,
              { type: 'assistant', content: serviceAddReplyRef.current ?? 'Done.' },
            ],
          }
        })
      }, 2400)
      return
    }

    showAuditListRef.current =
      wantsAuditServiceList(text) ||
      (lastAssistantAskedAddAuditServices(messagesNow) && isConfirmAddAuditServices(text))

    setChatHistories((prev) => {
      const messagesNow = prev[chatName] ?? []
      const isConfirmAudit =
        lastAssistantAskedAddAuditServices(messagesNow) && isConfirmAddAuditServices(text)
      const showAuditList = wantsAuditServiceList(text) || isConfirmAudit

      if (companyName != null) {
        return {
          ...prev,
          [chatName]: [...(prev[chatName] ?? []), userMsg, { type: 'assistant-loading', step: 'Planning' }],
        }
      }
      if (showAuditList) {
        return {
          ...prev,
          [chatName]: [...(prev[chatName] ?? []), userMsg, { type: 'assistant-loading', step: 'Planning' }],
        }
      }
      return { ...prev, [chatName]: [...(prev[chatName] ?? []), userMsg, { type: 'assistant-loading', step: 'Planning' }] }
    })

    if (companyName != null) {
      setDealInfoByChat((prev) => {
        const current = prev[chatName]
        if (!current) return prev
        return { ...prev, [chatName]: { ...current, companyName } }
      })
      setTimeout(() => {
        setChatHistories((prev) => {
          const list = (prev[chatName] ?? []).filter((m) => m.type !== 'assistant-loading')
          return { ...prev, [chatName]: [...list, { type: 'assistant-loading', step: 'Gathering information' }] }
        })
      }, 1200)
      setTimeout(() => {
        setChatHistories((prev) => {
          const list = (prev[chatName] ?? []).filter((m) => m.type !== 'assistant-loading')
          return {
            ...prev,
            [chatName]: [
              ...list,
              {
                type: 'assistant',
                content:
                  'Client information has been updated. Would you like me to add audit-related services for this client?',
              },
            ],
          }
        })
      }, 2400)
      return
    }

    setTimeout(() => {
      setChatHistories((prev) => {
        const list = (prev[chatName] ?? []).filter((m) => m.type !== 'assistant-loading')
        return { ...prev, [chatName]: [...list, { type: 'assistant-loading', step: 'Gathering information' }] }
      })
    }, 1200)
    setTimeout(() => {
      setChatHistories((prev) => {
        const list = (prev[chatName] ?? []).filter((m) => m.type !== 'assistant-loading')
        if (showAuditListRef.current) {
          return {
            ...prev,
            [chatName]: [
              ...list,
              {
                type: 'assistant',
                content: 'Here are the audit-related services available. Which would you like to add?',
                numberedList: AUDIT_SERVICES_LIST,
              },
            ],
          }
        }
        return {
          ...prev,
          [chatName]: [
            ...list,
            {
              type: 'assistant',
              content:
                'How can I help you with this proposal? You can update company info or ask to add audit services.',
            },
          ],
        }
      })
    }, 2400)
  }, [chatHistories])

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
              onSendMessage={currentChat ? (text) => handleSendMessage(currentChat, text) : undefined}
              customServices={currentCustomServices}
              onCustomServicesChange={setCurrentCustomServices}
            />
          </>
        )}
      </div>
    </div>
  )
}
