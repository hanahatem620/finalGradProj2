export interface BookingRow {
  id: number
  provider_id: number
  provider_name: string
  provider_role: string
  provider_image: string | null
  start_datetime: string
  end_datetime: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  total_price: number
  reviewed: boolean
}