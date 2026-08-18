import { NavLink } from 'react-router-dom'
import { Emblem } from '../ui/Emblem'
import { useT } from '../../context/useT'

function Header() {
  const { t, lang, setLang } = useT()

  return (
    <header className="sticky top-0 z-40 no-print">
      <div className="tricolor h-1.5 w-full" />
      <div className="border-b border-line/80 bg-white/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          <NavLink to="/" className="group flex min-w-0 items-center gap-2.5">
            <Emblem size={40} className="shrink-0 drop-shadow-sm" />
            <span className="min-w-0">
              <span className="block truncate font-display text-[15px] font-extrabold leading-tight text-teal-deep sm:text-base">
                {t.appName}
              </span>
              <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {t.appTag}
              </span>
            </span>
          </NavLink>

          <div className="flex items-center gap-1.5">
            <div className="flex overflow-hidden rounded-full border border-line bg-mist text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 ${lang === 'en' ? 'bg-teal text-white' : 'text-muted'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('te')}
                className={`px-2 py-1 ${lang === 'te' ? 'bg-teal text-white' : 'text-muted'}`}
              >
                తె
              </button>
            </div>
            <NavLink
              to="/"
              className="rounded-full border border-line bg-white px-2.5 py-1.5 text-[11px] font-bold text-teal-deep"
            >
              {t.home}
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
