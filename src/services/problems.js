import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'
import { getOfficer } from '../data/categories'
import { generateGrievanceNo } from '../utils/grievance'

const COLLECTION = 'problems'

export async function submitProblem({
  streetId,
  streetName,
  category,
  subcategory,
  description,
  landmark,
  imageBase64,
  citizenName,
  citizenPhone,
}) {
  const officer = getOfficer(category)
  const payload = {
    streetId: Number(streetId),
    streetName,
    category,
    subcategory,
    heading: subcategory,
    description: (description || '').trim(),
    landmark: (landmark || '').trim(),
    imageBase64,
    status: 'submitted',
    createdAt: serverTimestamp(),
    grievanceNo: generateGrievanceNo(streetId),
    citizenName: (citizenName || '').trim(),
    citizenPhone: (citizenPhone || '').trim(),
    assignedTo: officer.name,
    assignedPhone: officer.phone,
  }
  const ref = await addDoc(collection(db, COLLECTION), payload)
  return { id: ref.id, grievanceNo: payload.grievanceNo, assignedTo: officer.name }
}

export async function fetchProblemById(id) {
  const snap = await getDoc(doc(db, COLLECTION, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function fetchProblemsByIds(ids) {
  const unique = [...new Set((ids || []).filter(Boolean))]
  if (!unique.length) return []
  const rows = await Promise.all(unique.map((id) => fetchProblemById(id)))
  return rows.filter(Boolean).sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0
    const tb = b.createdAt?.toMillis?.() ?? 0
    return tb - ta
  })
}

export async function fetchProblemsByStreet(streetId) {
  const q = query(collection(db, COLLECTION), where('streetId', '==', Number(streetId)))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const ta = a.createdAt?.toMillis?.() ?? 0
      const tb = b.createdAt?.toMillis?.() ?? 0
      return tb - ta
    })
}

export async function fetchAllProblems() {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function updateProblemStatus(id, status) {
  await updateDoc(doc(db, COLLECTION, id), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export async function updateProblemAdmin(id, fields) {
  const payload = {}
  if (fields.status != null) payload.status = fields.status
  if (fields.assignedTo != null) payload.assignedTo = String(fields.assignedTo).trim()
  if (fields.assignedPhone != null) payload.assignedPhone = String(fields.assignedPhone).trim()
  if (fields.officerRemarks != null) payload.officerRemarks = String(fields.officerRemarks).trim()
  payload.updatedAt = serverTimestamp()
  await updateDoc(doc(db, COLLECTION, id), payload)
}

export async function deleteProblem(id) {
  await deleteDoc(doc(db, COLLECTION, id))
}

export function formatProblemDate(createdAt) {
  if (!createdAt) return 'Just now'
  const date = typeof createdAt.toDate === 'function' ? createdAt.toDate() : new Date(createdAt)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
