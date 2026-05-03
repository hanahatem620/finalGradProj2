export interface ProviderService {
  id: number
  title: string
  type: string
  duration: number
  base_price: number
  description?: string
}

export interface Provider {
  id: number
  email: string
  name: string
  role: string
  bio: string | null
  location: string | null
  image_url: string | null
  services: ProviderService[]
  status : string
}

export interface ProviderWithRating extends Provider {
  avg_rating: number | null
  review_count: number
}

export interface Review {
  id: number
  rating: number
  comment: string | null
  client_name: string
  created_at: string
}