import { NextResponse } from 'next/server'
import { SERVICE_CATALOG } from '@/lib/serviceCatalog'

// Public read — anyone can browse the standardized service list. Mutations
// happen elsewhere (the catalog is currently file-defined; promote to a DB
// table if you need admin-managed entries).
export async function GET() {
  return NextResponse.json(SERVICE_CATALOG)
}
