export interface ProviderBook {
  total: number
  bookings: Booking[]
}

export interface Booking {
  id: number
  status: string
  total_price: number
  created_at: string
  date: string
  time: Time
  client: Client
  services: Service[]
  actions: string[]
}

export interface Time {
  start: string
  end: string
  duration_min: number
}

export interface Client {
  id: number
  name: string
  email: string
  phone: any
  image: string
}

export interface Service {
  name: string
  type: string
  price: number
}
