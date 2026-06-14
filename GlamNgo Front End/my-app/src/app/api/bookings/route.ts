import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';
import { db } from '@/lib/db';
import { handleBookingNotification } from '@/lib/bookingNotifications';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  }


  const uid = Number(session.user.id);
  const rows = db().prepare(
    `SELECT b.*, up.name AS provider_name
     FROM bookings b
     LEFT JOIN profiles up ON up.user_id = b.provider_id
     WHERE b.client_id = ? ORDER BY b.start_datetime DESC`
  ).all(uid);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  }

  //     if (session.user.role !== 'CLIENT') {
  //   return NextResponse.json(
  //     { msg: 'Only clients can make bookings' },
  //     { status: 403 }
  //   );
  // }
  
  const uid = Number(session.user.id);
  const body = await req.json().catch(() => ({} as any));
  const providerId = Number(body.provider_id);
  const start = body.start_datetime;
  const end = body.end_datetime;
  const total = Number(body.total_price || 0);
  const client_location = (body.client_location || '').toString().trim();
  const serviceIds: number[] = Array.isArray(body.service_ids)
    ? body.service_ids.map(Number).filter(Boolean) : [];

    const packageId = body.package_id
  ? Number(body.package_id)
  : null;

 if (
  !providerId ||
  !start ||
  !end ||
  !client_location ||
  (serviceIds.length === 0 && !packageId)
) {
  return NextResponse.json(
    { msg: 'Missing fields' },
    { status: 400 }
  );

  
}
  try {
    const makeBooking = db().transaction(() => {
      const info = db().prepare(
        `INSERT INTO bookings (client_id, provider_id, start_datetime, end_datetime,
                               status, total_price, created_at, client_location)
         VALUES (?, ?, ?, ?, 'PENDING', ?, ?, ?)`
      ).run(uid, providerId, start, end, total, new Date().toISOString() , client_location);
      const bookingId = Number(info.lastInsertRowid);

      if (serviceIds.length > 0) {
        const services = db().prepare(
          `SELECT id, title, base_price FROM services
           WHERE id IN (${serviceIds.map(() => '?').join(',')})`
        ).all(...serviceIds) as any[];
        const ins = db().prepare(
          `INSERT INTO booking_items
             (booking_id, service_id, item_type, item_reference_id, item_name, price_at_booking)
           VALUES (?, ?, 'SERVICE', ?, ?, ?)`
        );
        for (const s of services) {
          ins.run(bookingId, s.id, s.id, s.title, s.base_price);
        }
      }

      

      if (packageId) {
  const pkg = db().prepare(
    `SELECT id, name, price
     FROM packages
     WHERE id = ?`
  ).get(packageId) as any;

  if (pkg) {
    db().prepare(
      `INSERT INTO booking_items
       (
         booking_id,
         package_id,
         item_type,
         item_reference_id,
         item_name,
         price_at_booking
       )
       VALUES (?, ?, 'PACKAGE', ?, ?, ?)`
    ).run(
      bookingId,
      pkg.id,
      pkg.id,
      pkg.name,
      pkg.price
    );
  }
}

      return bookingId;
    });
    const bookingId = makeBooking();

    handleBookingNotification({
  bookingId,
  clientId: uid,
  providerId,
  start,
  location: client_location,
})

    return NextResponse.json({ id: bookingId, status: 'PENDING' }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ msg: e?.message || 'Booking failed' }, { status: 500 });
  }
}
