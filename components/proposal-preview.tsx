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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { DynamicTableBuilder } from '@/components/dynamic-table-builder'

interface ProposalPreviewProps {
  dealInfo: {
    dealName: string
    pipeline: string
    contactPerson: string
    contactEmail: string
    contactTitle?: string
    companyName?: string
    companyShortName?: string
    companyAddress?: string
  } | null
  customServices?: Array<{ description: string; oneOff: string; recurring: string }>
  onCustomServicesChange?: (next: Array<{ description: string; oneOff: string; recurring: string }> | ((prev: Array<{ description: string; oneOff: string; recurring: string }>) => Array<{ description: string; oneOff: string; recurring: string }>)) => void
}

export function ProposalPreview({ dealInfo, customServices, onCustomServicesChange }: ProposalPreviewProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    client: true,
    executive: true,
    solution: false,
    ourTeam: false,
    industryExperience: false,
    timeline: false,
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
    contactTitle: dealInfo?.contactTitle ?? '',
    companyName: dealInfo?.companyName ?? '',
    companyShortName: dealInfo?.companyShortName ?? '',
    companyAddress: dealInfo?.companyAddress ?? '',
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
  const [internalVasPart2, setInternalVasPart2] = useState<Array<{ description: string; oneOff: string; recurring: string }>>([])
  const vasPart2 = onCustomServicesChange != null && customServices != null ? customServices : internalVasPart2
  const setVasPart2 = onCustomServicesChange != null && customServices != null ? onCustomServicesChange : setInternalVasPart2
  const [vasPart3, setVasPart3] = useState<
    Array<{ natureOfService: string; statutoryAudit: boolean; valueAdd: boolean }>
  >(defaultVasPart3)
  const [editingNatureCell, setEditingNatureCell] = useState<string | null>(null)

  const [vasPart1Description, setVasPart1Description] = useState(
    'Our fees are highly competitive without comprising quality while delivering value add to your business.\n\nWe have the resources and experience in deadline management to ensure that we complete our assignments on time and delivering it to our clients at a quality that they would expect. This is primarily attributable to our approach of ensuring partner participation and oversight throughout the process.\n\nIn order to provide a smooth transition, we propose to provide the following at no charge as a gesture of goodwill in demonstrating our commitment to building a long-term mutually rewarding business relationship with Viridis:'
  )
  const [vasPart2Description, setVasPart2Description] = useState(
    'We are committed to providing you with a high-quality service in a cost effective and transparent manner. To provide you with certainty on your future costs we have provided our fee estimate for the requested periods as follows:'
  )
  const [vasPart2Footnotes, setVasPart2Footnotes] = useState(
    '1. The above amount is exclusive of GST and disbursements.\n\n2. Our fee for the professional services assume no significant changes to the operations of the business from that advised up to the date of this proposal and allows for time costs to perform audit procedures and consideration of accounting issues that may arise. If there is any indication that our fees may exceed the amount detailed, we will discuss the cause and potential additional fees with you to determine actions to minimise their impact.'
  )
  const [vasPart3Description, setVasPart3Description] = useState(
    'The following table demonstrates what services normally comprise a statutory audit and value-added services that In.Corp will provide as part of our ongoing commitment to the directors and management of Viridis.'
  )

  type TeamMember = {
    id: string
    name: string
    position: string
    phone: string
    email: string
    bio: string
    isPartner?: boolean
  }
  const defaultTeamMembers: TeamMember[] = [
    {
      id: 'partner-1',
      name: 'Daniel Dalla',
      position: 'Audit Engagement Partner',
      phone: '+61 2 8999 1199',
      email: 'Daniel.Dalla@incorpadvisory.au',
      bio: 'Daniel has over 20 years of experience in Audit, Assurance and Corporate Advisory. He spent 15 years at Deloitte and HLB Mann Judd with broad client and industry exposure. He specialises in financial services, fund management, retail, technology, private equity, mining, exploration, building and construction, and has responsibility for ASX listed entities. Daniel was appointed Partner at In.Corp in November 2016.',
      isPartner: true,
    },
    {
      id: 'partner-2',
      name: 'Graham Webb',
      position: 'Audit Quality Review Partner',
      phone: '+61 2 8999 1199',
      email: 'Graham.Webb@incorpadvisory.au',
      bio: 'Graham has over 20 years of experience as a registered company auditor. He was a partner at Hall Chadwick for 13 years before joining In.Corp in 2022. His experience includes ASX listed entities, private and public companies, AFSL entities and not-for-profit entities across financial services, retail, manufacturing, technology, mining and exploration. He is known for his professionalism and communication skills.',
      isPartner: true,
    },
  ]
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers)
  const [ourTeamTitle, setOurTeamTitle] = useState('OUR CLIENT SERVICE TEAM')
  const [ourTeamDescription, setOurTeamDescription] = useState(
    'Our team has the experience and capability to meet your requirements. Our engagements are directed and conducted by senior qualified professional staff.'
  )
  const [ourTeamFootnotes, setOurTeamFootnotes] = useState('')
  const [industryTitle, setIndustryTitle] = useState('RELEVANT INDUSTRY EXPERIENCE')
  const [industryDescription, setIndustryDescription] = useState(
    'We have considerable experience in providing external audits and other professional services to public and private companies across a range of sectors. Representative clients include:'
  )
  const [industryFootnotes, setIndustryFootnotes] = useState('')
  const [industryCredentials, setIndustryCredentials] = useState<Array<{ id: string; companyName: string; industry?: string }>>([])
  type IndustryLibraryItem = { industry: string; companyName: string }
  const industryLibrary: IndustryLibraryItem[] = [
    { industry: 'Construction', companyName: 'Deicorp Property Group Pty Ltd' },
    { industry: 'Financial services', companyName: 'WT Financial Group Limited' },
    { industry: 'Manufacturing', companyName: 'Jennchem Australia Pty Ltd' },
    { industry: 'Financial services', companyName: 'Scalare Partners Holdings Limited' },
    { industry: 'Mining & energy', companyName: 'Lithium Energy Ltd' },
    { industry: 'Technology', companyName: 'Northbridge Network Systems Pty Ltd' },
    { industry: 'Logistics', companyName: 'COSCO Shipping (Oceania) Pty Ltd' },
    { industry: 'Life science', companyName: 'EZZ Life Science Holdings Limited' },
    { industry: 'Technology', companyName: 'BluGlass Limited' },
    { industry: 'Energy', companyName: 'Sungrow Power Australia Pty Ltd' },
    { industry: 'Construction', companyName: 'Leda Group' },
    { industry: 'Energy', companyName: 'United H2 Hydrogen Limited' },
  ]
  const INDUSTRY_CREDENTIAL_MAX = 12
  const [industryLibrarySelected, setIndustryLibrarySelected] = useState<number[]>([])
  const [industryLibraryMessage, setIndustryLibraryMessage] = useState<string | null>(null)
  const [industryLibraryFilter, setIndustryLibraryFilter] = useState<string>('')
  const [industryLibrarySortBy, setIndustryLibrarySortBy] = useState<'industry' | 'company' | null>(null)
  const [industryLibrarySortDir, setIndustryLibrarySortDir] = useState<'asc' | 'desc'>('asc')
  const industryLibraryUniqueIndustries = [...new Set(industryLibrary.map((i) => i.industry))].sort()
  const industryLibraryFilteredAndSorted = (() => {
    let list = industryLibrary.map((item, originalIdx) => ({ item, originalIdx }))
    if (industryLibraryFilter) {
      list = list.filter(({ item }) => item.industry === industryLibraryFilter)
    }
    if (industryLibrarySortBy) {
      list = [...list].sort((a, b) => {
        const va = industryLibrarySortBy === 'industry' ? a.item.industry : a.item.companyName
        const vb = industryLibrarySortBy === 'industry' ? b.item.industry : b.item.companyName
        const c = va.localeCompare(vb, undefined, { sensitivity: 'base' })
        return industryLibrarySortDir === 'asc' ? c : -c
      })
    }
    return list
  })()
  const toggleIndustryLibrarySelected = (idx: number) => {
    setIndustryLibrarySelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }
  const addIndustryCredentialsFromLibraryBatch = () => {
    const remaining = INDUSTRY_CREDENTIAL_MAX - industryCredentials.length
    if (remaining <= 0) {
      setIndustryLibraryMessage('Maximum 12 credentials. No slots left.')
      return
    }
    const indices = [...industryLibrarySelected].sort((a, b) => a - b)
    const toAdd = indices
      .map((i) => industryLibrary[i])
      .filter(Boolean)
      .slice(0, remaining)
    if (toAdd.length === 0) {
      setIndustryLibrarySelected([])
      return
    }
    setIndustryCredentials((prev) => [
      ...prev,
      ...toAdd.map((item) => ({
        id: `cred-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        companyName: item.companyName,
        industry: item.industry,
      })),
    ])
    setIndustryLibrarySelected([])
    if (indices.length > remaining) {
      setIndustryLibraryMessage(`Maximum 12 credentials. ${toAdd.length} added this time.`)
    } else {
      setIndustryLibraryMessage(null)
    }
  }
  const addIndustryCredentialBlank = () => {
    if (industryCredentials.length >= INDUSTRY_CREDENTIAL_MAX) {
      setIndustryLibraryMessage('Maximum 12 credentials. No slots left.')
      return
    }
    setIndustryCredentials((prev) => [
      ...prev,
      { id: `cred-${Date.now()}`, companyName: '' },
    ])
  }
  const removeIndustryCredential = (id: string) => {
    setIndustryCredentials((prev) => prev.filter((c) => c.id !== id))
  }
  const updateIndustryCredential = (id: string, companyName: string) => {
    setIndustryCredentials((prev) =>
      prev.map((c) => (c.id === id ? { ...c, companyName } : c))
    )
  }

  const defaultTimelineTableData: string[][] = [
    ['Nature of Service', 'Timing'],
    ['Transition', ''],
    ['Confirmation of appointment as auditors', ''],
    ['Review of opening balances', ''],
    ['Year-End Audit', ''],
    ['Initial meeting between In.Corp and management to plan the audit for the year-ended 30 June 2026', ''],
    ['In.Corp to perform interim audit procedures on profit & loss balances', ''],
    ['In.Corp to commence year-end audit procedures', ''],
    ['Sign-off on year-end financial report', ''],
  ]
  const [timelineTitle, setTimelineTitle] = useState('TIMELINE')
  const [timelineDescription, setTimelineDescription] = useState(
    'With our proven track record, we will manage the audit process with the least possible disruption to your business, ensuring key deadlines are met.\n\nThe table below provides an indication of our anticipated timeline'
  )
  const [timelineFootnotes, setTimelineFootnotes] = useState('')
  const [timelineTableData, setTimelineTableData] = useState<string[][]>(defaultTimelineTableData)

  const [teamBioImproveId, setTeamBioImproveId] = useState<string | null>(null)
  const [teamBioAiResult, setTeamBioAiResult] = useState<string | null>(null)
  const [teamBioAiPrompt, setTeamBioAiPrompt] = useState('')

  type TeamLibraryItem = Omit<TeamMember, 'id'>
  const teamLibrary: TeamLibraryItem[] = [
    {
      name: 'Daniel Dalla',
      position: 'Audit Engagement Partner',
      phone: '+61 2 8999 1199',
      email: 'Daniel.Dalla@incorpadvisory.au',
      bio: 'Daniel has over 20 years of experience in Audit, Assurance and Corporate Advisory. He spent 15 years at Deloitte and HLB Mann Judd with broad client and industry exposure. He specialises in financial services, fund management, retail, technology, private equity, mining, exploration, building and construction, and has responsibility for ASX listed entities. Daniel was appointed Partner at In.Corp in November 2016.',
      isPartner: true,
    },
    {
      name: 'Graham Webb',
      position: 'Audit Quality Review Partner',
      phone: '+61 2 8999 1199',
      email: 'Graham.Webb@incorpadvisory.au',
      bio: 'Graham has over 20 years of experience as a registered company auditor. He was a partner at Hall Chadwick for 13 years before joining In.Corp in 2022. His experience includes ASX listed entities, private and public companies, AFSL entities and not-for-profit entities across financial services, retail, manufacturing, technology, mining and exploration. He is known for his professionalism and communication skills.',
      isPartner: true,
    },
    {
      name: 'James Saab',
      position: 'Manager, Assurance',
      phone: '+61 2 8999 1199',
      email: 'James.Saab@incorpadvisory.au',
      bio: 'James is a Chartered Accountant with a Bachelor of Business and Bachelor of Laws from the University of Technology Sydney. He has over 6 years with the In.Corp team and experience across financial and brokerage services, transport and logistics, ASX listed clients, mining and exploration, technology and communications, private education and not-for-profits. He leads In.Corp\'s real estate trust audit portfolio.',
      isPartner: false,
    },
    {
      name: 'Stella Wongso',
      position: 'Manager, Assurance',
      phone: '+61 2 8999 1199',
      email: 'Stella.Wongso@incorpadvisory.au',
      bio: 'Stella studied in Bandung, Indonesia and holds a Bachelor of Commerce from the University of New South Wales. She is a Chartered Accountant and joined In.Corp in 2019. Her experience includes financial services, health and beauty, retailing, technology, building and construction, transport and logistics, and ASX listed mining and exploration companies. She has prior volunteer work and experience in restaurant and printing businesses.',
      isPartner: false,
    },
  ]

  const addTeamMember = () => {
    setTeamMembers((prev) => [
      ...prev,
      {
        id: `member-${Date.now()}`,
        name: '',
        position: '',
        phone: '',
        email: '',
        bio: '',
        isPartner: false,
      },
    ])
  }
  const addTeamMemberFromLibrary = (item: TeamLibraryItem) => {
    setTeamMembers((prev) => [
      ...prev,
      {
        ...item,
        id: `member-${Date.now()}`,
      },
    ])
  }
  const removeTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id))
    if (teamBioImproveId === id) {
      setTeamBioImproveId(null)
      setTeamBioAiResult(null)
      setTeamBioAiPrompt('')
    }
  }
  const updateTeamMember = (id: string, field: keyof TeamMember, value: string | boolean) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }
  const createTeamBioSuggestion = () => {
    setTeamBioAiResult(
      'Our team member brings extensive experience and a commitment to delivering high-quality client service. They work closely with clients to understand their needs and provide tailored solutions.'
    )
  }
  const replaceTeamBioWithSuggestion = (id: string) => {
    if (teamBioAiResult) {
      updateTeamMember(id, 'bio', teamBioAiResult)
      setTeamBioAiResult(null)
      setTeamBioAiPrompt('')
      setTeamBioImproveId(null)
    }
  }
  const closeTeamBioImprove = () => {
    setTeamBioImproveId(null)
    setTeamBioAiResult(null)
    setTeamBioAiPrompt('')
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const vasReady = vasPart2.some(
    (row) => row.description.trim() !== '' || row.oneOff.trim() !== '' || row.recurring.trim() !== ''
  )
  const ourTeamReady = teamMembers.length >= 4
  const experienceReady = industryCredentials.length >= 1
  const timelineReady =
    timelineTableData.length > 1 &&
    timelineTableData.some((row, i) => i >= 1 && row[1] != null && String(row[1]).trim() !== '')

  const startClientEdit = () => {
    setClientForm({
      contactName: dealInfo?.contactPerson ?? 'abc',
      contactEmail: dealInfo?.contactEmail ?? 'abc@abc.com',
      contactTitle: dealInfo?.contactTitle ?? clientForm.contactTitle ?? '',
      companyName: dealInfo?.companyName ?? clientForm.companyName ?? '',
      companyShortName: clientForm.companyShortName ?? dealInfo?.companyShortName ?? '',
      companyAddress: clientForm.companyAddress ?? dealInfo?.companyAddress ?? '',
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
      contactTitle: dealInfo?.contactTitle ?? '',
      companyName: dealInfo?.companyName ?? '',
      companyShortName: dealInfo?.companyShortName ?? '',
      companyAddress: dealInfo?.companyAddress ?? '',
    })
    setIsClientEditing(false)
  }

  useEffect(() => {
    if (!isClientEditing && dealInfo) {
      setClientForm({
        contactName: dealInfo.contactPerson ?? 'abc',
        contactEmail: dealInfo.contactEmail ?? 'abc@abc.com',
        contactTitle: dealInfo.contactTitle ?? '',
        companyName: dealInfo.companyName ?? '',
        companyShortName: dealInfo.companyShortName ?? '',
        companyAddress: dealInfo.companyAddress ?? '',
      })
    }
  }, [dealInfo, isClientEditing])

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
                {!vasReady && <span className="text-xs text-gray-500">Not Ready</span>}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-gray-100 px-4 py-4 space-y-5">
                  {/* Part 1 */}
                  <div>
                    <h4 className="text-sm font-semibold text-black mb-2">Value added at no charge</h4>
                    <div className="mb-3">
                      <label className="mb-1.5 block text-xs font-normal text-gray-600">Description (Optional)</label>
                      <Textarea
                        rows={4}
                        value={vasPart1Description}
                        onChange={(e) => setVasPart1Description(e.target.value)}
                        placeholder="Description..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y min-h-0"
                      />
                    </div>
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
                    <h4 className="text-sm font-semibold text-black mb-2">FEE PROPOSAL</h4>
                    <div className="mb-3">
                      <label className="mb-1.5 block text-xs font-normal text-gray-600">Description (Optional)</label>
                      <Textarea
                        rows={2}
                        value={vasPart2Description}
                        onChange={(e) => setVasPart2Description(e.target.value)}
                        placeholder="Description..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y min-h-0"
                      />
                    </div>
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
                    <div className="mt-3">
                      <label className="mb-1.5 block text-xs font-normal text-gray-600">Footnotes (Optional)</label>
                      <Textarea
                        rows={4}
                        value={vasPart2Footnotes}
                        onChange={(e) => setVasPart2Footnotes(e.target.value)}
                        placeholder="Footnotes..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y min-h-0"
                      />
                    </div>
                  </div>

                  {/* Part 3 */}
                  <div>
                    <h4 className="text-sm font-semibold text-black mb-2">Going above and beyond</h4>
                    <div className="mb-3">
                      <label className="mb-1.5 block text-xs font-normal text-gray-600">Description (Optional)</label>
                      <Textarea
                        rows={2}
                        value={vasPart3Description}
                        onChange={(e) => setVasPart3Description(e.target.value)}
                        placeholder="Description..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y min-h-0"
                      />
                    </div>
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
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      !openSections.ourTeam && '-rotate-90'
                    )}
                  />
                  <span className="text-sm font-medium text-black">Our team</span>
                </div>
                {!ourTeamReady && <span className="text-xs text-gray-500">Not Ready</span>}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-gray-100 px-4 py-4">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-normal text-black">
                        Title <span className="text-gray-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={ourTeamTitle}
                        onChange={(e) => setOurTeamTitle(e.target.value)}
                        placeholder="Please enter..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-normal text-black">
                        Description (Optional)
                      </label>
                      <Textarea
                        rows={2}
                        value={ourTeamDescription}
                        onChange={(e) => setOurTeamDescription(e.target.value)}
                        placeholder="Please enter..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y min-h-0"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 mt-4">
                    Maintain portrait, name, position, contact and bio (80–150 words). Partners support AI Improve for bio.
                  </p>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-2">
                          <div className="h-8 w-8 shrink-0 rounded bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-500">
                            {member.name
                              ? member.name.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase()
                              : '—'}
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex gap-2 items-center flex-wrap">
                              <Input
                                value={member.name}
                                onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                                placeholder="Name"
                                className="border-gray-300 text-xs h-7 w-36"
                              />
                              <Input
                                value={member.position}
                                onChange={(e) => updateTeamMember(member.id, 'position', e.target.value)}
                                placeholder="Position"
                                className="border-gray-300 text-xs h-7 flex-1 min-w-[120px]"
                              />
                              {teamMembers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTeamMember(member.id)}
                                  className="text-gray-500 hover:text-black shrink-0"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Input
                                value={member.phone}
                                onChange={(e) => updateTeamMember(member.id, 'phone', e.target.value)}
                                placeholder="Phone"
                                className="border-gray-300 text-xs h-7 w-32"
                              />
                              <Input
                                type="email"
                                value={member.email}
                                onChange={(e) => updateTeamMember(member.id, 'email', e.target.value)}
                                placeholder="Email"
                                className="border-gray-300 text-xs h-7 flex-1 min-w-[160px]"
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <label className="text-xs text-gray-600">Bio (80–150 words)</label>
                                {member.isPartner && (
                                  <button
                                    type="button"
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-black"
                                    onClick={() => {
                                      setTeamBioImproveId(member.id)
                                      setTeamBioAiResult(null)
                                      setTeamBioAiPrompt('')
                                    }}
                                  >
                                    <Sparkles className="h-3 w-3" />
                                    AI Improve
                                  </button>
                                )}
                              </div>
                              <Textarea
                                value={member.bio}
                                onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)}
                                rows={3}
                                className="min-h-0 resize-none border border-gray-300 text-xs"
                                placeholder="80–150 words"
                              />
                              {teamBioImproveId === member.id && (
                                <div className="mt-2 rounded border border-gray-200 bg-gray-50 px-2 py-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-black">AI Improve</span>
                                    <button type="button" className="text-xs text-gray-500 hover:text-gray-700" onClick={closeTeamBioImprove}>
                                      Close
                                    </button>
                                  </div>
                                  {teamBioAiResult ? (
                                    <div className="space-y-1.5">
                                      <p className="text-xs text-gray-900 whitespace-pre-wrap line-clamp-4">{teamBioAiResult}</p>
                                      <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white text-xs h-6" onClick={() => replaceTeamBioWithSuggestion(member.id)}>
                                        Replace
                                      </Button>
                                      <div className="flex gap-2">
                                        <Input
                                          value={teamBioAiPrompt}
                                          onChange={(e) => setTeamBioAiPrompt(e.target.value)}
                                          placeholder="e.g. shorten to 80 words"
                                          className="flex-1 border-gray-300 text-xs h-6"
                                        />
                                        <Button size="sm" className="shrink-0 bg-gray-600 hover:bg-gray-700 text-white text-xs h-6" onClick={createTeamBioSuggestion}>
                                          Update
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex gap-2">
                                      <Input
                                        value={teamBioAiPrompt}
                                        onChange={(e) => setTeamBioAiPrompt(e.target.value)}
                                        placeholder="e.g. shorten to 80 words"
                                        className="flex-1 border-gray-300 text-xs h-6"
                                      />
                                      <Button size="sm" className="shrink-0 bg-gray-600 hover:bg-gray-700 text-white text-xs h-6" onClick={createTeamBioSuggestion}>
                                        Create
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3 border-gray-300 text-black hover:bg-gray-50 text-xs h-7"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add team member
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[200px]">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="text-xs">
                          From library
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {teamLibrary.map((item, idx) => (
                            <DropdownMenuItem
                              key={idx}
                              className="text-xs"
                              onSelect={() => addTeamMemberFromLibrary(item)}
                            >
                              <span className="truncate" title={`${item.name} – ${item.position}`}>
                                {item.name} · {item.position}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuItem
                        className="text-xs"
                        onSelect={addTeamMember}
                      >
                        Add blank (free fill-in)
                      </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="mb-2 block text-sm font-normal text-black">
                      Footnotes (Optional)
                    </label>
                    <input
                      type="text"
                      value={ourTeamFootnotes}
                      onChange={(e) => setOurTeamFootnotes(e.target.value)}
                      placeholder="Please enter..."
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Relevant Industry experience */}
          <Collapsible open={openSections.industryExperience} onOpenChange={() => toggleSection('industryExperience')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      !openSections.industryExperience && '-rotate-90'
                    )}
                  />
                  <span className="text-sm font-medium text-black">Relevant Industry experience</span>
                </div>
                {!experienceReady && <span className="text-xs text-gray-500">Not Ready</span>}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-gray-100 px-4 py-4">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-normal text-black">
                        Title <span className="text-gray-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={industryTitle}
                        onChange={(e) => setIndustryTitle(e.target.value)}
                        placeholder="Please enter..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-normal text-black">
                        Description (Optional)
                      </label>
                      <Textarea
                        rows={2}
                        value={industryDescription}
                        onChange={(e) => setIndustryDescription(e.target.value)}
                        placeholder="Please enter..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y min-h-0"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <DynamicTableBuilder
                      value={[['Credentials'], ...industryCredentials.map((c) => [c.companyName])]}
                      onChange={(data) => {
                        if (data.length <= 1) {
                          setIndustryCredentials([])
                        } else {
                          setIndustryCredentials(
                            data.slice(1).map((row, i) => ({
                              id: industryCredentials[i]?.id ?? `cred-${Date.now()}-${i}`,
                              companyName: row[0] ?? '',
                              industry: industryCredentials[i]?.industry,
                            }))
                          )
                        }
                      }}
                      firstRowIsHeader
                      customAddContent={
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-1 border-gray-300 text-black hover:bg-gray-50 text-xs h-7"
                            >
                              <Plus className="h-3 w-3" />
                              Add credential
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="min-w-[220px]">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="text-xs">
                                From team library
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="max-h-[380px] overflow-hidden flex flex-col w-[320px]" sideOffset={4}>
                                <div className="p-2 border-b border-gray-100 text-xs text-gray-600">
                                  {industryCredentials.length < INDUSTRY_CREDENTIAL_MAX
                                    ? `Slots left: ${INDUSTRY_CREDENTIAL_MAX - industryCredentials.length} (max ${INDUSTRY_CREDENTIAL_MAX})`
                                    : 'Maximum 12 credentials.'}
                                </div>
                                <div className="p-2 border-b border-gray-100 flex items-center gap-2">
                                  <span className="text-xs text-gray-600 shrink-0">Filter:</span>
                                  <select
                                    value={industryLibraryFilter}
                                    onChange={(e) => setIndustryLibraryFilter(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 min-w-0 rounded border border-gray-300 px-2 py-1 text-xs bg-white text-black focus:border-gray-400 focus:outline-none"
                                  >
                                    <option value="">All industries</option>
                                    {industryLibraryUniqueIndustries.map((ind) => (
                                      <option key={ind} value={ind}>{ind}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="overflow-auto flex-1 min-h-0">
                                  <table className="w-full border-collapse text-xs">
                                    <thead>
                                      <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="w-8 py-1.5 px-1 text-left font-normal text-gray-600"> </th>
                                        <th
                                          className="py-1.5 px-2 text-left font-normal text-gray-600 cursor-pointer hover:bg-gray-100 select-none"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            if (industryLibrarySortBy === 'industry') {
                                              if (industryLibrarySortDir === 'asc') {
                                                setIndustryLibrarySortDir('desc')
                                              } else {
                                                setIndustryLibrarySortBy(null)
                                              }
                                            } else {
                                              setIndustryLibrarySortBy('industry')
                                              setIndustryLibrarySortDir('asc')
                                            }
                                          }}
                                        >
                                          Industry {industryLibrarySortBy === 'industry' ? (industryLibrarySortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                                        </th>
                                        <th
                                          className="py-1.5 px-2 text-left font-normal text-gray-600 cursor-pointer hover:bg-gray-100 select-none"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            if (industryLibrarySortBy === 'company') {
                                              if (industryLibrarySortDir === 'asc') {
                                                setIndustryLibrarySortDir('desc')
                                              } else {
                                                setIndustryLibrarySortBy(null)
                                              }
                                            } else {
                                              setIndustryLibrarySortBy('company')
                                              setIndustryLibrarySortDir('asc')
                                            }
                                          }}
                                        >
                                          Credentials {industryLibrarySortBy === 'company' ? (industryLibrarySortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {industryLibraryFilteredAndSorted.map(({ item, originalIdx }) => (
                                        <tr
                                          key={originalIdx}
                                          className="border-b border-gray-100 hover:bg-gray-50"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            if (industryCredentials.length >= INDUSTRY_CREDENTIAL_MAX && !industryLibrarySelected.includes(originalIdx)) return
                                            toggleIndustryLibrarySelected(originalIdx)
                                          }}
                                        >
                                          <td className="py-1 px-1">
                                            <input
                                              type="checkbox"
                                              checked={industryLibrarySelected.includes(originalIdx)}
                                              onChange={() => {
                                                if (industryCredentials.length >= INDUSTRY_CREDENTIAL_MAX && !industryLibrarySelected.includes(originalIdx)) return
                                                toggleIndustryLibrarySelected(originalIdx)
                                              }}
                                              onClick={(e) => e.stopPropagation()}
                                              disabled={industryCredentials.length >= INDUSTRY_CREDENTIAL_MAX && !industryLibrarySelected.includes(originalIdx)}
                                              className="rounded border-gray-300"
                                            />
                                          </td>
                                          <td className="py-1.5 px-2 text-black">{item.industry}</td>
                                          <td className="py-1.5 px-2 text-black">{item.companyName}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                {industryLibraryMessage && (
                                  <div className="px-2 py-1 text-xs text-gray-600 border-t border-gray-100">
                                    {industryLibraryMessage}
                                  </div>
                                )}
                                <div className="p-2 border-t border-gray-100">
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="w-full h-7 text-xs bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
                                    disabled={industryCredentials.length >= INDUSTRY_CREDENTIAL_MAX || industryLibrarySelected.length === 0}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      addIndustryCredentialsFromLibraryBatch()
                                    }}
                                  >
                                    Add selected ({industryLibrarySelected.length})
                                  </Button>
                                </div>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                              className="text-xs"
                              onSelect={addIndustryCredentialBlank}
                              disabled={industryCredentials.length >= INDUSTRY_CREDENTIAL_MAX}
                            >
                              Add blank (company name only)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      }
                    />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="mb-2 block text-sm font-normal text-black">
                      Footnotes (Optional)
                    </label>
                    <input
                      type="text"
                      value={industryFootnotes}
                      onChange={(e) => setIndustryFootnotes(e.target.value)}
                      placeholder="Please enter..."
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Timeline */}
          <Collapsible open={openSections.timeline} onOpenChange={() => toggleSection('timeline')}>
            <div className="group rounded-lg border border-gray-200 bg-white">
              <CollapsibleTrigger className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      !openSections.timeline && '-rotate-90'
                    )}
                  />
                  <span className="text-sm font-medium text-black">Timeline</span>
                </div>
                {!timelineReady && <span className="text-xs text-gray-500">Not Ready</span>}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-gray-100 px-4 py-4">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-normal text-black">
                        Title <span className="text-gray-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={timelineTitle}
                        onChange={(e) => setTimelineTitle(e.target.value)}
                        placeholder="Please enter..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-normal text-black">
                        Description (Optional)
                      </label>
                      <Textarea
                        rows={2}
                        value={timelineDescription}
                        onChange={(e) => setTimelineDescription(e.target.value)}
                        placeholder="Please enter..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y min-h-0"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <DynamicTableBuilder value={timelineTableData} onChange={setTimelineTableData} firstRowIsHeader />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="mb-2 block text-sm font-normal text-black">
                      Footnotes (Optional)
                    </label>
                    <input
                      type="text"
                      value={timelineFootnotes}
                      onChange={(e) => setTimelineFootnotes(e.target.value)}
                      placeholder="Please enter..."
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                </div>
              </CollapsibleContent>
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
                      <Textarea
                        rows={2}
                        placeholder="Please enter..."
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none resize-y min-h-0"
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
