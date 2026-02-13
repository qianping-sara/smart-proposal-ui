'use client'

import { ChevronDown, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ChatPanel } from '@/components/chat-panel'
import { ProposalPreview } from '@/components/proposal-preview'

import type { ChatMessage } from '@/lib/chat-types'

interface ChatInterfaceProps {
  dealInfo: {
    dealName: string
    pipeline: string
    contactPerson: string
    contactEmail: string
  } | null
  dealName: string
  messages: ChatMessage[]
}

export function ChatInterface({ dealInfo, dealName, messages }: ChatInterfaceProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1 px-2 text-sm font-normal text-black">
              {dealName}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>{dealName}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-2 text-gray-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="text-sm">No deal linked</span>
        </div>
      </div>
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        <ResizablePanel defaultSize={50} minSize={30}>
          <ChatPanel dealName={dealName} messages={messages} />
        </ResizablePanel>
        <ResizableHandle className="w-px bg-gray-300 hover:bg-gray-400" />
        <ResizablePanel defaultSize={50} minSize={30}>
          <ProposalPreview dealInfo={dealInfo} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
