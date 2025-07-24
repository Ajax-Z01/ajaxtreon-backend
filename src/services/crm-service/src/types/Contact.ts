import { Timestamp } from 'firebase-admin/firestore'

export interface Contact {
  id: string
  leadId: string
  name: string
  email?: string
  phone?: string
  position?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
