export type ChatMessage =
  | { type: 'user'; content: string }
  | { type: 'assistant-loading'; step: string }
  | {
      type: 'assistant'
      content: string
      list?: string[]
      highlight?: [string, string]
      numberedList?: string[]
    }

export function getDefaultChatMessages(): ChatMessage[] {
  return [
    {
      type: 'assistant',
      content:
        "Hi there! 👋 Thanks for your submission — I've reviewed the details you shared and we're off to a good start.",
    },
    {
      type: 'assistant',
      content: 'Here are a few items that are still missing:',
      list: [
        'Contact title (Optional)',
        'Company name (Optional)',
        'Company address (Optional)',
      ],
    },
    {
      type: 'assistant',
      content:
        "Next, tell me a bit more about what the client is looking for and I'll help you find relevant",
      highlight: ['Solution Package', 'Services'],
    },
  ]
}

export const INITIAL_OPEN_CHATS = [
  'Parable Church Ltd - Audit Proposal',
  'Janus Electric Limited',
  'Viridis Green Data Centres Limited',
  'Omni Tanker Holdings Ltd',
  'Supa Technologies Audit',
] as const
