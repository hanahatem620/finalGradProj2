export interface ServiceRow {
  id: number
  provider_id: number
  type: string
  title: string
  description: string | null
  duration: number
  base_price: number
}

export interface ServiceDraft {
  type: string
  title: string
  description: string
  duration: number
  base_price: number
}

export interface Editable {
  name: string
  email: string
  phone: string
  role: string
  bio: string
  location: string
}