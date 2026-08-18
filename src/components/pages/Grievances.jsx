import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllProblems } from '../../services/problems'
import { getMyGrievanceIds, statusCounts } from '../../utils/grievance'
import { PageHeader } from '../ui/PageHeader'
import {
  IconCheckCircle,
  IconClipboard,
  IconClock,
  IconChevron,
  IconCloseCircle,
  IconHourglass,
  IconMegaphone,
  IconRefresh,
} from '../ui/Icons'
import { useT } from '../../context/useT'

function StatTile({ value, label, icon, iconClass }) {
  return (
    <div className="relative overflow-hidden rounded-[1.3rem] border border-white/80 bg-white px-4 py-4 shadow-card">
      <p className="font-display text-3xl font-extrabold text-[#1d4e89]">{value}</p>
      <p className="mt-1 max-w-[7rem] text-[12px] font-semibold leading-tight text-ink">{label}</p>
      <span className={`absolute right-3 top-3 opacity-80 ${iconClass}`}>{icon}</span>
    </div>
  )
}

function Grievances() {
  const { t } = useT()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllProblems()
      .then(setProblems)
      .catch(() => setProblems([]))
      .finally(() => setLoading(false))
  }, [])

  const counts = useMemo(() => statusCounts(problems), [problems])
  const mineClosed = useMemo(() => {
    const mine = new Set(getMyGrievanceIds())
    return problems.filter((p) => mine.has(p.id) && (p.status === 'closed')).length
  }, [problems])

  return (
    <div className="space-y-4">
      <PageHeader title={t.grievances} backTo="/" />

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-[#f3c1c1] px-3 py-3 text-center text-[12px] font-extrabold uppercase tracking-wide text-white">
          {t.grievances}
        </div>
        <Link
          to="/raise"
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#f97316] px-3 py-3 text-[12px] font-extrabold text-white shadow-card"
        >
          <IconMegaphone className="h-4 w-4" />
          {t.raiseGrievance}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          value={loading ? '—' : counts.submitted}
          label={t.submitted}
          iconClass="text-sky-700"
          icon={<IconClipboard className="h-10 w-10" />}
        />
        <StatTile
          value={loading ? '—' : counts.pending}
          label={t.pending}
          iconClass="text-blue-800"
          icon={<IconHourglass className="h-10 w-10" />}
        />
        <StatTile
          value={loading ? '—' : counts.in_progress}
          label={t.inProgress}
          iconClass="text-teal"
          icon={<IconRefresh className="h-10 w-10" />}
        />
        <StatTile
          value={loading ? '—' : counts.completed}
          label={t.completed}
          iconClass="text-amber"
          icon={<IconCheckCircle className="h-10 w-10" />}
        />
        <StatTile
          value={loading ? '—' : mineClosed || counts.closed}
          label={t.closedByYou}
          iconClass="text-violet-700"
          icon={<IconCloseCircle className="h-10 w-10" />}
        />
      </div>

      <Link
        to="/status"
        className="flex items-center gap-3 rounded-[1.4rem] border border-line bg-white px-4 py-4 shadow-card"
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-rose-100 text-gov-red">
          <IconClock className="h-7 w-7" />
        </span>
        <span className="flex-1">
          <span className="block font-extrabold text-ink">{t.grievanceHistory}</span>
          <span className="text-[12px] text-muted">{t.historyCaption}</span>
        </span>
        <IconChevron className="text-muted" />
      </Link>
    </div>
  )
}

export default Grievances
