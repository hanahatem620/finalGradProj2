import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });

  }

  if (
    session.user.role !== 'CLIENT' &&
    session.user.role !== 'artist'
    
  ) {
    return NextResponse.json(
      { msg: 'Forbidden' },
      { status: 403 }
    );

  }

  const settings = db()
    .prepare(`
      SELECT
        new_booking_requests,
        appointment_reminders,
        system_updates
      FROM notification_preferences
      WHERE user_id = ?
    `)
    .get(Number(session.user.id));

  return NextResponse.json(settings || {});
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  }

  if (
    session.user.role !== 'CLIENT' &&
    session.user.role !== 'ARTIST'
  ) {
    return NextResponse.json(
      { msg: 'Forbidden' },
      { status: 403 }
    );
  }

  const body = await req.json();

 db().prepare(`
  INSERT INTO notification_preferences 
    (user_id, new_booking_requests, appointment_reminders, system_updates)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(user_id) DO UPDATE SET
    new_booking_requests = excluded.new_booking_requests,
    appointment_reminders = excluded.appointment_reminders,
    system_updates = excluded.system_updates
`).run(
  Number(session.user.id),
  body.new_booking_requests ? 1 : 0,
  body.appointment_reminders ? 1 : 0,
  body.system_updates ? 1 : 0,
);

  return NextResponse.json({ success: true });
}