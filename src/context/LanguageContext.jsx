/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo, useState } from 'react'
import { COPY } from '../data/copy'

export const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('san_lang') || 'en')

  const value = useMemo(() => {
    const setLang = (next) => {
      localStorage.setItem('san_lang', next)
      setLangState(next)
    }
    return {
      lang,
      setLang,
      t: COPY[lang] || COPY.en,
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
