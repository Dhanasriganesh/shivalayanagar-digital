import ProblemCard from './ProblemCard'

function ProblemList({ problems, loading, emptyText, renderActions }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-line bg-white/70"
          />
        ))}
      </div>
    )
  }

  if (!problems?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white/60 px-4 py-8 text-center">
        <p className="text-sm text-muted">{emptyText || 'No problems reported yet.'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3.5">
      {problems.map((problem) => (
        <ProblemCard
          key={problem.id}
          problem={problem}
          actions={renderActions?.(problem)}
        />
      ))}
    </div>
  )
}

export default ProblemList
