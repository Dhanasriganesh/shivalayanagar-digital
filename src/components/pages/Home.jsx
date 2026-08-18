import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { STREETS, streetPath } from '../../data/streets'
import { fetchAllProblems } from '../../services/problems'
import {
  getProfile,
  maskPhone,
  statusCounts,
} from '../../utils/grievance'
import { useT } from '../../context/useT'
import {
  IconChevron,
  IconDoc,
  IconFolder,
  IconGrid,
  IconHouse,
  IconLeaf,
  IconSun,
  IconWallet,
  IconWarning,
} from '../ui/Icons'

function Home() {
  const { t } = useT()
  const profile = getProfile()
  const [counts, setCounts] = useState({ open: 0, completed: 0, closed: 0, total: 0 })
  const [temp, setTemp] = useState(null)

  useEffect(() => {
    fetchAllProblems()
      .then((rows) => setCounts(statusCounts(rows)))
      .catch(() => {})

    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=17.4065&longitude=78.4772&current=temperature_2m',
    )
      .then((r) => r.json())
      .then((d) => {
        const v = d?.current?.temperature_2m
        if (typeof v === 'number') setTemp(v)
      })
      .catch(() => {})
  }, [])

  const greetingName = profile.name || t.resident
  const phoneMask = maskPhone(profile.phone)

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-r from-teal-deep via-teal to-[#1d4e89] text-white shadow-card">
        <div className="relative px-4 pb-4 pt-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
                  <IconLeaf className="h-5 w-5" />
                </span>
                <p className="text-[11px] font-extrabold tracking-[0.14em]">{t.bannerTitle}</p>
              </div>
              <p className="mt-2 max-w-[16rem] text-[13px] leading-relaxed text-white/90">
                {t.bannerLine}
              </p>
            </div>
            <div className="hidden h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-white/10 sm:block">
              <div className="flex h-full items-end justify-center bg-gradient-to-t from-black/20 to-transparent pb-2 text-[10px] font-bold">
                Ward 11 streets
              </div>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1d4e89] px-3 py-1.5 text-[11px] font-bold">
            <span className="h-2 w-2 rounded-full bg-amber" />
            {t.salute}
          </div>
        </div>
      </section>

      <section className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-bold text-ink">
            {t.namaste}, {greetingName}.
          </p>
          {phoneMask ? <p className="mt-0.5 text-xs text-muted">{phoneMask}</p> : null}
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1.5 text-xs font-bold text-ink shadow-card">
          <IconSun className="text-amber" />
          {temp != null ? `${temp.toFixed(1)}°C` : '—'}
        </div>
      </section>

      <div className="overflow-hidden rounded-lg bg-navy py-1.5 text-[11px] font-medium text-white/90">
        <div className="ticker-track gap-8 px-3">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex gap-8 whitespace-nowrap">
              <span>Hyderabad, TS • {t.liveFeed} • Drainage · Electrical · Road</span>
              <span>SLA: lights 2 days · drainage 3 days · potholes 7 days</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/grievances" className="rounded-2xl border border-line bg-white p-4 shadow-card">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal/10 text-teal">
            <IconDoc className="h-5 w-5" />
          </span>
          <p className="mt-3 font-display text-2xl font-extrabold text-ink">{counts.open}</p>
          <p className="text-xs font-semibold text-muted">{t.openTickets}</p>
        </Link>
        <Link to="/status" className="rounded-2xl border border-line bg-white p-4 shadow-card">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal/10 text-teal">
            <IconWallet className="h-5 w-5" />
          </span>
          <p className="mt-3 font-display text-2xl font-extrabold text-ink">{counts.completed + counts.closed}</p>
          <p className="text-xs font-semibold text-muted">{t.resolved}</p>
        </Link>
      </div>

      <a
        href="#streets"
        className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-card"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal/10 text-teal">
          <IconFolder />
        </span>
        <span className="flex-1">
          <span className="block font-bold text-ink">{t.myDocuments}</span>
          <span className="text-xs text-muted">11 streets · QR enabled</span>
        </span>
        <IconChevron className="text-muted" />
      </a>

      <section className="space-y-2.5">
        <h2 className="font-display text-lg font-extrabold text-ink">{t.featured}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/grievances"
            className="rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#f97316] p-3.5 text-white shadow-card"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20">
              <IconWarning className="h-5 w-5" />
            </span>
            <p className="mt-3 font-extrabold">{t.grievances}</p>
            <p className="mt-1 text-[11px] leading-snug text-white/90">
              Lodge and track citizen grievances filed with the ward.
            </p>
          </Link>
          <Link
            to="/raise"
            className="rounded-2xl bg-gradient-to-br from-teal to-[#1d4e89] p-3.5 text-white shadow-card"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20">
              <IconHouse className="h-5 w-5" />
            </span>
            <p className="mt-3 font-extrabold">{t.raiseGrievance}</p>
            <p className="mt-1 text-[11px] leading-snug text-white/90">
              Drainage, electrical and road complaints with photo evidence.
            </p>
          </Link>
        </div>
      </section>

      <section className="space-y-2.5">
        <h2 className="font-display text-lg font-extrabold text-ink">{t.allServices}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/grievances" className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gov-red text-white">
              <IconWarning className="h-5 w-5" />
            </span>
            <p className="mt-3 font-bold text-ink">{t.grievances}</p>
          </Link>
          <Link to="/status" className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-amber text-white">
              <IconGrid />
            </span>
            <p className="mt-3 font-bold text-ink">{t.checkStatus}</p>
          </Link>
        </div>
      </section>

      <section id="streets" className="scroll-mt-24 space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-lg font-extrabold text-ink">{t.streets}</h2>
          <p className="text-[11px] font-semibold text-muted">QR / tap to report</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {STREETS.map((street) => (
            <Link
              key={street.id}
              to={streetPath(street.id)}
              className="rounded-2xl border border-line bg-white px-3 py-3.5 shadow-card transition active:scale-[0.98]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Ward street</span>
              <span className="mt-1 block font-display text-base font-extrabold text-teal-deep">
                {street.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
