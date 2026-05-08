export interface ProviderDash {
  bookings: Bookings
  available_days: number
  reviews: Reviews
  total_earnings: number
}

export interface Bookings {
  pending: number
  accepted: number
  completed: number
  cancelled: number
}

export interface Reviews {
  average_stars: number
  review_count: number
  items: Item[]
}

export interface Item {
  id: number
  rating: number
  comment: string
  created_at: string
  client_name: string
}
