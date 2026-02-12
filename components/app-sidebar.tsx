'use client'

import { useState } from 'react'
import { Search, SquareIcon, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface AppSidebarProps {
  onNewProposal: () => void
  onSelectChat: (chatName: string) => void
  currentChat: string | null
}

const mockChats = {
  open: [
    'Parable Church Ltd - Audit Proposal',
    'Janus Electric Limited',
    'Viridis Green Data Centres Limited',
    'Omni Tanker Holdings Ltd',
    'Supa Technologies Audit',
  ],
  closed: [],
}

export function AppSidebar({ onNewProposal, onSelectChat, currentChat }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpenExpanded, setIsOpenExpanded] = useState(true)

  if (isCollapsed) {
    return (
      <div className="flex h-full w-12 flex-col items-center border-r border-gray-200 bg-gray-50 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewProposal}
          className="mb-4 h-8 w-8 bg-white hover:bg-gray-100"
        >
          <SquareIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Search className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50">
      <div className="flex flex-col gap-2 p-3">
        <Button
          onClick={onNewProposal}
          className="justify-start gap-2 bg-white text-black shadow-none hover:bg-gray-100"
          variant="outline"
        >
          <SquareIcon className="h-4 w-4" />
          New Proposal
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search Chats"
            className="bg-white pl-9 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Collapsible open={isOpenExpanded} onOpenChange={setIsOpenExpanded}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
            <div className="flex items-center gap-1">
              <ChevronDown className={cn("h-3 w-3 transition-transform", !isOpenExpanded && "-rotate-90")} />
              <span>Open</span>
            </div>
            <span className="text-gray-400">{mockChats.open.length}</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col">
              {mockChats.open.map((chat, index) => (
                <button
                  key={index}
                  onClick={() => onSelectChat(chat)}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100",
                    currentChat === chat && "bg-gray-200"
                  )}
                >
                  <span className="truncate">{chat}</span>
                  {currentChat === chat && (
                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
            <div className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              <span>Closed</span>
            </div>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      <div className="border-t border-gray-200 p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
