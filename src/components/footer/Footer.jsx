import { Emblem } from '../ui/Emblem'
import { useT } from '../../context/useT'

function Footer() {
  const { t } = useT()

  return (
    <footer className="mt-auto no-print">
      <div className="mx-auto max-w-lg px-4 pb-6 pt-2 text-center sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {t.footerCredit}
        </p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 shadow-card">
          <Emblem size={28} />
          <span className="text-left">
            <span className="block text-[12px] font-extrabold leading-tight text-teal-deep">
              {t.footerOrg}
            </span>
            <span className="block text-[10px] font-medium text-muted">{t.footerOrgSub}</span>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
