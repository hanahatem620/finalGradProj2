export interface Item {
  id: number
  item_name: string | null
  item_type: string | null
  price_at_booking: number
  addons_summary: string | null
}

export interface Txn { 
    id: number; 
    method: string; 
    amount: number; 
    status: string; 
    created_at: string }

export interface Booking {
  id: number
  client_email: string
  client_name: string | null
  provider_email: string
  provider_name: string | null
  start_datetime: string
  end_datetime: string
  status: string
  total_price: number
  created_at: string
  items: Item[]
  transactions: Txn[]
}