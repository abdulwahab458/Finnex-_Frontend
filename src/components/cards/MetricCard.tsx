interface MetricCardProps {
  label: string
  value: string
  delta?: string
}

export function MetricCard({ label, value, delta }: MetricCardProps) {
  return (
    <article className="rounded-md border border-outline-variant bg-surface-container p-5 shadow-soft">
      <p className="mb-2 text-sm text-on-surface-variant">{label}</p>
      <p className="m-0 text-[clamp(1.4rem,2vw,2.2rem)] font-bold tracking-[-0.03em] text-on-surface">{value}</p>
      {delta ? (
        <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-[rgba(16,185,129,0.12)] px-2.5 py-1.5 text-xs font-medium text-success">
          {delta}
        </div>
      ) : null}
    </article>
  )
}