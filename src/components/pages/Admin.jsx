import { useCallback, useEffect, useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { APP_URL, STREETS, streetUrl } from '../../data/streets'
import {
  deleteProblem,
  fetchAllProblems,
  updateProblemStatus,
} from '../../services/problems'
import ProblemList from '../problems/ProblemList'

function Admin() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeStreet, setActiveStreet] = useState('all')
  const [panel, setPanel] = useState('reports') // reports | qr
  const [busyId, setBusyId] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const rows = await fetchAllProblems()
      setProblems(rows)
    } catch (err) {
      console.error(err)
      setError('Could not load reports. Check Firebase config and Firestore rules.')
      setProblems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const grouped = useMemo(() => {
    const map = Object.fromEntries(STREETS.map((s) => [s.id, []]))
    for (const p of problems) {
      const id = Number(p.streetId)
      if (map[id]) map[id].push(p)
      else {
        if (!map.other) map.other = []
        map.other.push(p)
      }
    }
    return map
  }, [problems])

  const visibleProblems = useMemo(() => {
    if (activeStreet === 'all') return problems
    return grouped[Number(activeStreet)] || []
  }, [activeStreet, problems, grouped])

  async function markStatus(id, status) {
    setBusyId(id)
    try {
      await updateProblemStatus(id, status)
      await load()
    } catch (err) {
      console.error(err)
      alert('Could not update status.')
    } finally {
      setBusyId('')
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this report permanently?')) return
    setBusyId(id)
    try {
      await deleteProblem(id)
      await load()
    } catch (err) {
      console.error(err)
      alert('Could not delete report.')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line bg-white px-4 py-5 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Restricted route · /admin-san
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-teal-deep">
          Admin panel
        </h1>
        <p className="mt-2 text-sm text-muted">
          View reports by street and print permanent QR codes for poles / walls.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-mist px-3 py-1 text-teal-deep">
            {problems.length} total
          </span>
          <span className="rounded-full bg-coral/10 px-3 py-1 text-coral">
            {problems.filter((p) => p.status !== 'resolved').length} open
          </span>
          <span className="rounded-full bg-leaf/15 px-3 py-1 text-teal-deep">
            {problems.filter((p) => p.status === 'resolved').length} resolved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-mist p-1 no-print">
        <button
          type="button"
          onClick={() => setPanel('reports')}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
            panel === 'reports' ? 'bg-white text-teal-deep shadow-sm' : 'text-muted'
          }`}
        >
          Reports
        </button>
        <button
          type="button"
          onClick={() => setPanel('qr')}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
            panel === 'qr' ? 'bg-white text-teal-deep shadow-sm' : 'text-muted'
          }`}
        >
          QR codes
        </button>
      </div>

      {panel === 'reports' ? (
        <div className="space-y-4">
          <div className="no-print">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Filter by street
              </span>
              <select
                value={activeStreet}
                onChange={(e) => setActiveStreet(e.target.value)}
                className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none ring-teal/30 focus:ring-2"
              >
                <option value="all">All streets ({problems.length})</option>
                {STREETS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({grouped[s.id]?.length || 0})
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error ? (
            <p className="rounded-xl border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
              {error}
            </p>
          ) : null}

          {activeStreet === 'all' ? (
            <div className="space-y-6">
              {STREETS.map((street) => {
                const rows = grouped[street.id] || []
                return (
                  <section key={street.id} className="space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-display text-lg font-bold text-ink">{street.name}</h2>
                      <span className="text-xs font-semibold text-muted">{rows.length} reports</span>
                    </div>
                    <ProblemList
                      problems={rows}
                      loading={loading}
                      emptyText="No reports for this street."
                      renderActions={(problem) => (
                        <>
                          {problem.status !== 'resolved' ? (
                            <button
                              type="button"
                              disabled={busyId === problem.id}
                              onClick={() => markStatus(problem.id, 'resolved')}
                              className="rounded-full bg-leaf/15 px-3 py-1.5 text-xs font-bold text-teal-deep disabled:opacity-50"
                            >
                              Mark resolved
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={busyId === problem.id}
                              onClick={() => markStatus(problem.id, 'open')}
                              className="rounded-full bg-amber/20 px-3 py-1.5 text-xs font-bold text-ink disabled:opacity-50"
                            >
                              Reopen
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={busyId === problem.id}
                            onClick={() => remove(problem.id)}
                            className="rounded-full bg-coral/10 px-3 py-1.5 text-xs font-bold text-coral disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    />
                  </section>
                )
              })}
            </div>
          ) : (
            <ProblemList
              problems={visibleProblems}
              loading={loading}
              emptyText="No reports for this street."
              renderActions={(problem) => (
                <>
                  {problem.status !== 'resolved' ? (
                    <button
                      type="button"
                      disabled={busyId === problem.id}
                      onClick={() => markStatus(problem.id, 'resolved')}
                      className="rounded-full bg-leaf/15 px-3 py-1.5 text-xs font-bold text-teal-deep disabled:opacity-50"
                    >
                      Mark resolved
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId === problem.id}
                      onClick={() => markStatus(problem.id, 'open')}
                      className="rounded-full bg-amber/20 px-3 py-1.5 text-xs font-bold text-ink disabled:opacity-50"
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyId === problem.id}
                    onClick={() => remove(problem.id)}
                    className="rounded-full bg-coral/10 px-3 py-1.5 text-xs font-bold text-coral disabled:opacity-50"
                  >
                    Delete
                  </button>
                </>
              )}
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 no-print">
            <p className="text-sm text-muted">
              Print these and stick one QR per street. Each QR opens the live site, e.g.{' '}
              <code className="break-all rounded bg-mist px-1.5 py-0.5 text-[10px]">
                {APP_URL}/street-4
              </code>
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white"
            >
              Print QR sheet
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {STREETS.map((street) => {
              const url = streetUrl(street.id)
              return (
                <div
                  key={street.id}
                  className="qr-print-grid flex flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5 text-center"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                      Shivalaya Nagar
                    </p>
                    <h3 className="font-display text-xl font-bold text-teal-deep">{street.name}</h3>
                  </div>
                  <div className="rounded-xl border border-line bg-paper p-3">
                    <QRCodeSVG value={url} size={168} level="M" includeMargin={false} />
                  </div>
                  <p className="break-all text-[11px] leading-snug text-muted">{url}</p>
                  <p className="text-xs font-medium text-ink">Scan to report a problem here</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
