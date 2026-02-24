/**
 * Centralised dummy data per chat history.
 * One entry per chat; add or edit fields to change what loads when opening that chat.
 */

export type DealInfo = {
  dealName: string
  pipeline: string
  contactPerson: string
  contactEmail: string
  contactTitle?: string
  companyName?: string
  companyShortName?: string
  companyAddress?: string
  /**
   * Optional key used to pull dummy Our Team / Experience data from CHAT_DUMMY_DATA.
   * Defaults back to dealName when not provided.
   */
  dummyKey?: string
}

export type CustomServiceRow = {
  description: string
  oneOff: string
  recurring: string
}

/** Team member without id (id is added when applying to state). */
export type TeamMemberDummy = {
  name: string
  position: string
  phone: string
  email: string
  bio: string
  isPartner?: boolean
}

/** Experience row without id (id is added when applying). */
export type ExperienceDummy = {
  companyName: string
}

export type ChatDummyData = {
  dealInfo?: DealInfo
  feeProposal?: CustomServiceRow[]
  ourTeam?: TeamMemberDummy[]
  experience?: ExperienceDummy[]
}

const CHAT_DUMMY_DATA: Record<string, ChatDummyData> = {
  // —— KenYu (audit) chats ——
  'Parable Church Ltd - Audit Proposal': {
    dealInfo: {
      dealName: 'Parable Church Ltd - Audit Proposal',
      pipeline: 'Audit',
      contactPerson: 'Sarah Chen',
      contactEmail: 'sarah.chen@parablechurch.org',
      contactTitle: 'Finance Director',
      companyName: 'Parable Church Ltd',
      companyShortName: 'PCL',
      companyAddress: '12 Worship Lane, Sydney NSW 2000',
    },
  },
  'Janus Electric Limited': {
    dealInfo: {
      dealName: 'Janus Electric Limited',
      pipeline: 'Audit',
      contactPerson: 'James Wong',
      contactEmail: 'j.wong@januselectric.com.au',
      contactTitle: 'CFO',
      companyName: 'Janus Electric Limited',
      companyShortName: 'JAN',
      companyAddress: '45 Power Road, Melbourne VIC 3000',
    },
    feeProposal: [
      { description: 'Year-end audit of financial report - 30 June 2026', oneOff: '65,000', recurring: '' },
      { description: 'Review of half-year financial report - 31 December 2026', oneOff: '30,000', recurring: '' },
    ],
  },
  'Viridis Green Data Centres Limited': {
    dealInfo: {
      dealName: 'Viridis Green Data Centres Limited',
      pipeline: 'Audit',
      contactPerson: 'Emma Liu',
      contactEmail: 'emma.liu@viridisgreen.com',
      contactTitle: 'Head of Finance',
      companyName: 'Viridis Green Data Centres Limited',
      companyShortName: 'VGDC',
      companyAddress: '88 Green Tech Park, Brisbane QLD 4000',
    },
  },
  'Omni Tanker Holdings Ltd': {
    dealInfo: {
      dealName: 'Omni Tanker Holdings Ltd',
      pipeline: 'Audit',
      contactPerson: 'Michael Brown',
      contactEmail: 'm.brown@omnitanker.com',
      contactTitle: 'Finance Manager',
      companyName: 'Omni Tanker Holdings Ltd',
      companyShortName: 'OTH',
      companyAddress: '200 Harbour Drive, Perth WA 6000',
    },
    feeProposal: [
      { description: 'Year-end audit of statutory financial report', oneOff: '37,000', recurring: '' },
      { description: 'Assistance with preparation of financial report', oneOff: '3,000', recurring: '' },
      { description: 'Income tax return including assistance with preparation of deferred tax balances', oneOff: '10,000', recurring: '' },
    ],
    ourTeam: [
      {
        name: 'Daniel Dalla',
        position: 'Engagement Partner, Assurance',
        phone: '+61 2 8999 1199',
        email: 'Daniel.Dalla@InCorpadvisory.au',
        bio: 'Daniel has over 24 years of experience in Audit, Assurance, and Corporate Advisory, with 15 years spent at Deloitte and HLB Mann Judd. He specialises in manufacturing, technology, building and construction, retail, financial services, mining, and exploration. Daniel is responsible for audits of multiple ASX listed entities and assists clients with ASX listing preparations. He was appointed Partner at In.Corp in November 2016 and is a Registered Company Auditor and a CA Business Valuation Specialist.',
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
        bio: "James is a Chartered Accountant with a Bachelor of Business and Bachelor of Laws from the University of Technology Sydney. He has over 6 years with the In.Corp team and experience across financial and brokerage services, transport and logistics, ASX listed clients, mining and exploration, technology and communications, private education and not-for-profits. He leads In.Corp's real estate trust audit portfolio.",
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
    ],
  },
  'Supa Technologies Audit': {
    dealInfo: {
      dealName: 'Supa Technologies Audit',
      pipeline: 'Audit',
      contactPerson: 'Alex Rivera',
      contactEmail: 'alex.rivera@supatech.io',
      contactTitle: 'COO',
      companyName: 'Supa Technologies Pty Ltd',
      companyShortName: 'SUPA',
      companyAddress: 'Level 5, 100 Innovation Way, Sydney NSW 2000',
    },
    feeProposal: [
      { description: 'Year-end audit of financial report – 30 June 2025', oneOff: '20,000', recurring: '' },
      {
        description: 'Assistance with preparation of the general purpose – simplified disclosures financial report',
        oneOff: '3,000',
        recurring: '',
      },
    ],
    ourTeam: [
      {
        name: 'Daniel Dalla',
        position: 'Engagement Partner, Assurance',
        phone: '+61 2 8999 1199',
        email: 'Daniel.Dalla@InCorpadvisory.au',
        bio: 'Daniel has over 24 years of experience in Audit, Assurance, and Corporate Advisory, with 15 years spent at Deloitte and HLB Mann Judd. He specialises in manufacturing, technology, building and construction, retail, financial services, mining, and exploration. Daniel is responsible for audits of multiple ASX listed entities and assists clients with ASX listing preparations. He was appointed Partner at In.Corp in November 2016 and is a Registered Company Auditor and a CA Business Valuation Specialist.',
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
        bio: "James is a Chartered Accountant with a Bachelor of Business and Bachelor of Laws from the University of Technology Sydney. He has over 6 years with the In.Corp team and experience across financial and brokerage services, transport and logistics, ASX listed clients, mining and exploration, technology and communications, private education and not-for-profits. He leads In.Corp's real estate trust audit portfolio.",
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
    ],
    experience: [
      { companyName: 'Deicorp Property Group Pty Ltd' },
      { companyName: 'Jennchem Australia Pty Ltd' },
      { companyName: 'Rocbolt Resins Pty Ltd' },
      { companyName: 'Solar Mining Services Pty Ltd' },
      { companyName: 'Lithium Energy Ltd' },
      { companyName: 'Northbridge Network Systems Pty Ltd' },
      { companyName: 'COSCO Shipping (Oceania) Pty Ltd' },
      { companyName: 'EZZ Life Science Holdings Limited' },
      { companyName: 'BluGlass Limited' },
      { companyName: 'Sungrow Power Australia Pty Ltd' },
      { companyName: 'Leda Group' },
      { companyName: 'E Karras Refrigerated Transport Pty Ltd' },
    ],
  },

  // —— Huiman (standard) chats ——
  'Roland Berger': {},
  'Quotation_Truthkeep': {},
  'JL Oceania Pty Ltd': {},
  'Nicholas Vrarnas': {},
  'Craziest Story Pty Ltd & Not Just Another Pty Ltd': {},
}

export function getDealInfo(chatName: string): DealInfo | undefined {
  return CHAT_DUMMY_DATA[chatName]?.dealInfo
}

export function getFeeProposal(chatName: string): CustomServiceRow[] | undefined {
  return CHAT_DUMMY_DATA[chatName]?.feeProposal
}

export function getOurTeam(chatName: string): TeamMemberDummy[] | undefined {
  return CHAT_DUMMY_DATA[chatName]?.ourTeam
}

export function getExperience(chatName: string): ExperienceDummy[] | undefined {
  return CHAT_DUMMY_DATA[chatName]?.experience
}

export function buildInitialDealInfoByChat(
  chatList: readonly string[]
): Record<string, DealInfo> {
  const next: Record<string, DealInfo> = {}
  chatList.forEach((name) => {
    const info = getDealInfo(name)
    if (info) next[name] = info
  })
  return next
}

export function buildInitialCustomServicesByChat(
  chatList: readonly string[]
): Record<string, CustomServiceRow[]> {
  const next: Record<string, CustomServiceRow[]> = {}
  chatList.forEach((name) => {
    const rows = getFeeProposal(name)
    if (rows && rows.length > 0) next[name] = [...rows]
  })
  return next
}
