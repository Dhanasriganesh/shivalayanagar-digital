import { useCallback, useEffect, useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { APP_URL, STREETS, streetUrl } from '../../data/streets'
import { CATEGORIES } from '../../data/categories'
import { STATUSES, getStatusMeta, normalizeStatus } from '../../data/status'
import {
  deleteProblem,
  fetchAllProblems,
  updateProblemAdmin,
} from '../../services/problems'
import {
  displayCategory,
  displayHeading,
  formatGovDate,
  getSlaInfo,
  statusCounts,
} from '../../utils/grievance'
import { Emblem } from '../ui/Emblem'
import { CategoryGlyph } from '../ui/Icons'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || ''

function AdminGate({ children }) {
  const [ok, setOk] = useState(() => !ADMIN_PIN || sessionStorage.getItem('san_admin') === '1')
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')

  if (ok) return children

  function submit(e) {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('san_admin', '1')
      setOk(true)
      return
    }
    setErr('Incorrect access code.')
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-line bg-white p-6 shadow-card">
      <div className="flex items-center gap-3">
        <Emblem size={44} />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Restricted</p>
          <h1 className="font-display text-xl font-extrabold text-teal-deep">Control room</h1>
        </div>
      </div>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Access code</span>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full rounded-xl border border-line px-3.5 py-3 outline-none ring-teal/30 focus:ring-2"
            autoFocus
          />
        </label>
        {err ? <p className="text-sm text-gov-red">{err}</p> : null}
        <button type="submit" className="w-full rounded-xl bg-teal px-4 py-3 font-bold text-white">
          Enter
        </button>
      </form>
    </div>
  )
}

