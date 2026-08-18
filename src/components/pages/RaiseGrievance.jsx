import { useNavigate, useSearchParams } from 'react-router-dom'
import { getStreetById } from '../../data/streets'
import GrievanceForm from '../grievances/GrievanceForm'
import { PageHeader } from '../ui/PageHeader'
import { useT } from '../../context/useT'

function RaiseGrievance() {
  const { t } = useT()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const street = getStreetById(params.get('street'))

  return (
    <div className="space-y-4">
      <PageHeader title={t.raiseGrievance} backTo="/grievances" />
      <div className="rounded-[1.4rem] border border-line bg-white p-4 shadow-card sm:p-5">
        <p className="text-sm text-muted">
          Select a category, then the matching sub-category. A photo is mandatory.
        </p>
        <div className="mt-4">
          <GrievanceForm
            street={street || undefined}
            onSubmitted={(result) => navigate(`/ack/${result.id}`)}
          />
        </div>
      </div>
    </div>
  )
}

export default RaiseGrievance
