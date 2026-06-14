export interface BookDetails {
  id: number
  status: string
  created_at: string
  reviewed: boolean
  date: string
  time: Time
  artist: Artist
  services: Service[]
  total_price: number
}

export interface Time {
  from: string
  to: string
  duration_min: number
}

export interface Artist {
  id: number
  name: string
  role: string
  email: string
  image: string
  location: string
  bio: string
  contact: string
  reviews: Reviews
}

export interface Reviews {
  average_stars: number
  review_count: number
}

export interface Service {
  name: string
  type: string
  description: string
  duration: number
  price: number
}
