export interface NotificationItem {
  id: number
  user_id: number
  type: string
  title: string
  body: string
  is_read: number
  action_url: string | null
  created_at: string
}

export interface ApiPayload {
  unread_count: number
  notifications: NotificationItem[]
}