function Kpi({ label, value, tone = 'ink' }) {
  const tones = {
    ink: 'text-ink',
    red: 'text-gov-red',
    teal: 'text-teal-deep',
    amber: 'text-amber',
  }
  return (
    <div className="rounded-2xl border border-line bg-white px-4 py-3 shadow-card">
      <p className={`font-display text-2xl font-extrabold ${tones[tone]}`}>{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
    </div>
  )
}

function Admin() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [panel, setPanel] = useState('overview')
  const [streetFilter, setStreetFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [queryText, setQueryText] = useState('')
  const [busyId, setBusyId] = useState('')
  const [openId, setOpenId] = useState('')

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

  const counts = useMemo(() => statusCounts(problems), [problems])
  const overdue = useMemo(
    () => problems.filter((p) => getSlaInfo(p).overdue),
    [problems],
  )

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase()
    return problems.filter((p) => {
      if (streetFilter !== 'all' && Number(p.streetId) !== Number(streetFilter)) return false
      if (categoryFilter !== 'all' && displayCategory(p) !== categoryFilter) return false
      if (statusFilter !== 'all' && normalizeStatus(p.status) !== statusFilter) return false
      if (!q) return true
      const hay = [p.grievanceNo, p.id, displayHeading(p), displayCategory(p), p.streetName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [problems, streetFilter, categoryFilter, statusFilter, queryText])

  const byCategory = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]))
    map.General = 0
    for (const p of problems) {
      const c = displayCategory(p)
      map[c] = (map[c] || 0) + 1
    }
    return map
  }, [problems])

  const byStreet = useMemo(() => {
    const map = Object.fromEntries(STREETS.map((s) => [s.id, 0]))
    for (const p of problems) {
      const id = Number(p.streetId)
      if (map[id] != null) map[id] += 1
    }
    return map
  }, [problems])

  async function quickStatus(problem, status) {
    setBusyId(problem.id)
    try {
      await updateProblemAdmin(problem.id, { status })
      await load()
    } catch (err) {
      console.error(err)
      alert('Could not update status.')
    } finally {
      setBusyId('')
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this grievance permanently?')) return
    setBusyId(id)
    try {
      await deleteProblem(id)
      await load()
    } catch (err) {
      console.error(err)
      alert('Could not delete grievance.')
    } finally {
      setBusyId('')
    }
  }

  const maxCat = Math.max(1, ...Object.values(byCategory))
  const maxStreet = Math.max(1, ...Object.values(byStreet))

  return (
    <AdminGate>
      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <div className="tricolor h-1.5" />
          <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <Emblem size={48} />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  Control room · /admin-san
                </p>
                <h1 className="font-display text-2xl font-extrabold text-teal-deep">
                  Shivalaya Nagar Admin
                </h1>
                <p className="text-sm text-muted">Grievance redressal, assignment and QR operations</p>
              </div>
            </div>
            <button
              type="button"
              onClick={load}
              className="rounded-full border border-line px-3 py-1.5 text-xs font-bold text-teal-deep"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-xl bg-mist p-1 no-print sm:grid-cols-3">
          {[
            ['overview', 'Overview'],
            ['reports', 'Grievances'],
            ['qr', 'QR codes'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPanel(id)}
              className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
                panel === id ? 'bg-white text-teal-deep shadow-sm' : 'text-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {panel === 'overview' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Kpi label="Total" value={counts.total} />
              <Kpi label="Submitted" value={counts.submitted} tone="amber" />
              <Kpi label="Pending" value={counts.pending} />
              <Kpi label="In progress" value={counts.in_progress} tone="teal" />
              <Kpi label="Completed" value={counts.completed} tone="teal" />
              <Kpi label="SLA delayed" value={overdue.length} tone="red" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-2xl border border-line bg-white p-4 shadow-card">
                <h2 className="font-display text-base font-extrabold">By category</h2>
                <ul className="mt-3 space-y-2.5">
                  {CATEGORIES.map((c) => (
                    <li key={c.id}>
                      <div className="mb-1 flex justify-between text-xs font-semibold">
                        <span>{c.label}</span>
                        <span>{byCategory[c.id] || 0}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-mist">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${((byCategory[c.id] || 0) / maxCat) * 100}%`,
                            backgroundColor: c.accent,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-line bg-white p-4 shadow-card">
                <h2 className="font-display text-base font-extrabold">By street</h2>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {STREETS.map((s) => (
                    <li key={s.id} className="flex items-center gap-2 text-xs">
                      <span className="w-16 font-semibold text-muted">{s.name}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                        <div
                          className="h-full rounded-full bg-teal"
                          style={{ width: `${((byStreet[s.id] || 0) / maxStreet) * 100}%` }}
                        />
                      </div>
                      <span className="w-5 text-right font-bold">{byStreet[s.id] || 0}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="rounded-2xl border border-line bg-white p-4 shadow-card">
              <h2 className="font-display text-base font-extrabold text-gov-red">
                Overdue ({overdue.length})
              </h2>
              {overdue.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No SLA breaches right now.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line">
                  {overdue.slice(0, 8).map((p) => {
                    const sla = getSlaInfo(p)
                    return (
                      <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                        <span>
                          <span className="font-bold">{displayHeading(p)}</span>
                          <span className="block text-xs text-muted">
                            {p.streetName} · {displayCategory(p)} · delayed {sla.delayBy}d
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setPanel('reports')
                            setOpenId(p.id)
                          }}
                          className="text-xs font-bold text-teal"
                        >
                          Open
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </div>
        ) : null}

        {panel === 'reports' ? (
          <div className="space-y-4">
            <div className="grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-card no-print sm:grid-cols-2 lg:grid-cols-4">
              <label className="block space-y-1">
                <span className="text-[11px] font-bold uppercase text-muted">Search</span>
                <input
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="ID / category / street"
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold uppercase text-muted">Street</span>
                <select
                  value={streetFilter}
                  onChange={(e) => setStreetFilter(e.target.value)}
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm"
                >
                  <option value="all">All streets</option>
                  {STREETS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold uppercase text-muted">Category</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm"
                >
                  <option value="all">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold uppercase text-muted">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-line px-3 py-2.5 text-sm"
                >
                  <option value="all">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
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

            {loading ? (
              <div className="h-40 animate-pulse rounded-2xl bg-white/70" />
            ) : filtered.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-muted">
                No grievances match these filters.
              </p>
            ) : (
              <div className="space-y-3">
                {filtered.map((problem) => {
                  const sla = getSlaInfo(problem)
                  const status = getStatusMeta(problem.status)
                  const open = openId === problem.id
                  return (
                    <article key={problem.id} className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? '' : problem.id)}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left"
                      >
                        <span
                          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
                          style={{ backgroundColor: status.color }}
                        >
                          <CategoryGlyph category={displayCategory(problem)} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-ink">{displayHeading(problem)}</span>
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                              style={{ backgroundColor: status.color }}
                            >
                              {status.label}
                            </span>
                            {sla.overdue ? (
                              <span className="rounded-full bg-gov-red/10 px-2 py-0.5 text-[10px] font-bold uppercase text-gov-red">
                                Delayed {sla.delayBy}d
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {problem.grievanceNo || problem.id.slice(0, 10)} · {problem.streetName} ·{' '}
                            {displayCategory(problem)} · {formatGovDate(problem.createdAt)}
                          </span>
                        </span>
                      </button>

                      {open ? (
                        <div className="space-y-3 border-t border-line px-4 py-4">
                          {problem.imageBase64 ? (
                            <button
                              type="button"
                              onClick={() => window.open(problem.imageBase64, '_blank')}
                              className="block overflow-hidden rounded-xl"
                            >
                              <img
                                src={problem.imageBase64}
                                alt=""
                                className="max-h-52 w-full object-cover"
                              />
                            </button>
                          ) : null}

                          <dl className="grid gap-1 text-sm sm:grid-cols-2">
                            {problem.landmark ? (
                              <div>
                                <dt className="text-xs text-muted">House no</dt>
                                <dd className="font-medium">{problem.landmark}</dd>
                              </div>
                            ) : null}
                            {problem.description ? (
                              <div className="sm:col-span-2">
                                <dt className="text-xs text-muted">Description</dt>
                                <dd className="font-medium">{problem.description}</dd>
                              </div>
                            ) : null}
                            {problem.citizenName ? (
                              <div>
                                <dt className="text-xs text-muted">Citizen</dt>
                                <dd className="font-medium">
                                  {problem.citizenName}
                                  {problem.citizenPhone ? ` · ${problem.citizenPhone}` : ''}
                                </dd>
                              </div>
                            ) : null}
                            <div>
                              <dt className="text-xs text-muted">SLA</dt>
                              <dd className="font-medium">
                                {sla.pendingDays}d target · {sla.completedDays}d elapsed
                              </dd>
                            </div>
                          </dl>

                          <div className="flex flex-wrap gap-1.5">
                            {STATUSES.map((s) => (
                              <button
                                key={s.id}
                                type="button"
                                disabled={busyId === problem.id}
                                onClick={() => quickStatus(problem, s.id)}
                                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                  normalizeStatus(problem.status) === s.id
                                    ? 'text-white'
                                    : 'bg-mist text-ink'
                                }`}
                                style={
                                  normalizeStatus(problem.status) === s.id
                                    ? { backgroundColor: s.color }
                                    : undefined
                                }
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={busyId === problem.id}
                              onClick={() => remove(problem.id)}
                              className="rounded-xl bg-gov-red/10 px-4 py-2 text-sm font-bold text-gov-red disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        ) : null}

        {panel === 'qr' ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 no-print">
              <p className="text-sm text-muted">
                Print and affix one QR per street. Each code opens the live reporting desk, e.g.{' '}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {STREETS.map((street) => {
                const url = streetUrl(street.id)
                return (
                  <div
                    key={street.id}
                    className="qr-print-grid flex flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5 text-center"
                  >
                    <div className="flex items-center gap-2">
                      <Emblem size={28} />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                          Shivalaya Nagar Civic Portal
                        </p>
                        <h3 className="font-display text-lg font-extrabold text-teal-deep">
                          {street.name}
                        </h3>
                      </div>
                    </div>
                    <div className="rounded-xl border border-line bg-paper p-3">
                      <QRCodeSVG value={url} size={168} level="M" includeMargin={false} />
                    </div>
                    <p className="break-all text-[11px] leading-snug text-muted">{url}</p>
                    <p className="text-xs font-medium text-ink">Scan to lodge a grievance here</p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </AdminGate>
  )
}

export default Admin
