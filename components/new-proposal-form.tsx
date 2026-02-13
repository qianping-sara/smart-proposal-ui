'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SquareIcon } from 'lucide-react'
import type { AppUser } from '@/lib/users'

interface NewProposalFormProps {
  currentUser: AppUser
  onStart: (data: {
    dealName: string
    pipeline: string
    contactPerson: string
    contactEmail: string
  }) => void
}

const TEMPLATE_LABELS: Record<AppUser['template'], string> = {
  audit: 'Incorp Audit Template',
  standard: 'Incorp Standard Template',
}

export function NewProposalForm({ currentUser, onStart }: NewProposalFormProps) {
  const [dealName, setDealName] = useState('')
  const [pipeline, setPipeline] = useState('digital-marketing')
  const [contactPerson, setContactPerson] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [template, setTemplate] = useState<AppUser['template']>(currentUser.template)
  useEffect(() => {
    setTemplate(currentUser.template)
  }, [currentUser.id, currentUser.template])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (dealName && pipeline && contactPerson && contactEmail) {
      onStart({
        dealName,
        pipeline,
        contactPerson,
        contactEmail,
      })
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center overflow-auto bg-gray-50 p-8">
      <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">Start a New proposal</h1>
            <p className="mt-1 text-sm text-gray-600">
              To create a great proposal, start by telling me who the client is.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100">
              <SquareIcon className="h-4 w-4 text-gray-600" />
            </div>
            <Select value={template} onValueChange={(v) => setTemplate(v as AppUser['template'])}>
              <SelectTrigger className="w-48 border-0 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={currentUser.template}>
                  {TEMPLATE_LABELS[currentUser.template]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="dealName" className="text-sm font-normal text-black">
              Deal Name <span className="text-gray-500">*</span>
            </Label>
            <Input
              id="dealName"
              placeholder="Please enter..."
              value={dealName}
              onChange={(e) => setDealName(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-normal text-black">Pipeline</Label>
            <RadioGroup
              value={pipeline}
              onValueChange={setPipeline}
              className="mt-3 flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="digital-marketing" id="digital" />
                <Label htmlFor="digital" className="cursor-pointer font-normal">
                  Digital marketing pipeline
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="cursor-pointer font-normal">
                  New pipeline
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="organic" id="organic" />
                <Label htmlFor="organic" className="cursor-pointer font-normal">
                  Organic pipeline
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson" className="text-sm font-normal text-black">
                Contact Person <span className="text-gray-500">*</span>
              </Label>
              <Input
                id="contactPerson"
                placeholder="Please enter contact name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="contactEmail" className="text-sm font-normal text-black">
                Contact Email <span className="text-gray-500">*</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="Please enter contact email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="mt-2"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-600 py-6 text-base hover:bg-gray-700"
          >
            Start
          </Button>
        </form>
      </div>
    </div>
  )
}
