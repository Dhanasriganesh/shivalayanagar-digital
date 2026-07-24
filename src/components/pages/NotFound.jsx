import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="rounded-2xl border border-line bg-white px-5 py-10 text-center">
      <h1 className="font-display text-2xl font-extrabold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-muted">That link does not exist in Street Watch.</p>
      <Link
        to="/"
        className="mt-5 inline-flex rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white"
      >
        Go home
      </Link>
    </div>
  )
}

export default NotFound
