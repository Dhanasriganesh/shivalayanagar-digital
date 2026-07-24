import { formatProblemDate } from '../../services/problems'

function statusStyles(status) {
  if (status === 'resolved') {
    return 'bg-leaf/15 text-teal-deep border-leaf/30'
  }
  return 'bg-coral/10 text-coral border-coral/25'
}

function ProblemCard({ problem, actions }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_24px_-16px_rgba(20,35,31,0.35)]">
      {problem.imageBase64 ? (
        <button
          type="button"
          className="block w-full overflow-hidden bg-mist"
          onClick={() => window.open(problem.imageBase64, '_blank')}
          aria-label="View full image"
        >
          <img
            src={problem.imageBase64}
            alt={problem.heading}
            className="aspect-[16/10] w-full object-cover"
            loading="lazy"
          />
        </button>
      ) : null}

      <div className="space-y-2.5 p-3.5 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold leading-snug text-ink sm:text-[17px]">
            {problem.heading}
          </h3>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${statusStyles(problem.status)}`}
          >
            {problem.status || 'open'}
          </span>
        </div>

        {problem.description ? (
          <p className="text-sm leading-relaxed text-muted">{problem.description}</p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-muted">
          <span>{formatProblemDate(problem.createdAt)}</span>
          {problem.streetName ? <span className="font-medium text-teal">{problem.streetName}</span> : null}
        </div>

        {actions ? <div className="flex flex-wrap gap-2 pt-2">{actions}</div> : null}
      </div>
    </article>
  )
}

export default ProblemCard
