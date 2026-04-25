export interface allServices {
  bio: any
  contact_info: any
  created_at: any
  discount: number
  email: string
  id: number
  image_url: any
  location: any
  name: string
  packages: any[]
  phone: string
  role: string
  services: Service[]
  status: string
  user_id: number
}

export interface Service {
  base_price: number
  description?: string
  duration: number
  id: number
  provider_id: number
  title: string
  type: string
}
