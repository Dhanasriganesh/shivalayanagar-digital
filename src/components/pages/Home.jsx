import { Link } from 'react-router-dom'
import { STREETS, streetPath } from '../../data/streets'

function Home() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-teal-deep text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #2a8f6f 0%, transparent 42%), radial-gradient(circle at 90% 80%, #0f5c54 0%, transparent 40%)',
          }}
          aria-hidden
        />
        <div className="relative px-5 pb-8 pt-9 sm:px-7 sm:pb-10 sm:pt-11">
          <p className="animate-rise text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Local civic watch
          </p>
          <h1 className="animate-rise-delay mt-3 font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-4xl">
            Shivalaya Nagar
          </h1>
          <p className="animate-rise-late mt-3 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-base">
            Spot an issue on your street? Scan the street QR or open a street below to report it with a photo.
          </p>
          <div className="animate-rise-late mt-6 flex items-center gap-2 text-sm text-white/75">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-amber" />
            11 streets · report · track · fix
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink">Streets</h2>
          <p className="text-xs font-medium text-muted">Tap to view & report</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {STREETS.map((street) => (
            <Link
              key={street.id}
              to={streetPath(street.id)}
              className="group rounded-2xl border border-line bg-white px-3.5 py-4 shadow-[0_8px_20px_-16px_rgba(20,35,31,0.35)] transition active:scale-[0.98] hover:border-teal/40"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Area
              </span>
              <span className="mt-1 block font-display text-lg font-bold text-teal-deep group-hover:text-teal">
                {street.name}
              </span>
              <span className="mt-2 inline-flex text-xs font-semibold text-coral">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white/70 px-4 py-5 sm:px-5">
        <h2 className="font-display text-base font-bold text-ink">How it works</h2>
        <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted">
          <li>
            <span className="font-semibold text-teal-deep">1.</span> Scan the QR stuck on your street pole / wall.
          </li>
          <li>
            <span className="font-semibold text-teal-deep">2.</span> Upload a photo, add a heading, and optional details.
          </li>
          <li>
            <span className="font-semibold text-teal-deep">3.</span> Everyone can see open issues for that street.
          </li>
        </ol>
      </section>
    </div>
  )
}

export default Home
