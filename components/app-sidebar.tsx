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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AppSidebarProps {
  openChats: string[]
  templateChats: string[]
  closedChats: string[]
  onNewProposal: () => void
  onSelectChat: (chatName: string) => void
  onMarkAsTemplate: (chatName: string) => void
  onUnmarkAsTemplate: (chatName: string) => void
  onCloseChat: (chatName: string, fromSection: 'open' | 'template') => void
  currentChat: string | null
}

export function AppSidebar({
  openChats,
  templateChats,
  closedChats,
  onNewProposal,
  onSelectChat,
  onMarkAsTemplate,
  onUnmarkAsTemplate,
  onCloseChat,
  currentChat,
}: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTemplateExpanded, setIsTemplateExpanded] = useState(true)
  const [isOpenExpanded, setIsOpenExpanded] = useState(true)
  const [isClosedExpanded, setIsClosedExpanded] = useState(false)

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
        <Collapsible open={isTemplateExpanded} onOpenChange={setIsTemplateExpanded}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
            <div className="flex items-center gap-1">
              <ChevronDown className={cn("h-3 w-3 transition-transform", !isTemplateExpanded && "-rotate-90")} />
              <span>Template</span>
            </div>
            <span className="text-gray-400">{templateChats.length}</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col">
              {templateChats.map((chat, index) => (
                <div
                  key={`t-${index}`}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100",
                    currentChat === chat && "bg-gray-200"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectChat(chat)}
                    className="flex-1 min-w-0 truncate text-left"
                  >
                    {chat}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-gray-500 hover:text-black" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="bottom" sideOffset={4} className="min-w-[10rem]">
                      <DropdownMenuItem onClick={() => onUnmarkAsTemplate(chat)}>Unmark as Template</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCloseChat(chat, 'template')}>Close</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isOpenExpanded} onOpenChange={setIsOpenExpanded}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
            <div className="flex items-center gap-1">
              <ChevronDown className={cn("h-3 w-3 transition-transform", !isOpenExpanded && "-rotate-90")} />
              <span>Open</span>
            </div>
            <span className="text-gray-400">{openChats.length}</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col">
              {openChats.map((chat, index) => (
                <div
                  key={`o-${index}`}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100",
                    currentChat === chat && "bg-gray-200"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectChat(chat)}
                    className="flex-1 min-w-0 truncate text-left"
                  >
                    {chat}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-gray-500 hover:text-black" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="bottom" sideOffset={4} className="min-w-[10rem]">
                      <DropdownMenuItem onClick={() => onMarkAsTemplate(chat)}>Mark as Template</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCloseChat(chat, 'open')}>Close</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isClosedExpanded} onOpenChange={setIsClosedExpanded}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
            <div className="flex items-center gap-1">
              <ChevronDown className={cn("h-3 w-3 transition-transform", !isClosedExpanded && "-rotate-90")} />
              <span>Closed</span>
            </div>
            <span className="text-gray-400">{closedChats.length}</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col">
              {closedChats.map((chat, index) => (
                <button
                  key={`c-${index}`}
                  onClick={() => onSelectChat(chat)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100",
                    currentChat === chat && "bg-gray-200"
                  )}
                >
                  <span className="truncate">{chat}</span>
                </button>
              ))}
            </div>
          </CollapsibleContent>
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
