import { db } from '@/lib/db'
import { notifyNewBooking } from '@/lib/notification'

export function handleBookingNotification({
  clientId,
  providerId,
  start,
  location,
}: {
  bookingId: number
  clientId: number
  providerId: number
  start: string
  location: string
}) {
  const client = db()
    .prepare(`SELECT name FROM profiles WHERE user_id = ?`)
    .get(clientId) as any

  notifyNewBooking({
    artistId: providerId,
    clientName: client?.name || 'Client',
    date: start,
    location,
  })
}