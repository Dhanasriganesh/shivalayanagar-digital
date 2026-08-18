import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProblemById } from '../../services/problems'
import { displayHeading, formatGovDate } from '../../utils/grievance'
import { PageHeader } from '../ui/PageHeader'
import { Emblem } from '../ui/Emblem'
import { useT } from '../../context/useT'

function Acknowledgement() {
  const { id } = useParams()
  const { t } = useT()
  const [problem, setProblem] = useState(null)

  useEffect(() => {
    fetchProblemById(id).then(setProblem)
  }, [id])

  const no = problem?.grievanceNo || id

  return (
    <div className="space-y-4">
      <PageHeader title={t.ackTitle} backTo="/" />
      <div className="ack-print rounded-[1.4rem] border border-line bg-white p-5 shadow-card">
        <div className="flex items-center gap-3 border-b border-line pb-3">
          <Emblem size={44} />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              Acknowledgement receipt
            </p>
            <p className="font-display text-lg font-extrabold text-teal-deep">{t.appName}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">{t.ackBody}</p>
        <p className="mt-4 rounded-xl bg-mist px-3 py-3 text-center font-display text-xl font-extrabold tracking-wide text-teal-deep">
          {no}
        </p>
        {problem ? (
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">{t.category}</dt>
              <dd className="font-semibold">{problem.category}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">{t.subcategory}</dt>
              <dd className="font-semibold text-right">{displayHeading(problem)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">{t.street}</dt>
              <dd className="font-semibold">{problem.streetName}</dd>
            </div>
            {problem.landmark ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">{t.landmark}</dt>
                <dd className="font-semibold">{problem.landmark}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3">
              <dt className="text-muted">{t.grievanceDate}</dt>
              <dd className="font-semibold">{formatGovDate(problem.createdAt)}</dd>
            </div>
          </dl>
        ) : null}
        <div className="mt-5 flex gap-2 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 rounded-xl border border-line px-3 py-2.5 text-sm font-bold text-ink"
          >
            {t.printAck}
          </button>
          <Link
            to={`/status/${id}`}
            className="flex-1 rounded-xl bg-teal px-3 py-2.5 text-center text-sm font-bold text-white"
          >
            {t.checkStatus}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Acknowledgement
