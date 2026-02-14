'use client'

import { useState, useCallback, useRef } from 'react'
import { NewProposalForm } from '@/components/new-proposal-form'
import { ChatInterface } from '@/components/chat-interface'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { getDefaultChatMessages, type ChatMessage } from '@/lib/chat-types'
import { USERS, getUser, type UserId } from '@/lib/users'
import { createTaxCompliancePackage, type SolutionPackage } from '@/lib/solution-package'

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

function isTaxComplianceQuestion(text: string): boolean {
  const t = text.trim().toLowerCase()
  return (
    /any\s+tax\s+(&|and)?\s*compliance\s+related\s+service/i.test(t) ||
    /any\s+tax\s+service/i.test(t) ||
    /any\s+compliance\s+service/i.test(t)
  )
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

function buildInitialChatHistories(chatList: readonly string[]): Record<string, ChatMessage[]> {
  const next: Record<string, ChatMessage[]> = {}
  chatList.forEach((name) => {
    next[name] = getDefaultChatMessages()
  })
  return next
}

function buildInitialDealInfoByChat(chatList: readonly string[]): Record<string, DealInfo> {
  const next: Record<string, DealInfo> = {}
  chatList.forEach((name) => {
    const mock = MOCK_DEAL_INFO_BY_CHAT[name as keyof typeof MOCK_DEAL_INFO_BY_CHAT]
    if (mock) next[name] = mock
  })
  return next
}

const DEFAULT_USER_ID: UserId = 'kenyu'

export default function Page() {
  const [currentUserId, setCurrentUserId] = useState<UserId>(DEFAULT_USER_ID)
  const currentUser = getUser(currentUserId)
  const [currentView, setCurrentView] = useState<'new' | 'chat'>('new')
  const [currentChat, setCurrentChat] = useState<string | null>(null)
  const [openChats, setOpenChats] = useState<string[]>(() => [...currentUser.chatList])
  const [templateChats, setTemplateChats] = useState<string[]>([])
  const [closedChats, setClosedChats] = useState<string[]>([])
  const [dealInfoByChat, setDealInfoByChat] = useState<Record<string, DealInfo>>(() =>
    buildInitialDealInfoByChat(currentUser.chatList)
  )
  const [customServicesByChat, setCustomServicesByChat] = useState<Record<string, CustomServiceRow[]>>({})
  const [solutionPackagesByChat, setSolutionPackagesByChat] = useState<Record<string, SolutionPackage[]>>({})
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(() =>
    buildInitialChatHistories(currentUser.chatList)
  )
  const pendingStandardServiceRef = useRef<string | null>(null)

  const handleSwitchUser = useCallback((userId: UserId) => {
    setCurrentUserId(userId)
    const user = getUser(userId)
    setOpenChats([...user.chatList])
    setTemplateChats([])
    setClosedChats([])
    setCurrentChat(null)
    setCurrentView('new')
    setDealInfoByChat(buildInitialDealInfoByChat(user.chatList))
    setChatHistories(buildInitialChatHistories(user.chatList))
    setCustomServicesByChat({})
    setSolutionPackagesByChat({})
  }, [])

  const dealInfo: DealInfo | null = currentChat ? dealInfoByChat[currentChat] ?? null : null
  const currentChatMessages = currentChat
    ? (chatHistories[currentChat] ?? getDefaultChatMessages())
    : []
  const currentCustomServices = currentChat ? (customServicesByChat[currentChat] ?? []) : []
  const currentSolutionPackages = currentChat ? (solutionPackagesByChat[currentChat] ?? []) : []
  const setCurrentSolutionPackages = useCallback(
    (updater: SolutionPackage[] | ((prev: SolutionPackage[]) => SolutionPackage[])) => {
      if (!currentChat) return
      setSolutionPackagesByChat((prev) => ({
        ...prev,
        [currentChat]: typeof updater === 'function' ? updater(prev[currentChat] ?? []) : updater,
      }))
    },
    [currentChat]
  )
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

  const handleMarkAsTemplate = useCallback((chatName: string) => {
    setOpenChats((prev) => prev.filter((c) => c !== chatName))
    setTemplateChats((prev) => [...prev, chatName])
  }, [])
  const handleUnmarkAsTemplate = useCallback((chatName: string) => {
    setTemplateChats((prev) => prev.filter((c) => c !== chatName))
    setOpenChats((prev) => [...prev, chatName])
  }, [])
  const handleCloseChat = useCallback((chatName: string, fromSection: 'open' | 'template') => {
    if (fromSection === 'open') {
      setOpenChats((prev) => prev.filter((c) => c !== chatName))
    } else {
      setTemplateChats((prev) => prev.filter((c) => c !== chatName))
    }
    setClosedChats((prev) => [...prev, chatName])
    if (currentChat === chatName) {
      setCurrentChat(null)
      setCurrentView('new')
    }
  }, [currentChat])

  const handleSendMessage = useCallback((chatName: string, text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = { type: 'user', content: text.trim() }
    const companyName = extractCompanyNameFromInput(text)
    const messagesNow = chatHistories[chatName] ?? []
    const template = currentUser.template

    if (template === 'standard') {
      if (pendingStandardServiceRef.current && isConfirmAddAuditServices(text)) {
        setChatHistories((prev) => ({
          ...prev,
          [chatName]: [...(prev[chatName] ?? []), userMsg, { type: 'assistant-loading', step: 'Planning' }],
        }))
        setTimeout(() => {
          setSolutionPackagesByChat((prev) => ({
            ...prev,
            [chatName]: [...(prev[chatName] ?? []), createTaxCompliancePackage()],
          }))
          pendingStandardServiceRef.current = null
          setChatHistories((prev) => {
            const list = (prev[chatName] ?? []).filter((m) => m.type !== 'assistant-loading')
            return {
              ...prev,
              [chatName]: [...list, { type: 'assistant', content: 'Done. Added to Solution Package.' }],
            }
          })
        }, 2400)
        return
      }
      if (isTaxComplianceQuestion(text)) {
        pendingStandardServiceRef.current = 'Tax & Compliance Services'
        setChatHistories((prev) => ({
          ...prev,
          [chatName]: [...(prev[chatName] ?? []), userMsg, { type: 'assistant-loading', step: 'Planning' }],
        }))
        setTimeout(() => {
          setChatHistories((prev) => {
            const list = (prev[chatName] ?? []).filter((m) => m.type !== 'assistant-loading')
            return { ...prev, [chatName]: [...list, { type: 'assistant-loading', step: 'Searching' }] }
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
                  content: 'I found the following. Would you like to add this to your Solution Package?',
                  numberedList: ['Tax & Compliance Services'],
                },
              ],
            }
          })
        }, 2400)
        return
      }
    }

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
            'The FEE PROPOSAL table already has the selected service(s); no duplicates added.'
        } else if (toAdd.length > 0 && duplicated.length > 0) {
          serviceAddReplyRef.current =
            'Some items were already in the table. Only the new service(s) have been added.'
        } else if (toAdd.length > 0) {
          serviceAddReplyRef.current =
            'Done. The selected service(s) have been added to Value Added Services > FEE PROPOSAL. Please fill in the fee columns as needed.'
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
  }, [chatHistories, currentUser.template])

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <AppHeader currentUser={currentUser} onSwitchUser={handleSwitchUser} />
      <div className="flex flex-1 overflow-hidden">
        {currentView === 'new' ? (
          <>
            <AppSidebar
              openChats={openChats}
              templateChats={templateChats}
              closedChats={closedChats}
              onNewProposal={handleNewProposal}
              onSelectChat={handleSelectChat}
              onMarkAsTemplate={handleMarkAsTemplate}
              onUnmarkAsTemplate={handleUnmarkAsTemplate}
              onCloseChat={handleCloseChat}
              currentChat={currentChat}
            />
            <NewProposalForm currentUser={currentUser} onStart={handleStartProposal} />
          </>
        ) : (
          <>
            <AppSidebar
              openChats={openChats}
              templateChats={templateChats}
              closedChats={closedChats}
              onNewProposal={handleNewProposal}
              onSelectChat={handleSelectChat}
              onMarkAsTemplate={handleMarkAsTemplate}
              onUnmarkAsTemplate={handleUnmarkAsTemplate}
              onCloseChat={handleCloseChat}
              currentChat={currentChat}
            />
            <ChatInterface
              template={currentUser.template}
              dealInfo={dealInfo}
              dealName={currentChat ?? 'testing'}
              messages={currentChatMessages}
              onSendMessage={currentChat ? (text) => handleSendMessage(currentChat, text) : undefined}
              customServices={currentCustomServices}
              onCustomServicesChange={setCurrentCustomServices}
              solutionPackages={currentUser.template === 'standard' ? currentSolutionPackages : undefined}
              onSolutionPackagesChange={currentUser.template === 'standard' ? setCurrentSolutionPackages : undefined}
            />
          </>
        )}
      </div>
    </div>
  )
}
