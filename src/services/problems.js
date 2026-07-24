import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

const COLLECTION = 'problems'

export async function submitProblem({ streetId, streetName, heading, description, imageBase64 }) {
  const payload = {
    streetId: Number(streetId),
    streetName,
    heading: heading.trim(),
    description: (description || '').trim(),
    imageBase64,
    status: 'open',
    createdAt: serverTimestamp(),
  }
  const ref = await addDoc(collection(db, COLLECTION), payload)
  return ref.id
}

export async function fetchProblemsByStreet(streetId) {
  const q = query(
    collection(db, COLLECTION),
    where('streetId', '==', Number(streetId)),
  )
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
  await updateDoc(doc(db, COLLECTION, id), { status })
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
