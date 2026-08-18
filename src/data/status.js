export const STATUSES = [
  { id: 'submitted', label: 'Submitted', labelTe: 'సమర్పించబడింది', stepLabel: 'Open', color: '#C2410C' },
  { id: 'pending', label: 'Pending', labelTe: 'పెండింగ్', stepLabel: 'Under Process', color: '#1D4E89' },
  { id: 'in_progress', label: 'In Progress', labelTe: 'ప్రగతిలో', stepLabel: 'Attended by Officer', color: '#0F766E' },
  { id: 'completed', label: 'Completed', labelTe: 'పూర్తయింది', stepLabel: 'Conditional Closed', color: '#B45309' },
  { id: 'closed', label: 'Closed', labelTe: 'మూసివేయబడింది', stepLabel: 'Closed By Citizen', color: '#6D28D9' },
]

export const STATUS_ORDER = STATUSES.map((s) => s.id)

export function normalizeStatus(status) {
  if (status === 'open') return 'submitted'
  if (status === 'resolved') return 'completed'
  if (STATUS_ORDER.includes(status)) return status
  return 'submitted'
}

export function getStatusMeta(status) {
  const id = normalizeStatus(status)
  return STATUSES.find((s) => s.id === id) || STATUSES[0]
}

export function isTerminalStatus(status) {
  const id = normalizeStatus(status)
  return id === 'completed' || id === 'closed'
}

export const STEPPER_STEPS = [
  { id: 'submitted', label: 'Open' },
  { id: 'pending', label: 'Under Process' },
  { id: 'in_progress', label: 'Attended by Officer' },
  { id: 'closed', label: 'Closed By Citizen' },
  { id: 'completed', label: 'Conditional Closed' },
]

export function stepperIndex(status) {
  const id = normalizeStatus(status)
  if (id === 'closed') return 3
  if (id === 'completed') return 4
  const idx = STEPPER_STEPS.findIndex((s) => s.id === id)
  return Math.max(0, idx)
}
