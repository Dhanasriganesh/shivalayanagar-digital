import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProblemById } from '../../services/problems'
import { GrievanceCard } from '../grievances/GrievanceCard'
import { PageHeader } from '../ui/PageHeader'
import { useT } from '../../context/useT'

function GrievanceDetail() {
  const { id } = useParams()
  const { t } = useT()
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProblemById(id)
      .then(setProblem)
      .catch(() => setProblem(null))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="space-y-4">
      <PageHeader title={t.checkStatus} backTo="/status" />
      {loading ? (
        <div className="h-64 animate-pulse rounded-[1.4rem] bg-white/70" />
      ) : problem ? (
        <GrievanceCard problem={problem} />
      ) : (
        <div className="rounded-2xl border border-line bg-white p-6 text-center">
          <p className="font-bold text-ink">Grievance not found</p>
          <Link to="/status" className="mt-3 inline-block text-sm font-semibold text-teal">
            ← {t.checkStatus}
          </Link>
        </div>
      )}
    </div>
  )
}

export default GrievanceDetail
