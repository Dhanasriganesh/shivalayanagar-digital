import { Link } from 'react-router-dom'
import { getCategory } from '../../data/categories'
import { getStatusMeta, normalizeStatus } from '../../data/status'
import {
  displayCategory,
  displayHeading,
  formatGovDate,
  getSlaInfo,
} from '../../utils/grievance'
import { CategoryGlyph, IconPhone, IconPlus } from '../ui/Icons'
import { ProgressStepper } from '../ui/ProgressStepper'
import { useT } from '../../context/useT'

function Field({ label, children, danger = false, warn = false }) {
  return (
    <p className="text-[13px] leading-snug">
      <span className="font-semibold text-ink">{label}: </span>
      <span className={danger ? 'font-bold text-gov-red' : warn ? 'font-bold text-amber' : 'text-ink'}>
        {children}
      </span>
    </p>
  )
}

export function GrievanceCard({ problem, compact = false }) {
  const { t, lang } = useT()
  const status = getStatusMeta(problem.status)
  const sla = getSlaInfo(problem)
  const category = displayCategory(problem)
  const catMeta = getCategory(problem.category)
  const phone = String(problem.assignedPhone || '').replace(/\D/g, '')

  if (compact) {
    return (
      <Link
        to={`/status/${problem.id}`}
        className="block overflow-hidden rounded-2xl border border-line bg-white shadow-card"
      >
        <div className="flex items-center justify-between bg-teal px-3.5 py-2 text-white">
          <span className="flex items-center gap-2 text-sm font-bold">
            <CategoryGlyph category={category} className="h-4 w-4" />
            {lang === 'te' && catMeta ? catMeta.labelTe : category}
          </span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 text-[11px] font-bold">
            1
          </span>
        </div>
        <div className="space-y-1 px-3.5 py-3 text-[13px]">
          <p className="font-bold text-ink">{displayHeading(problem)}</p>
          <p className="text-muted">ID: {problem.grievanceNo || problem.id.slice(0, 12)}</p>
          <p className="text-muted">{problem.streetName}</p>
          <p className="pt-1 text-[11px] font-bold" style={{ color: status.color }}>
            {lang === 'te' ? status.labelTe : status.label}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-line bg-white shadow-card">
      <div className="flex items-center justify-between bg-teal px-4 py-2.5 text-white">
        <span className="flex items-center gap-2 text-sm font-bold">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
            <CategoryGlyph category={category} className="h-4 w-4" />
          </span>
          {lang === 'te' && catMeta ? catMeta.labelTe : category}
        </span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-xs font-bold">
          1
        </span>
      </div>

      {problem.imageBase64 ? (
        <button
          type="button"
          className="block w-full overflow-hidden bg-mist"
          onClick={() => window.open(problem.imageBase64, '_blank')}
          aria-label="View photo"
        >
          <img
            src={problem.imageBase64}
            alt={displayHeading(problem)}
            className="aspect-[16/9] w-full object-cover"
            loading="lazy"
          />
        </button>
      ) : null}

      <div className="space-y-1.5 px-4 py-3.5">
        <Field label="ID">{problem.grievanceNo || problem.id}</Field>
        <Field label={t.category}>{displayCategory(problem)}</Field>
        <Field label={`${t.subcategory} Name`}>{displayHeading(problem)}</Field>
        {problem.landmark ? <Field label={t.landmark}>{problem.landmark}</Field> : null}
        {problem.description ? <Field label={t.description}>{problem.description}</Field> : null}
        <Field label={t.grievanceDate}>{formatGovDate(problem.createdAt)}</Field>
        <Field label={t.assignedTo}>
          <span className="inline-flex items-center gap-1.5">
            {problem.assignedTo || 'Ward Officer'}
            {phone ? (
              <a href={`tel:${phone}`} className="inline-flex text-india-green" aria-label="Call officer">
                <IconPhone />
              </a>
            ) : null}
          </span>
        </Field>
        <Field label={t.officerRemarks}>{problem.officerRemarks || '—'}</Field>
        <Field label={t.pendingDays}>{sla.pendingDays} Days</Field>
        <Field label={t.completedDays}>{sla.completedDays} Days</Field>
        <Field label={t.delayBy} danger={sla.delayBy > 0}>
          {sla.delayBy} Days
        </Field>
        <Field label={t.status} warn>
          {status.label === 'Submitted' ? 'Open' : status.label}
        </Field>
        {problem.streetName ? (
          <p className="pt-1 text-[12px] font-semibold text-teal">{problem.streetName}</p>
        ) : null}

        <ProgressStepper status={normalizeStatus(problem.status)} />

        <div className="flex gap-2 pt-3">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-gov-red px-3 py-2.5 text-[13px] font-bold text-gov-red"
            >
              <IconPlus />
              {t.messageOfficer}
            </a>
          ) : (
            <span className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-line px-3 py-2.5 text-[13px] font-bold text-muted">
              {t.messageOfficer}
            </span>
          )}
          <Link
            to={`/status/${problem.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-teal px-3 py-2.5 text-[13px] font-bold text-white"
          >
            {t.viewMore}
          </Link>
        </div>
      </div>
    </article>
  )
}

export function GrievanceList({ problems, loading, emptyText, compact = false }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl border border-line bg-white/70" />
        ))}
      </div>
    )
  }

  if (!problems?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white/70 px-4 py-8 text-center">
        <p className="text-sm text-muted">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3.5">
      {problems.map((problem) => (
        <GrievanceCard key={problem.id} problem={problem} compact={compact} />
      ))}
    </div>
  )
}
