export interface AllPayments {
  payments: Payment[]
  summary: Summary
}

export interface Payment {
  id: number
  booking_id: number
  method: string
  amount: number
  status: string
  created_at: string
  start_datetime: string
  end_datetime: string
  booking_status: string
  provider_name: string
  provider_email: string
  client_name: string
  client_email: string
}

export interface Summary {
  totalSpent: number
  loyaltyPoints: number
  totalPayments: number
  totalTransactions: number;
  totalRevenue: number;
  completedPayments: number;
  pendingAmounts: number;
  totalEarned: number
}
