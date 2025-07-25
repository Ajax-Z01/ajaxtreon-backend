import { Timestamp } from 'firebase-admin/firestore'

export type ActivityType =
  | 'call'
  | 'meeting'
  | 'email'
  | 'task'
  | 'follow-up'
  | 'note'
  | 'reminder'

export type ActivityStatus = 'pending' | 'completed' | 'cancelled'

export interface Activity {
  id: string
  title: string
  description?: string
  type: ActivityType
  status: ActivityStatus
  relatedTo: {
    type: 'lead' | 'contact' | 'opportunity'
    id: string
  }
  assignedTo?: string
  dueDate?: Timestamp
  completedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
