import { Contact } from '../types/Contact'

class ContactDTO {
  id: string
  leadId: string
  name: string
  email?: string
  phone?: string
  position?: string
  createdAt: Date | null
  updatedAt: Date | null

  constructor(
    id: string,
    leadId: string,
    name: string,
    createdAt: Date | null,
    updatedAt: Date | null,
    email?: string,
    phone?: string,
    position?: string
  ) {
    this.id = id
    this.leadId = leadId
    this.name = name
    this.email = email
    this.phone = phone
    this.position = position
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static fromFirestore(id: string, data: Partial<Contact>): ContactDTO {
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

    return new ContactDTO(
      id,
      data.leadId ?? '',
      data.name ?? '',
      createdAt,
      updatedAt,
      data.email,
      data.phone,
      data.position
    )
  }

  toJSON() {
    return {
      id: this.id,
      leadId: this.leadId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      position: this.position,
      createdAt: this.createdAt?.toISOString() || null,
      updatedAt: this.updatedAt?.toISOString() || null
    }
  }
}

export { ContactDTO }
