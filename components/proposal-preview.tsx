'use client'

import { ChevronDown, ChevronRight, Edit2, Sparkles, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
    solution: false,
    ourTeam: false,
    industryExperience: false,
    appendix: false,
  })
  const [isClientEditing, setIsClientEditing] = useState(false)
  const [executiveEditMode, setExecutiveEditMode] = useState(false)
  const [executiveAiImproveOpen, setExecutiveAiImproveOpen] = useState(false)
  const [executiveAiResult, setExecutiveAiResult] = useState<string | null>(null)
  const [executiveAiPrompt, setExecutiveAiPrompt] = useState('')
  const defaultExecutiveText =
    'We are pleased to be presenting our proposal to you.\n\nOur team of experienced professionals work very closely with clients on various corporate, accounting, compliance and governance matter and identify the unique requirements of individual organizations. As a strong believer of long-term partnerships, we are committed to providing tailored solutions that not only meet our clients\' objectives, but also giving them a peace of mind to focus on their core businesses.\n\nThe following pages outline our services tailor made to you and we trust that our proposal meets your expectations. We are excited to work with you and look forward to a long and mutually beneficial working relationship with you and the Company.'
  const [executiveSummaryText, setExecutiveSummaryText] = useState(defaultExecutiveText)
  const [executiveSummarySaved, setExecutiveSummarySaved] = useState(defaultExecutiveText)
  const [clientForm, setClientForm] = useState({
    contactName: dealInfo?.contactPerson ?? 'abc',
    contactEmail: dealInfo?.contactEmail ?? 'abc@abc.com',
    contactTitle: '',
    companyName: '',
    companyShortName: '',
    companyAddress: '',
  })

  const defaultVasPart1 = [
    {
      description:
        'Review of prior year balances as required under Australian Auditing Standards in order to be able to provide an unmodified audit opinion.',
      oneOff: 'No charge',
      recurring: 'No charge',
    },
    {
      description: 'Review of the impact of any new accounting standards',
      oneOff: 'No charge',
      recurring: 'No charge',
    },
  ]
  const defaultVasPart3 = [
    { natureOfService: 'Reasonable Assurance on Financial Report', statutoryAudit: true, valueAdd: true },
    {
      natureOfService: 'Communication of Process and Findings to Directors and Management',
      statutoryAudit: true,
      valueAdd: true,
    },
    { natureOfService: 'Understanding of Internal Controls', statutoryAudit: true, valueAdd: true },
    {
      natureOfService:
        "Access to partners and senior staff at In.Corp without the worry that the 'clock is ticking'. As we do not complete timesheets it has allowed us to focus more on our philosophy of providing value add service to our clients without you having to worry about additional costs.",
      statutoryAudit: false,
      valueAdd: true,
    },
  ]
  const [vasPart1, setVasPart1] = useState<Array<{ description: string; oneOff: string; recurring: string }>>(defaultVasPart1)
  const [vasPart2, setVasPart2] = useState<Array<{ description: string; oneOff: string; recurring: string }>>([])
  const [vasPart3, setVasPart3] = useState<
    Array<{ natureOfService: string; statutoryAudit: boolean; valueAdd: boolean }>
  >(defaultVasPart3)
  const [editingNatureCell, setEditingNatureCell] = useState<string | null>(null)

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
      companyShortName: clientForm.companyShortName ?? '',
      companyAddress: clientForm.companyAddress ?? '',
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
      companyShortName: '',
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
          : { ...prev, contactName: name, contactEmail: email, contactTitle: '', companyName: '', companyShortName: prev.companyShortName, companyAddress: '' }
      )
    }
  }, [dealInfo?.contactPerson, dealInfo?.contactEmail, isClientEditing])

  const startExecutiveEdit = () => {
    setOpenSections((prev) => ({ ...prev, executive: true }))
    setExecutiveSummarySaved(executiveSummaryText)
    setExecutiveEditMode(true)
    setExecutiveAiImproveOpen(false)
    setExecutiveAiResult(null)
  }
  const saveExecutiveEdit = () => {
    setExecutiveSummarySaved(executiveSummaryText)
    setExecutiveEditMode(false)
  }
  const cancelExecutiveEdit = () => {
    setExecutiveSummaryText(executiveSummarySaved)
    setExecutiveEditMode(false)
  }
  const startExecutiveAiImprove = () => {
    setOpenSections((prev) => ({ ...prev, executive: true }))
    setExecutiveAiImproveOpen(true)
    setExecutiveEditMode(false)
  }
  const createAiSuggestion = () => {
    setExecutiveAiResult(
      'We are pleased to present our proposal, offering tailored solutions and a trusted partnership to support your business goals.'
    )
  }
  const replaceWithAiSuggestion = () => {
    if (executiveAiResult) {
      setExecutiveSummaryText(executiveAiResult)
      setExecutiveAiResult(null)
      setExecutiveAiPrompt('')
      setExecutiveAiImproveOpen(false)
    }
  }
  const updateAiSuggestion = () => {
    setExecutiveAiResult(
      'We are pleased to present our proposal, offering tailored solutions and a trusted partnership to support your business goals.'
    )
  }
  const closeAiImprove = () => {
    setExecutiveAiImproveOpen(false)
    setExecutiveAiResult(null)
    setExecutiveAiPrompt('')
  }

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
                        <div>
                          <label className="mb-1 block text-xs font-normal text-black">
                            Company abbreviation
                          </label>
                          <Input
                            placeholder="Enter company abbreviation"
                            value={clientForm.companyShortName}
                            onChange={(e) => setClientForm((p) => ({ ...p, companyShortName: e.target.value }))}
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
                        <dt className="text-gray-600">Company abbreviation:</dt>
                        <dd className="text-gray-900">{clientForm.companyShortName || '-'}</dd>
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

          {/* Executive Summary - temporarily hidden */}
          {false && (
          <div className="group rounded-lg border border-gray-200 bg-white">
            <div className="flex h-12 w-full shrink-0 items-center justify-between px-4 hover:bg-gray-50">
              <button
                type="button"
                className="flex flex-1 items-center gap-2 text-left outline-none"
                onClick={() => toggleSection('executive')}
              >
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    !openSections.executive && '-rotate-90'
                  )}
                />
                <span className="text-sm font-medium text-black">Executive Summary</span>
              </button>
              <div className="relative z-10 flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  className="flex h-8 cursor-pointer items-center gap-1 rounded px-2 text-sm font-normal text-gray-600 hover:bg-gray-100 hover:text-black"
                  onClick={startExecutiveAiImprove}
                >
                  <Sparkles className="h-3 w-3" />
                  Improve
                </button>
                <button
                  type="button"
                  className="flex h-8 cursor-pointer items-center gap-1 rounded px-2 text-sm font-normal text-gray-600 hover:bg-gray-100 hover:text-black"
                  onClick={startExecutiveEdit}
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
            {openSections.executive && (
              <div className="border-t border-gray-100 px-4 py-3">
                  {executiveEditMode ? (
                    <div className="space-y-4">
                      <Textarea
                        value={executiveSummaryText}
                        onChange={(e) => setExecutiveSummaryText(e.target.value)}
                        className="min-h-[160px] resize-y border-gray-300 text-sm"
                        placeholder="Enter executive summary..."
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-black hover:bg-gray-50"
                          onClick={cancelExecutiveEdit}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white" onClick={saveExecutiveEdit}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm leading-relaxed text-gray-900">
                      {executiveSummaryText.split(/\n\n+/).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}
                  {executiveAiImproveOpen && (
                    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-black">AI Improve</span>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-gray-500 hover:text-gray-700"
                          onClick={closeAiImprove}
                        >
                          Close
                        </button>
                      </div>
                      {executiveAiResult ? (
                        <div className="space-y-3">
                          <p className="text-sm font-medium leading-relaxed text-gray-900">
                            {executiveAiResult}
                          </p>
                          <Button
                            size="sm"
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                            onClick={replaceWithAiSuggestion}
                          >
                            Replace
                          </Button>
                          <p className="text-xs text-gray-500">Not satisfied? Update your input and try again.</p>
                          <div className="flex gap-2">
                            <Input
                              value={executiveAiPrompt}
                              onChange={(e) => setExecutiveAiPrompt(e.target.value)}
                              placeholder="refactor to shorter said 100 chars"
                              className="flex-1 border-gray-300 text-sm placeholder:text-gray-400"
                            />
                            <Button
                              size="sm"
                              className="shrink-0 bg-gray-600 hover:bg-gray-700 text-white"
                              onClick={updateAiSuggestion}
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            value={executiveAiPrompt}
                            onChange={(e) => setExecutiveAiPrompt(e.target.value)}
                            placeholder="refactor to shorter said 100 chars"
                            className="flex-1 border-gray-300 text-sm placeholder:text-gray-400"
                          />
                          <Button
                            size="sm"
                            className="shrink-0 bg-gray-600 hover:bg-gray-700 text-white"
                            onClick={createAiSuggestion}
                          >
                            Create
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
            )}
          </div>
          )}

          {/* Value Added Services */}
          <Collapsible open={openSections.solution} onOpenChange={() => toggleSection('solution')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      !openSections.solution && '-rotate-90'
                    )}
                  />
                  <span className="text-sm font-medium text-black">Value Added Services</span>
                </div>
                <span className="text-xs text-gray-500">Not Ready</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-gray-100 px-4 py-4 space-y-5">
                  {/* Part 1 */}
                  <div>
                    <h4 className="text-sm font-semibold text-black mb-2">Value added at no charge</h4>
                    <div className="overflow-x-auto rounded border border-gray-200">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-2 py-1.5 text-left font-medium text-black">Nature of service</th>
                            <th className="px-2 py-1.5 text-left font-medium text-black w-28">One-off Fee (SGD)</th>
                            <th className="px-2 py-1.5 text-left font-medium text-black w-28">Recurring Fee (SGD)</th>
                            <th className="px-2 py-1.5 w-8" />
                          </tr>
                        </thead>
                        <tbody>
                          {vasPart1.map((row, i) => (
                            <tr key={i} className="border-b border-gray-100 last:border-0">
                              <td className="px-2 py-1.5 align-top min-w-[200px]">
                                {editingNatureCell === `1-${i}` ? (
                                  <Textarea
                                    value={row.description}
                                    onChange={(e) =>
                                      setVasPart1((prev) => {
                                        const next = [...prev]
                                        next[i] = { ...next[i], description: e.target.value }
                                        return next
                                      })
                                    }
                                    onBlur={() => setEditingNatureCell(null)}
                                    rows={4}
                                    className="min-h-0 resize-none border border-gray-300 text-xs py-1 px-2 focus-visible:ring-1"
                                    autoFocus
                                  />
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setEditingNatureCell(`1-${i}`)}
                                    className="w-full text-left rounded border border-transparent hover:border-gray-300 py-1 px-2 min-h-[2.5rem]"
                                  >
                                    <span className="line-clamp-4 text-gray-900 block">
                                      {row.description || 'Click to edit'}
                                    </span>
                                  </button>
                                )}
                              </td>
                              <td className="px-2 py-1.5">
                                <Input
                                  value={row.oneOff}
                                  onChange={(e) =>
                                    setVasPart1((prev) => {
                                      const next = [...prev]
                                      next[i] = { ...next[i], oneOff: e.target.value }
                                      return next
                                    })
                                  }
                                  className="border border-gray-300 text-xs h-7 px-2"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <Input
                                  value={row.recurring}
                                  onChange={(e) =>
                                    setVasPart1((prev) => {
                                      const next = [...prev]
                                      next[i] = { ...next[i], recurring: e.target.value }
                                      return next
                                    })
                                  }
                                  className="border border-gray-300 text-xs h-7 px-2"
                                />
                              </td>
                              <td className="px-2 py-1.5">
                                <button
                                  type="button"
                                  onClick={() => setVasPart1((prev) => prev.filter((_, idx) => idx !== i))}
                                  className="text-gray-500 hover:text-black"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-1.5 border-gray-300 text-black hover:bg-gray-50 text-xs h-7"
                      onClick={() => setVasPart1((prev) => [...prev, { description: '', oneOff: 'No charge', recurring: 'No charge' }])}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add row
                    </Button>
                  </div>

                  {/* Part 2 */}
                  <div>
                    <h4 className="text-sm font-semibold text-black mb-2">Custom services</h4>
                    <div className="overflow-x-auto rounded border border-gray-200">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-2 py-1.5 text-left font-medium text-black">Nature of service</th>
                            <th className="px-2 py-1.5 text-left font-medium text-black w-28">One-off Fee (SGD)</th>
                            <th className="px-2 py-1.5 text-left font-medium text-black w-28">Recurring Fee (SGD)</th>
                            <th className="px-2 py-1.5 w-8" />
                          </tr>
                        </thead>
                        <tbody>
                          {vasPart2.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-2 py-3 text-center text-gray-500 text-xs">
                                No rows yet. Add rows or fill via dialogue later.
                              </td>
                            </tr>
                          ) : (
                            vasPart2.map((row, i) => (
                              <tr key={i} className="border-b border-gray-100 last:border-0">
                                <td className="px-2 py-1.5 align-top min-w-[200px]">
                                  {editingNatureCell === `2-${i}` ? (
                                    <Textarea
                                      value={row.description}
                                      onChange={(e) =>
                                        setVasPart2((prev) => {
                                          const next = [...prev]
                                          next[i] = { ...next[i], description: e.target.value }
                                          return next
                                        })
                                      }
                                      onBlur={() => setEditingNatureCell(null)}
                                      rows={4}
                                      className="min-h-0 resize-none border border-gray-300 text-xs py-1 px-2 focus-visible:ring-1"
                                      autoFocus
                                      placeholder="Service description"
                                    />
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setEditingNatureCell(`2-${i}`)}
                                      className="w-full text-left rounded border border-transparent hover:border-gray-300 py-1 px-2 min-h-[2.5rem]"
                                    >
                                      <span className="line-clamp-4 text-gray-900 block">
                                        {row.description || 'Click to edit'}
                                      </span>
                                    </button>
                                  )}
                                </td>
                                <td className="px-2 py-1.5">
                                  <Input
                                    value={row.oneOff}
                                    onChange={(e) =>
                                      setVasPart2((prev) => {
                                        const next = [...prev]
                                        next[i] = { ...next[i], oneOff: e.target.value }
                                        return next
                                      })
                                    }
                                    className="border border-gray-300 text-xs h-7 px-2"
                                    placeholder="e.g. No charge"
                                  />
                                </td>
                                <td className="px-2 py-1.5">
                                  <Input
                                    value={row.recurring}
                                    onChange={(e) =>
                                      setVasPart2((prev) => {
                                        const next = [...prev]
                                        next[i] = { ...next[i], recurring: e.target.value }
                                        return next
                                      })
                                    }
                                    className="border border-gray-300 text-xs h-7 px-2"
                                    placeholder="e.g. -"
                                  />
                                </td>
                                <td className="px-2 py-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setVasPart2((prev) => prev.filter((_, idx) => idx !== i))}
                                    className="text-gray-500 hover:text-black"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-1.5 border-gray-300 text-black hover:bg-gray-50 text-xs h-7"
                      onClick={() => setVasPart2((prev) => [...prev, { description: '', oneOff: '', recurring: '' }])}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add row
                    </Button>
                  </div>

                  {/* Part 3 */}
                  <div>
                    <h4 className="text-sm font-semibold text-black mb-2">Going above and beyond</h4>
                    <div className="overflow-x-auto rounded border border-gray-200">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-2 py-1.5 text-left font-medium text-black">Nature of service</th>
                            <th className="px-2 py-1.5 text-left font-medium text-black w-20">Statutory Audit</th>
                            <th className="px-2 py-1.5 text-left font-medium text-black w-20">In.Corp Value Add</th>
                            <th className="px-2 py-1.5 w-8" />
                          </tr>
                        </thead>
                        <tbody>
                          {vasPart3.map((row, i) => (
                            <tr key={i} className="border-b border-gray-100 last:border-0">
                              <td className="px-2 py-1.5 align-top min-w-[200px]">
                                {editingNatureCell === `3-${i}` ? (
                                  <Textarea
                                    value={row.natureOfService}
                                    onChange={(e) =>
                                      setVasPart3((prev) => {
                                        const next = [...prev]
                                        next[i] = { ...next[i], natureOfService: e.target.value }
                                        return next
                                      })
                                    }
                                    onBlur={() => setEditingNatureCell(null)}
                                    rows={4}
                                    className="min-h-0 resize-none border border-gray-300 text-xs py-1 px-2 focus-visible:ring-1"
                                    autoFocus
                                  />
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setEditingNatureCell(`3-${i}`)}
                                    className="w-full text-left rounded border border-transparent hover:border-gray-300 py-1 px-2 min-h-[2.5rem]"
                                  >
                                    <span className="line-clamp-4 text-gray-900 block">
                                      {row.natureOfService || 'Click to edit'}
                                    </span>
                                  </button>
                                )}
                              </td>
                              <td className="px-2 py-1.5">
                                <select
                                  value={row.statutoryAudit ? 'Yes' : 'No'}
                                  onChange={(e) =>
                                    setVasPart3((prev) => {
                                      const next = [...prev]
                                      next[i] = { ...next[i], statutoryAudit: e.target.value === 'Yes' }
                                      return next
                                    })
                                  }
                                  className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs text-black h-7 w-full"
                                >
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </td>
                              <td className="px-2 py-1.5">
                                <select
                                  value={row.valueAdd ? 'Yes' : 'No'}
                                  onChange={(e) =>
                                    setVasPart3((prev) => {
                                      const next = [...prev]
                                      next[i] = { ...next[i], valueAdd: e.target.value === 'Yes' }
                                      return next
                                    })
                                  }
                                  className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs text-black h-7 w-full"
                                >
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </td>
                              <td className="px-2 py-1.5">
                                <button
                                  type="button"
                                  onClick={() => setVasPart3((prev) => prev.filter((_, idx) => idx !== i))}
                                  className="text-gray-500 hover:text-black"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-1.5 border-gray-300 text-black hover:bg-gray-50 text-xs h-7"
                      onClick={() =>
                        setVasPart3((prev) => [...prev, { natureOfService: '', statutoryAudit: true, valueAdd: true }])
                      }
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add row
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Our team */}
          <Collapsible open={openSections.ourTeam} onOpenChange={() => toggleSection('ourTeam')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-sm font-medium text-black">Our team</span>
                </div>
                <span className="text-xs text-gray-500">Not Ready</span>
              </CollapsibleTrigger>
            </div>
          </Collapsible>

          {/* Relevant Industry experience */}
          <Collapsible open={openSections.industryExperience} onOpenChange={() => toggleSection('industryExperience')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-sm font-medium text-black">Relevant Industry experience</span>
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
        </div>
      </div>
    </div>
  )
}
