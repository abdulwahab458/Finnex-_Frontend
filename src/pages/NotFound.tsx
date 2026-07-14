import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="grid min-h-[calc(100dvh-88px)] place-items-center px-4 py-10 text-center">
      <div className="grid gap-4">
        <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-success">404</p>
        <h1 className="m-0 text-[clamp(2rem,3vw,3.25rem)] font-bold tracking-[-0.04em] text-on-surface">Page not found</h1>
        <p className="m-0 text-sm text-on-surface-variant">The page you were looking for does not exist.</p>
        <Link className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-bold text-on-primary shadow-soft" to="/">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}