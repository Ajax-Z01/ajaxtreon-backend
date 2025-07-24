import { Opportunity } from '../types/Opportunity'

class OpportunityDTO {
  id: string
  leadId: string
  title: string
  value: number
  status: 'open' | 'won' | 'lost'
  closeDate?: Date
  createdAt: Date | null
  updatedAt: Date | null

  constructor(
    id: string,
    leadId: string,
    title: string,
    value: number,
    status: 'open' | 'won' | 'lost',
    createdAt: Date | null,
    updatedAt: Date | null,
    closeDate?: Date
  ) {
    this.id = id
    this.leadId = leadId
    this.title = title
    this.value = value
    this.status = status
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.closeDate = closeDate
  }

  static fromFirestore(id: string, data: Partial<Opportunity>): OpportunityDTO {
    const createdAt =
      data.createdAt instanceof Date
        ? data.createdAt
        : data.createdAt && typeof data.createdAt.toDate === 'function'
          ? data.createdAt.toDate()
          : null

    const updatedAt =
      data.updatedAt instanceof Date
        ? data.updatedAt
        : data.updatedAt && typeof data.updatedAt.toDate === 'function'
          ? data.updatedAt.toDate()
          : null

    const closeDate =
      data.closeDate instanceof Date
        ? data.closeDate
        : data.closeDate && typeof data.closeDate.toDate === 'function'
          ? data.closeDate.toDate()
          : undefined

    return new OpportunityDTO(
      id,
      data.leadId ?? '',
      data.title ?? '',
      data.value ?? 0,
      data.status ?? 'open',
      createdAt,
      updatedAt,
      closeDate
    )
  }

  toJSON() {
    return {
      id: this.id,
      leadId: this.leadId,
      title: this.title,
      value: this.value,
      status: this.status,
      closeDate: this.closeDate?.toISOString(),
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString()
    }
  }
}

export { OpportunityDTO }
