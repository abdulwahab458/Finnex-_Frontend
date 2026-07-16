export function Footer() {
  return (
    <footer className="shrink-0 border-t border-outline bg-surface text-on-surface" aria-label="Site footer">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-4 text-[12px] font-medium tracking-[0.04em] md:flex-row md:items-center md:justify-between md:px-6">
        <div className="shrink-0 whitespace-nowrap text-[13px] font-bold text-primary">Modern Trust</div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-on-surface-variant" aria-label="Footer links">
          <a className="transition-colors hover:text-primary" href="/privacy-policy">
            Privacy Policy
          </a>
          <a className="transition-colors hover:text-primary" href="/terms-of-service">
            Terms of Service
          </a>
          <a className="transition-colors hover:text-primary" href="/security-standards">
            Security Standards
          </a>
          <a className="transition-colors hover:text-primary" href="/disclosures">
            Disclosures
          </a>
        </nav>

        <p className="text-center text-[13px] text-on-surface-variant md:text-right">
          &copy; {new Date().getFullYear()} Modern Trust Wealth Management. SEC Registered.
        </p>
      </div>
    </footer>
  )
}

