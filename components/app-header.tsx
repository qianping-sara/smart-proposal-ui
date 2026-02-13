'use client'

import { SquareIcon, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { USERS, type AppUser, type UserId } from '@/lib/users'

interface AppHeaderProps {
  currentUser: AppUser
  onSwitchUser: (userId: UserId) => void
}

export function AppHeader({ currentUser, onSwitchUser }: AppHeaderProps) {
  return (
    <header className="flex w-full shrink-0 border-b border-gray-200 bg-white">
      <div className="flex h-14 w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-black">
            <SquareIcon className="h-5 w-5 text-white" fill="white" />
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 px-2 text-sm font-normal text-black">
                Smart Proposal
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Smart Proposal</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-xs font-medium text-white">
                  {currentUser.initials}
                </div>
                <span className="text-sm font-medium text-black">{currentUser.name}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {USERS.filter((u) => u.id !== currentUser.id).map((u) => (
                <DropdownMenuItem key={u.id} onSelect={() => onSwitchUser(u.id)}>
                  <span className="font-medium">{u.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
