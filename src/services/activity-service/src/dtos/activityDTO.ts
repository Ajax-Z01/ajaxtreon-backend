import { Activity, ActivityType, ActivityStatus } from '../types/Activity'

class ActivityDTO {
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
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date

  constructor(
    id: string,
    title: string,
    type: ActivityType,
    status: ActivityStatus,
    relatedTo: { type: 'lead' | 'contact' | 'opportunity'; id: string },
    createdAt: Date,
    updatedAt: Date,
    description?: string,
    assignedTo?: string,
    dueDate?: Date,
    completedAt?: Date
  ) {
    this.id = id
    this.title = title
    this.type = type
    this.status = status
    this.relatedTo = relatedTo
    this.description = description
    this.assignedTo = assignedTo
    this.dueDate = dueDate
    this.completedAt = completedAt
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static fromFirestore(id: string, data: Partial<Activity>): ActivityDTO {
    const toDate = (ts?: any): Date | undefined => {
      return ts?.toDate?.() ?? undefined
    }

    return new ActivityDTO(
      id,
      data.title ?? '',
      data.type ?? 'task',
      data.status ?? 'pending',
      data.relatedTo ?? { type: 'lead', id: '' },
      toDate(data.createdAt) ?? new Date(),
      toDate(data.updatedAt) ?? new Date(),
      data.description,
      data.assignedTo,
      toDate(data.dueDate),
      toDate(data.completedAt)
    )
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      type: this.type,
      status: this.status,
      relatedTo: this.relatedTo,
      assignedTo: this.assignedTo,
      dueDate: this.dueDate?.toISOString(),
      completedAt: this.completedAt?.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    }
  }
}

export { ActivityDTO }
