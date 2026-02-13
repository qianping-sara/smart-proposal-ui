'use client'

import { ChevronDown, ChevronRight, Edit2, Sparkles, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { DynamicTableBuilder } from '@/components/dynamic-table-builder'

interface ProposalPreviewProps {
  dealInfo: {
    dealName: string
    pipeline: string
    contactPerson: string
    contactEmail: string
  } | null
}

export function ProposalPreview({ dealInfo }: ProposalPreviewProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    client: true,
    executive: true,
    scope: false,
    solution: false,
    appendix: false,
    invoice: false,
  })
  const [isClientEditing, setIsClientEditing] = useState(false)
  const [clientForm, setClientForm] = useState({
    contactName: dealInfo?.contactPerson ?? 'abc',
    contactEmail: dealInfo?.contactEmail ?? 'abc@abc.com',
    contactTitle: '',
    companyName: '',
    companyAddress: '',
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const startClientEdit = () => {
    setClientForm({
      contactName: dealInfo?.contactPerson ?? 'abc',
      contactEmail: dealInfo?.contactEmail ?? 'abc@abc.com',
      contactTitle: '',
      companyName: '',
      companyAddress: '',
    })
    setIsClientEditing(true)
  }

  const saveClientInfo = () => {
    setIsClientEditing(false)
  }

  const cancelClientEdit = () => {
    setClientForm({
      contactName: dealInfo?.contactPerson ?? 'abc',
      contactEmail: dealInfo?.contactEmail ?? 'abc@abc.com',
      contactTitle: '',
      companyName: '',
      companyAddress: '',
    })
    setIsClientEditing(false)
  }

  useEffect(() => {
    if (!isClientEditing) {
      const name = dealInfo?.contactPerson ?? 'abc'
      const email = dealInfo?.contactEmail ?? 'abc@abc.com'
      setClientForm((prev) =>
        prev.contactName === name && prev.contactEmail === email
          ? prev
          : { ...prev, contactName: name, contactEmail: email, contactTitle: '', companyName: '', companyAddress: '' }
      )
    }
  }, [dealInfo?.contactPerson, dealInfo?.contactEmail, isClientEditing])

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="flex items-center justify-between bg-gray-50 px-6 py-3">
        <h2 className="text-base font-semibold text-black">Proposal Preview</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">2/4 ready</span>
          <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white text-sm">
            Generate proposal
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-2">
          {/* Client Information */}
          <Collapsible open={openSections.client} onOpenChange={() => toggleSection('client')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      !openSections.client && '-rotate-90'
                    )}
                  />
                  <span className="text-sm font-medium text-black">Client information</span>
                </div>
                <div
                  className="flex h-8 items-center gap-1 px-2 text-sm text-gray-600 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation()
                    startClientEdit()
                  }}
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-gray-100 px-4 py-3">
                  {isClientEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-xs font-normal text-black">
                            Contact Name <span className="text-gray-500">*</span>
                          </label>
                          <Input
                            value={clientForm.contactName}
                            onChange={(e) => setClientForm((p) => ({ ...p, contactName: e.target.value }))}
                            className="border-gray-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-normal text-black">
                            Contact Email <span className="text-gray-500">*</span>
                          </label>
                          <Input
                            type="email"
                            value={clientForm.contactEmail}
                            onChange={(e) => setClientForm((p) => ({ ...p, contactEmail: e.target.value }))}
                            className="border-gray-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-normal text-black">
                            Contact Title
                          </label>
                          <Input
                            placeholder="Enter contact title"
                            value={clientForm.contactTitle}
                            onChange={(e) => setClientForm((p) => ({ ...p, contactTitle: e.target.value }))}
                            className="border-gray-300 text-sm placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-normal text-black">
                            Company Name
                          </label>
                          <Input
                            placeholder="Enter company name"
                            value={clientForm.companyName}
                            onChange={(e) => setClientForm((p) => ({ ...p, companyName: e.target.value }))}
                            className="border-gray-300 text-sm placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-normal text-black">
                          Company Address
                        </label>
                        <Input
                          placeholder="Enter company address"
                          value={clientForm.companyAddress}
                          onChange={(e) => setClientForm((p) => ({ ...p, companyAddress: e.target.value }))}
                          className="border-gray-300 text-sm placeholder:text-gray-400"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-black hover:bg-gray-50"
                          onClick={cancelClientEdit}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white" onClick={saveClientInfo}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <dl className="space-y-1 text-sm">
                      <div className="flex gap-2">
                        <dt className="text-gray-600">Contact Name:</dt>
                        <dd className="text-gray-900">{clientForm.contactName}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-gray-600">Contact Email:</dt>
                        <dd className="text-gray-900">{clientForm.contactEmail}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-gray-600">Contact Title:</dt>
                        <dd className="text-gray-900">{clientForm.contactTitle || '-'}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-gray-600">Company Name:</dt>
                        <dd className="text-gray-900">{clientForm.companyName || '-'}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-gray-600">Company Address:</dt>
                        <dd className="text-gray-900">{clientForm.companyAddress || '-'}</dd>
                      </div>
                    </dl>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Executive Summary */}
          <Collapsible open={openSections.executive} onOpenChange={() => toggleSection('executive')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      !openSections.executive && '-rotate-90'
                    )}
                  />
                  <span className="text-sm font-medium text-black">Executive Summary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 items-center gap-1 px-2 text-sm text-gray-600 hover:text-black"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Sparkles className="h-3 w-3" />
                    Improve
                  </div>
                  <div
                    className="flex h-8 items-center gap-1 px-2 text-sm text-gray-600 hover:text-black"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-gray-100 px-4 py-3">
                  <div className="space-y-2 text-sm leading-relaxed text-gray-900">
                    <p>We are pleased to be presenting our proposal to you.</p>
                    <p>
                      Our team of experienced professionals work very closely with clients on various corporate, accounting, compliance and governance matter and identify the unique requirements of individual organizations. As a strong believer of long-term partnerships, we are committed to providing tailored solutions that not only meet our clients' objectives, but also giving them a peace of mind to focus on their core businesses.
                    </p>
                    <p>
                      The following pages outline our services tailor made to you and we trust that our proposal meets your expectations. We are excited to work with you and look forward to a long and mutually beneficial working relationship with you and the Company.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Scope of Services */}
          <Collapsible open={openSections.scope} onOpenChange={() => toggleSection('scope')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-sm font-medium text-black">Scope of Services</span>
                </div>
                <span className="text-xs text-gray-500">Not Ready</span>
              </CollapsibleTrigger>
            </div>
          </Collapsible>

          {/* Solution Package + Services & Prices */}
          <Collapsible open={openSections.solution} onOpenChange={() => toggleSection('solution')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-sm font-medium text-black">Solution Package + Services & Prices</span>
                </div>
                <span className="text-xs text-gray-500">Not Ready</span>
              </CollapsibleTrigger>
            </div>
          </Collapsible>

          {/* Appendix (Optional) */}
          <Collapsible open={openSections.appendix} onOpenChange={() => toggleSection('appendix')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      !openSections.appendix && '-rotate-90'
                    )}
                  />
                  <span className="text-sm font-medium text-black">Appendix (Optional)</span>
                </div>
                <div
                  className="flex h-8 items-center gap-1 px-2 text-sm text-gray-600 hover:text-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-gray-100 px-4 py-4">
                  <div className="space-y-4">
                    {/* Title Field */}
                    <div>
                      <label className="mb-2 block text-sm font-normal text-black">
                        Title <span className="text-gray-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Please enter..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                      />
                    </div>

                    {/* Description Field */}
                    <div>
                      <label className="mb-2 block text-sm font-normal text-black">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Please enter..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                      />
                    </div>

                    {/* Dynamic Table Builder */}
                    <DynamicTableBuilder />

                    {/* Footnotes Field */}
                    <div>
                      <label className="mb-2 block text-sm font-normal text-black">
                        Footnotes (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Please enter..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      <Button variant="outline" size="sm" className="border-gray-300 text-black hover:bg-gray-50">
                        Cancel
                      </Button>
                      <Button size="sm" className="bg-gray-600 hover:bg-gray-700">
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* First Total Invoice Value (Optional) */}
          <Collapsible open={openSections.invoice} onOpenChange={() => toggleSection('invoice')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-sm font-medium text-black">First Total Invoice Value (Optional)</span>
                </div>
                <span className="text-xs text-gray-500">Not Ready</span>
              </CollapsibleTrigger>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}
