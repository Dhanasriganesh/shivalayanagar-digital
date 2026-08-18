import { Link, useNavigate } from 'react-router-dom'
import { IconBack, IconHome } from './Icons'
import { useT } from '../../context/useT'

function RoundNav({ to, onClick, label, children }) {
  const cls =
    'grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-card ring-1 ring-black/5'
  if (to) {
    return (
      <Link to={to} aria-label={label} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} className={cls}>
      {children}
    </button>
  )
}

export function PageHeader({ title, backTo, hideHome = false }) {
  const navigate = useNavigate()
  const { t } = useT()

  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <RoundNav
        to={backTo}
        onClick={backTo ? undefined : () => navigate(-1)}
        label={t.back}
      >
        <IconBack />
      </RoundNav>
      <h1 className="text-center font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
        {title}
      </h1>
      {hideHome ? (
        <span className="h-10 w-10" />
      ) : (
        <RoundNav to="/" label={t.home}>
          <IconHome />
        </RoundNav>
      )}
    </div>
  )
}

export function StatusBadge({ label, color, solid = false }) {
  if (solid) {
    return (
      <span
        className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
    )
  }
  return (
    <span
      className="inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}
    >
      {label}
    </span>
  )
}
