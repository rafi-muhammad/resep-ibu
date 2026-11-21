export interface StepListProps {
  steps: string[]
}

/** Langkah memasak sebagai ordered list; nomor visual tidak diumumkan ganda. */
export function StepList({ steps }: StepListProps) {
  return (
    <ol className="flex flex-col gap-5">
      {steps.map((step, index) => (
        <li key={`${index}-${step.slice(0, 24)}`} className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-small font-bold text-brown"
          >
            {index + 1}
          </span>
          <p className="pt-1 text-body text-ink">{step}</p>
        </li>
      ))}
    </ol>
  )
}
