import { Link } from 'react-router-dom'
import { useT } from '../../context/useT'

function NotFound() {
  const { t } = useT()
  return (
    <div className="rounded-2xl border border-line bg-white px-5 py-10 text-center shadow-card">
      <h1 className="font-display text-2xl font-extrabold text-ink">{t.notFound}</h1>
      <p className="mt-2 text-sm text-muted">This link is not part of the civic portal.</p>
      <Link to="/" className="mt-5 inline-flex rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white">
        {t.home}
      </Link>
    </div>
  )
}

export default NotFound
