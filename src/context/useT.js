import { useContext } from 'react'
import { LanguageContext } from './LanguageContext'

export function useT() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useT must be used within LanguageProvider')
  return ctx
}
