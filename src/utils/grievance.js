import { getCategory } from '../data/categories'
import { isTerminalStatus, normalizeStatus } from '../data/status'

const MY_KEY = 'san_my_grievances'
const PROFILE_KEY = 'san_profile'

export function generateGrievanceNo(streetId) {
  const street = String(streetId).padStart(2, '0')
  const time = Date.now().toString().slice(-8)
  const rand = String(Math.floor(Math.random() * 90) + 10)
  return `${street}${time}${rand}`
}

export function toDate(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate()
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatGovDate(value) {
  const date = toDate(value)
  if (!date) return '—'
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${dd}-${months[date.getMonth()]}-${date.getFullYear()} ${hh}:${mm}:${ss}`
}

export function daysBetween(from, to = new Date()) {
  const a = toDate(from)
  if (!a) return 0
  return Math.max(0, Math.floor((to.getTime() - a.getTime()) / 86_400_000))
}

export function getSlaInfo(problem) {
  const sla = getCategory(problem?.category)?.slaDays ?? 2
  const elapsed = daysBetween(problem?.createdAt)
  const delayBy = Math.max(0, elapsed - sla)
  const overdue = !isTerminalStatus(problem?.status) && delayBy > 0
  return {
    sla,
    elapsed,
    pendingDays: sla,
    completedDays: elapsed,
    delayBy,
    overdue,
  }
}

export function displayHeading(problem) {
  return problem?.subcategory || problem?.heading || 'Civic grievance'
}

export function displayCategory(problem) {
  return problem?.category || 'General'
}

export function rememberGrievance(id) {
  if (!id) return
  const ids = getMyGrievanceIds()
  if (!ids.includes(id)) {
    ids.unshift(id)
    localStorage.setItem(MY_KEY, JSON.stringify(ids.slice(0, 50)))
  }
}

export function getMyGrievanceIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(MY_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter(Boolean) : []
  } catch {
    return []
  }
}

export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveProfile(partial) {
  const next = { ...getProfile(), ...partial }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
  return next
}

export function maskPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (digits.length < 4) return ''
  return `+91 ······ ${digits.slice(-4)}`
}

export function statusCounts(problems) {
  const counts = {
    submitted: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    closed: 0,
    open: 0,
    total: problems?.length || 0,
  }
  for (const p of problems || []) {
    const s = normalizeStatus(p.status)
    counts[s] = (counts[s] || 0) + 1
    if (!isTerminalStatus(s)) counts.open += 1
  }
  return counts
}
