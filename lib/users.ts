export type UserId = 'kenyu' | 'huiman'

export type TemplateId = 'audit' | 'standard'

export const KENYU_CHAT_LIST = [
  'Parable Church Ltd - Audit Proposal',
  'Janus Electric Limited',
  'Viridis Green Data Centres Limited',
  'Omni Tanker Holdings Ltd',
  'Supa Technologies Audit',
] as const

export const HUIMAN_CHAT_LIST = [
  'Roland Berger',
  'Quotation_Truthkeep',
  'JL Oceania Pty Ltd',
  'Nicholas Vrarnas',
  'Craziest Story Pty Ltd & Not Just Another Pty Ltd',
] as const

export interface AppUser {
  id: UserId
  name: string
  initials: string
  template: TemplateId
  chatList: readonly string[]
}

export const USERS: AppUser[] = [
  {
    id: 'kenyu',
    name: 'KenYu',
    initials: 'KY',
    template: 'audit',
    chatList: KENYU_CHAT_LIST,
  },
  {
    id: 'huiman',
    name: 'Huiman Cao',
    initials: 'HC',
    template: 'standard',
    chatList: HUIMAN_CHAT_LIST,
  },
]

export function getUser(id: UserId): AppUser {
  const u = USERS.find((x) => x.id === id)
  if (!u) throw new Error(`Unknown user: ${id}`)
  return u
}
