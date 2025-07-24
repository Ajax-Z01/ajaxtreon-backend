import { Timestamp } from 'firebase-admin/firestore'

export interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted'
  assignedTo?: string
  source?: string
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  lastContactedAt?: Timestamp
  expectedValue?: number
  tags?: string[]
}
