export const CATEGORIES = [
  {
    id: 'Drainage',
    label: 'Drainage',
    labelTe: 'మురుగు',
    slaDays: 3,
    accent: '#1D4E89',
    description: 'Leakage, overflow, and manhole issues',
    subcategories: [
      { id: 'Drainage Leakage', label: 'Drainage Leakage', labelTe: 'మురుగు లీకేజీ' },
      { id: 'Manhole Cover Repair', label: 'Manhole Cover Repair', labelTe: 'మాన్‌హోల్ కవర్ మరమ్మత్తు' },
      { id: 'No Manhole Cover', label: 'No Manhole Cover', labelTe: 'మాన్‌హోల్ కవర్ లేదు' },
    ],
  },
  {
    id: 'Electrical',
    label: 'Electrical',
    labelTe: 'విద్యుత్',
    slaDays: 2,
    accent: '#C47B17',
    description: 'Street lights and pole / wire faults',
    subcategories: [
      { id: 'No Street Light', label: 'No Street Light', labelTe: 'వీధి దీపం లేదు' },
      { id: 'Non Glowing of Street Light', label: 'Non Glowing of Street Light', labelTe: 'వీధి దీపం వెలగడం లేదు' },
      { id: 'Current Pole Wire Issue', label: 'Current Pole Wire Issue', labelTe: 'కరెంట్ స్తంభం తీగ సమస్య' },
    ],
  },
  {
    id: 'Road',
    label: 'Road',
    labelTe: 'రోడ్డు',
    slaDays: 7,
    accent: '#B45309',
    description: 'Carriageway damage and potholes',
    subcategories: [
      { id: 'Potholes', label: 'Potholes', labelTe: 'గుంతలు' },
    ],
  },
]

export const OFFICERS = {
  Drainage: { name: 'K. Ramesh, AE/PH', phone: '7331170021' },
  Electrical: { name: 'S. Mahadev Anurag, AE/ENG', phone: '7331170020' },
  Road: { name: 'P. Srinivas, AE/TP', phone: '7331170022' },
}

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id)

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) ?? null
}

export function getSubcategories(categoryId) {
  return getCategory(categoryId)?.subcategories ?? []
}

export function isValidCategoryPair(category, subcategory) {
  return getSubcategories(category).some((s) => s.id === subcategory)
}

export function getOfficer(categoryId) {
  return OFFICERS[categoryId] || { name: 'Ward Officer, AE', phone: '7331170000' }
}
