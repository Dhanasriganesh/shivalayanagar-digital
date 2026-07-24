/** 11 streets of Shivalaya Nagar — update names to match your local labels */
export const STREETS = [
  { id: 1, name: 'Street 1', slug: 'street-1' },
  { id: 2, name: 'Street 2', slug: 'street-2' },
  { id: 3, name: 'Street 3', slug: 'street-3' },
  { id: 4, name: 'Street 4', slug: 'street-4' },
  { id: 5, name: 'Street 5', slug: 'street-5' },
  { id: 6, name: 'Street 6', slug: 'street-6' },
  { id: 7, name: 'Street 7', slug: 'street-7' },
  { id: 8, name: 'Street 8', slug: 'street-8' },
  { id: 9, name: 'Street 9', slug: 'street-9' },
  { id: 10, name: 'Street 10', slug: 'street-10' },
  { id: 11, name: 'Street 11', slug: 'street-11' },
]

export function getStreetById(id) {
  const n = Number(id)
  return STREETS.find((s) => s.id === n) ?? null
}

export function getStreetBySlug(slug) {
  return STREETS.find((s) => s.slug === slug) ?? null
}

/** Permanent QR path for a street (relative) — /street-4 style */
export function streetPath(streetId) {
  return `/street-${streetId}`
}
