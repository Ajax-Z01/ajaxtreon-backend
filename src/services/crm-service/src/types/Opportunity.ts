import { Timestamp } from 'firebase-admin/firestore'

export interface Opportunity {
  id: string
  leadId: string
  title: string
  value: number
  status: 'open' | 'won' | 'lost'
  closeDate?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
