export interface TicketMessage {
  id: number
  sender_type: 'CLIENT' | 'ADMIN'
  sender_name: string | null
  body: string
  created_at: string
}

export interface Ticket {
  id: number
  title: string | null
  category: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  created_at: string
  resolved_at: string | null
  messages: TicketMessage[]
}