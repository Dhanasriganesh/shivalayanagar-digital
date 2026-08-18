import { useEffect, useMemo, useState } from 'react'
import { fetchAllProblems } from '../../services/problems'
import { displayCategory, displayHeading } from '../../utils/grievance'
import { normalizeStatus, STATUSES } from '../../data/status'
import { GrievanceList } from '../grievances/GrievanceCard'
import { PageHeader } from '../ui/PageHeader'
import { IconSearch } from '../ui/Icons'
import { useT } from '../../context/useT'

function CheckStatus() {
  const { t, lang } = useT()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('submitted')

  useEffect(() => {
    fetchAllProblems()
      .then(setProblems)
      .catch(() => {
        setError('Could not load grievances. Check Firebase configuration.')
        setProblems([])
      })
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase()
    return problems.filter((p) => {
      if (normalizeStatus(p.status) !== status) return false
      if (!query) return true
      const hay = [
        p.grievanceNo,
        p.id,
        displayCategory(p),
        displayHeading(p),
        p.streetName,
        p.landmark,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(query)
    })
  }, [problems, q, status])

  return (
    <div className="space-y-4">
      <PageHeader title={t.checkStatus} backTo="/grievances" />

      <label className="relative block">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-2xl border border-line bg-white py-3 pl-4 pr-11 text-sm outline-none ring-teal/30 focus:ring-2"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          <IconSearch />
        </span>
      </label>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {STATUSES.map((s) => {
          const active = status === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStatus(s.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-bold ${
                active ? 'bg-gov-red text-white' : 'border border-line bg-white text-ink'
              }`}
            >
              {lang === 'te' ? s.labelTe : s.label}
            </button>
          )
        })}
      </div>

      {error ? (
        <p className="rounded-xl border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>
      ) : null}

      <GrievanceList
        problems={visible}
        loading={loading}
        emptyText={t.noRecords}
      />
    </div>
  )
}

export default CheckStatus
