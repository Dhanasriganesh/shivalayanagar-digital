import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <NavLink to="/" className="group flex min-w-0 items-center gap-2.5">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal text-[13px] font-bold tracking-wide text-white shadow-sm transition group-active:scale-95"
            aria-hidden
          >
            SN
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-[15px] font-bold leading-tight text-ink sm:text-base">
              Shivalaya Nagar
            </span>
            <span className="block text-[11px] font-medium tracking-wide text-muted">
              Street Watch
            </span>
          </span>
        </NavLink>

        <NavLink
          to="/"
          className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-teal-deep transition active:scale-95"
        >
          All streets
        </NavLink>
      </div>
    </header>
  )
}

export default Header
