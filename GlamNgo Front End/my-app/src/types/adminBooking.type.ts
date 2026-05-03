export interface AdminBooking {
  id: number
  client_id: number
  client_name: string | null
  client_email: string
  provider_id: number
  provider_name: string | null
  provider_email: string
  start_datetime: string
  end_datetime: string
  status: string
  total_price: number
}

export interface DashStats {
  total_users: number
  total_clients: number
  total_providers: number
  total_bookings: number
  total_revenue: number
}