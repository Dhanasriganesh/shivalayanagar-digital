import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getStreetById, getStreetBySlug } from '../../data/streets'
import { fetchProblemsByStreet } from '../../services/problems'
import ProblemForm from '../problems/ProblemForm'
import ProblemList from '../problems/ProblemList'

function resolveStreet(streetIdParam, pathname) {
  if (streetIdParam) return getStreetById(streetIdParam)
  const slug = pathname.replace(/^\//, '')
  return getStreetBySlug(slug)
}

function StreetPage() {
  const { streetId } = useParams()
  const { pathname } = useLocation()
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
      setLoadError(
        'Could not load problems. Confirm Firebase is configured and Firestore rules allow reads.',
      )
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
        <h1 className="font-display text-xl font-bold text-ink">Street not found</h1>
        <p className="mt-2 text-sm text-muted">This QR / link does not match any of the 11 streets.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-teal">
          ← Back to all streets
        </Link>
      </div>
    )
  }

  const openCount = problems.filter((p) => p.status !== 'resolved').length

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Link to="/" className="inline-flex text-sm font-semibold text-teal">
          ← All streets
        </Link>
        <div className="rounded-2xl border border-line bg-white px-4 py-5 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Reporting for
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-teal-deep sm:text-3xl">
            {street.name}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {loading
              ? 'Loading reports…'
              : openCount
                ? `${openCount} open issue${openCount === 1 ? '' : 's'} on this street`
                : 'No open issues right now'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-mist p-1">
        <button
          type="button"
          onClick={() => setTab('report')}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${
            tab === 'report' ? 'bg-white text-teal-deep shadow-sm' : 'text-muted'
          }`}
        >
          Report
        </button>
        <button
          type="button"
          onClick={() => setTab('list')}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${
            tab === 'list' ? 'bg-white text-teal-deep shadow-sm' : 'text-muted'
          }`}
        >
          Problems ({problems.length})
        </button>
      </div>

      {tab === 'report' ? (
        <ProblemForm
          street={street}
          onSubmitted={() => {
            setTab('list')
            load()
          }}
        />
      ) : (
        <div className="space-y-3">
          {loadError ? (
            <p className="rounded-xl border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
              {loadError}
            </p>
          ) : null}
          <ProblemList
            problems={problems}
            loading={loading}
            emptyText="No problems reported for this street yet. Be the first."
          />
        </div>
      )}
    </div>
  )
}

export default StreetPage
