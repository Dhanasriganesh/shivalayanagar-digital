import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getStreetById, getStreetBySlug } from '../../data/streets'
import { fetchProblemsByStreet } from '../../services/problems'
import GrievanceForm from '../grievances/GrievanceForm'
import { GrievanceList } from '../grievances/GrievanceCard'
import { PageHeader } from '../ui/PageHeader'
import { isTerminalStatus } from '../../data/status'
import { useT } from '../../context/useT'

function resolveStreet(streetIdParam, pathname) {
  if (streetIdParam) return getStreetById(streetIdParam)
  const slug = pathname.replace(/^\//, '')
  return getStreetBySlug(slug)
}

function StreetPage() {
  const { streetId } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useT()
  const street = resolveStreet(streetId, pathname)
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('report')
  const [loadError, setLoadError] = useState('')

  const load = useCallback(async () => {
    if (!street) return
    setLoading(true)
    setLoadError('')
    try {
      const rows = await fetchProblemsByStreet(street.id)
      setProblems(rows)
    } catch (err) {
      console.error(err)
      setLoadError('Could not load grievances. Confirm Firebase is configured.')
      setProblems([])
    } finally {
      setLoading(false)
    }
  }, [street])

  useEffect(() => {
    load()
  }, [load])

  if (!street) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 text-center">
        <h1 className="font-display text-xl font-bold text-ink">{t.streetNotFound}</h1>
        <p className="mt-2 text-sm text-muted">This QR / link does not match any of the 11 streets.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-teal">
          ← {t.allStreets}
        </Link>
      </div>
    )
  }

  const openCount = problems.filter((p) => !isTerminalStatus(p.status)).length

  return (
    <div className="space-y-4">
      <PageHeader title={street.name} backTo="/" />

      <div className="rounded-[1.4rem] border border-line bg-white px-4 py-4 shadow-card">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">QR reporting desk</p>
        <p className="mt-1 text-sm text-muted">
          {loading
            ? 'Loading…'
            : openCount
              ? `${openCount} open grievance${openCount === 1 ? '' : 's'} on this street`
              : 'No open grievances on this street'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/70 p-1 ring-1 ring-line">
        <button
          type="button"
          onClick={() => setTab('report')}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
            tab === 'report' ? 'bg-teal text-white' : 'text-muted'
          }`}
        >
          {t.raiseGrievance}
        </button>
        <button
          type="button"
          onClick={() => setTab('list')}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
            tab === 'list' ? 'bg-teal text-white' : 'text-muted'
          }`}
        >
          {t.checkStatus} ({problems.length})
        </button>
      </div>

      {tab === 'report' ? (
        <div className="rounded-[1.4rem] border border-line bg-white p-4 shadow-card">
          <GrievanceForm
            street={street}
            onSubmitted={(result) => navigate(`/ack/${result.id}`)}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {loadError ? (
            <p className="rounded-xl border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
              {loadError}
            </p>
          ) : null}
          <GrievanceList
            problems={problems}
            loading={loading}
            emptyText="No grievances reported for this street yet."
            compact
          />
        </div>
      )}
    </div>
  )
}

export default StreetPage
