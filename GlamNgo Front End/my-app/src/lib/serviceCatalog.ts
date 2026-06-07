// Standardized service catalog. Admins can import these into any artist as a
// quick-start "book of services" with consistent naming, durations, and prices.
// Prices below are *standard* defaults; an admin can override them per-service
// at import time, or apply a global multiplier.

import { CatalogEntry } from "@/types/catalogEntry.type"



export const SERVICE_CATALOG: CatalogEntry[] = [
  // ── Makeup ────────────────────────────────────────────────────────────────
  {
    key: 'bridal-makeup',
    title: 'Bridal Makeup',
    type: 'MAKEUP',
    description: 'Full bridal look with long-lasting formula and trial session.',
    duration: 90,
    base_price: 1500,
  },
  {
    key: 'glam-makeup',
    title: 'Glam Makeup',
    type: 'MAKEUP',
    description: 'Bold, photo-ready glam for special occasions.',
    duration: 60,
    base_price: 800,
  },
  {
    key: 'natural-makeup',
    title: 'Natural Makeup',
    type: 'MAKEUP',
    description: 'Soft, everyday look that enhances your features.',
    duration: 45,
    base_price: 500,
  },
  {
    key: 'special-events-makeup',
    title: 'Special Events Makeup',
    type: 'MAKEUP',
    description: 'Tailored makeup for engagements, parties, and graduations.',
    duration: 60,
    base_price: 700,
  },
  {
    key: 'airbrush-makeup',
    title: 'Airbrush Makeup',
    type: 'MAKEUP',
    description: 'Flawless airbrush finish that lasts all day.',
    duration: 75,
    base_price: 1000,
  },
  {
    key: 'editorial-makeup',
    title: 'Editorial Makeup',
    type: 'MAKEUP',
    description: 'Creative, high-fashion editorial looks.',
    duration: 90,
    base_price: 1200,
  },
  {
    key: 'makeup-lesson',
    title: 'Makeup Lesson',
    type: 'MAKEUP',
    description: 'One-on-one technique coaching and product guidance.',
    duration: 60,
    base_price: 600,
  },

  // ── Hair ──────────────────────────────────────────────────────────────────
  {
    key: 'hair-cut',
    title: 'Hair Cut',
    type: 'HAIR',
    description: 'Personalized cut with wash and finish.',
    duration: 45,
    base_price: 250,
  },
  {
    key: 'hair-styling',
    title: 'Hair Styling',
    type: 'HAIR',
    description: 'Styling for events: blowout, curls, updos.',
    duration: 60,
    base_price: 400,
  },
  {
    key: 'bridal-hair',
    title: 'Bridal Hair',
    type: 'HAIR',
    description: 'Bridal styling with trial session and durable finish.',
    duration: 90,
    base_price: 1200,
  },
  {
    key: 'hair-coloring',
    title: 'Hair Coloring',
    type: 'HAIR',
    description: 'Single-process color or partial highlights.',
    duration: 120,
    base_price: 800,
  },
  {
    key: 'hair-treatment',
    title: 'Hair Treatment',
    type: 'HAIR',
    description: 'Deep-conditioning or keratin treatment.',
    duration: 60,
    base_price: 500,
  },
  {
    key: 'blow-dry',
    title: 'Blow Dry',
    type: 'HAIR',
    description: 'Wash and blow dry with sleek or voluminous finish.',
    duration: 30,
    base_price: 200,
  },
]

export function getCatalogByKey(key: string): CatalogEntry | undefined {
  return SERVICE_CATALOG.find(e => e.key === key)
}
