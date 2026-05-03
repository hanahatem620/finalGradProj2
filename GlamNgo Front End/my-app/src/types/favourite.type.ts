export interface Favorites {
  count: number
  favorites: Favorite[]
}

export interface Favorite {
  favorite_id: number
  favorited_at: string
  artist: Artist
  services: Service[]
  reviews: Reviews
}

export interface Artist {
  id: number
  name: string
  role: string
  email: string
  image?: string
  location: any
  bio: any
}

export interface Service {
  id: number
  title: string
  type: string
  base_price: number
  duration: number
}

export interface Reviews {
  average_stars: number
  review_count: number
}
