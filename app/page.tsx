'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { Search, Bookmark, AlertTriangle } from 'lucide-react'
import { NewProposalForm } from '@/components/new-proposal-form'
import { ChatInterface } from '@/components/chat-interface'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { getDefaultChatMessages, type ChatMessage } from '@/lib/chat-types'
import { USERS, getUser, type UserId } from '@/lib/users'
import { createTaxCompliancePackage, type SolutionPackage } from '@/lib/solution-package'
import {
  buildInitialCustomServicesByChat,
  buildInitialDealInfoByChat,
  getFeeProposal,
  type CustomServiceRow,
  type DealInfo,
} from '@/lib/chat-dummy-data'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type { CustomServiceRow, DealInfo }

export const AUDIT_SERVICES_LIST = [
  'Year-end audit of financial report',
  'Review of half-year financial report',
  'Statutory audit of financial statements',
] as const

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

function buildInitialChatHistories(chatList: readonly string[]): Record<string, ChatMessage[]> {
  const next: Record<string, ChatMessage[]> = {}
  chatList.forEach((name) => {
    next[name] = getDefaultChatMessages()
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
  const [customServicesByChat, setCustomServicesByChat] = useState<Record<string, CustomServiceRow[]>>(() =>
    buildInitialCustomServicesByChat(currentUser.chatList)
  )
  const [solutionPackagesByChat, setSolutionPackagesByChat] = useState<Record<string, SolutionPackage[]>>({})
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(() =>
    buildInitialChatHistories(currentUser.chatList)
  )
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false)
  const [cloneTargetChat, setCloneTargetChat] = useState<string | null>(null)
  const [cloneSourceChat, setCloneSourceChat] = useState<string | null>(null)
  const [cloneSearch, setCloneSearch] = useState('')
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
    setCustomServicesByChat(buildInitialCustomServicesByChat(user.chatList))
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

  const cloneCandidates = useMemo(() => {
    const templateSet = new Set(templateChats)
    const result: { name: string; isTemplate: boolean }[] = []
    templateChats.forEach((name) => {
      if (name !== cloneTargetChat) {
        result.push({ name, isTemplate: true })
      }
    })
    openChats.forEach((name) => {
      if (name !== cloneTargetChat && !templateSet.has(name)) {
        result.push({ name, isTemplate: false })
      }
    })
    return result
  }, [openChats, templateChats, cloneTargetChat])

  const filteredCloneCandidates = useMemo(() => {
    const q = cloneSearch.trim().toLowerCase()
    if (!q) return cloneCandidates
    return cloneCandidates.filter((c) => c.name.toLowerCase().includes(q))
  }, [cloneCandidates, cloneSearch])

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

  const handleOpenCloneDialog = useCallback((chatName: string) => {
    setCloneTargetChat(chatName)
    setCloneSourceChat(null)
    setCloneSearch('')
    setIsCloneDialogOpen(true)
  }, [])

  const handleConfirmClone = useCallback(() => {
    if (!cloneTargetChat || !cloneSourceChat) return

    setDealInfoByChat((prev) => {
      const current = prev[cloneTargetChat]
      if (!current) return prev
      return {
        ...prev,
        [cloneTargetChat]: {
          ...current,
          dummyKey: cloneSourceChat,
        },
      }
    })

    setCustomServicesByChat((prev) => {
      const sourceRows =
        prev[cloneSourceChat] ??
        getFeeProposal(cloneSourceChat) ??
        []
      return {
        ...prev,
        [cloneTargetChat]: sourceRows.map((row) => ({ ...row })),
      }
    })

    setSolutionPackagesByChat((prev) => {
      const sourcePkgs = prev[cloneSourceChat]
      if (!sourcePkgs || sourcePkgs.length === 0) {
        const { [cloneTargetChat]: _omit, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [cloneTargetChat]: sourcePkgs.map((pkg) => ({ ...pkg })),
      }
    })

    setIsCloneDialogOpen(false)
  }, [cloneSourceChat, cloneTargetChat, setCustomServicesByChat, setDealInfoByChat, setSolutionPackagesByChat])

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
              onRenameChat={() => {}}
              onMarkAsTemplate={handleMarkAsTemplate}
              onCloseChat={(chatName) => handleCloseChat(chatName, openChats.includes(chatName) ? 'open' : 'template')}
              onCopyServicesFromPastProposal={handleOpenCloneDialog}
            />
          </>
        )}
      </div>

      <Dialog
        open={isCloneDialogOpen}
        onOpenChange={(open) => {
          setIsCloneDialogOpen(open)
          if (!open) {
            setCloneSourceChat(null)
            setCloneTargetChat(null)
            setCloneSearch('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone historical proposal</DialogTitle>
            <DialogDescription>
              Select a conversation to reuse its proposal preview. The selected proposal preview will replace the current one in this conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-0">
            <div className="mb-5 flex items-start gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <p>
                Cloning will overwrite content of current proposal (except client info).
              </p>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search conversation name"
                  className="pl-9"
                  value={cloneSearch}
                  onChange={(e) => setCloneSearch(e.target.value)}
                />
              </div>
              <div className="max-h-72 overflow-y-auto rounded-md border">
                {filteredCloneCandidates.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No more conversations
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredCloneCandidates.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        className={cn(
                          'flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-50',
                          cloneSourceChat === item.name && 'bg-gray-50'
                        )}
                        onClick={() => setCloneSourceChat(item.name)}
                      >
                        <div className="flex min-w-0 items-center justify-between gap-2">
                          <span className="truncate">{item.name}</span>
                          {item.isTemplate && (
                            <Bookmark className="h-4 w-4 shrink-0 text-gray-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsCloneDialogOpen(false)
                setCloneSourceChat(null)
                setCloneTargetChat(null)
                setCloneSearch('')
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!cloneSourceChat || !cloneTargetChat}
              onClick={handleConfirmClone}
              className="bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-600"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
