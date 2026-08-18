import { STEPPER_STEPS, stepperIndex } from '../../data/status'

export function ProgressStepper({ status }) {
  const active = stepperIndex(status)

  return (
    <ol className="flex items-start justify-between gap-1 pt-3">
      {STEPPER_STEPS.map((step, i) => {
        const done = i <= active
        return (
          <li key={step.id} className="relative flex flex-1 flex-col items-center">
            {i < STEPPER_STEPS.length - 1 ? (
              <span
                className={`absolute left-1/2 top-[7px] h-0.5 w-full ${done && i < active ? 'bg-teal' : 'bg-line'}`}
                aria-hidden
              />
            ) : null}
            <span
              className={`relative z-[1] h-4 w-4 rounded-full border-2 ${
                i === active
                  ? 'border-amber bg-amber'
                  : done
                    ? 'border-teal bg-teal'
                    : 'border-line bg-white'
              }`}
            />
            <span
              className={`mt-1.5 max-w-[4.6rem] text-center text-[9px] font-semibold leading-tight ${
                i === active ? 'text-amber' : done ? 'text-teal-deep' : 'text-muted'
              }`}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
