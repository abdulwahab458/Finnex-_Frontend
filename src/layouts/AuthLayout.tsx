import { ShieldCheck, Shield, LockKeyhole } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { APP_NAME } from '@/lib/constants'

const tabBase = 'border-b-2 pb-3 text-center transition-all duration-300 ease-out'
const tabActive = 'border-on-surface text-on-surface'
const tabInactive = 'border-transparent text-on-surface-variant hover:text-on-surface'

export function AuthLayout() {
  return (
    <div className="h-dvh w-screen overflow-hidden">
      <div className="grid h-full w-full md:grid-cols-2">
        <aside className="relative flex h-full flex-col justify-between overflow-hidden bg-[#0b1c4d] px-6 py-6 text-white sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_48%)]" />
          <div className="flex flex-col space-y-20 lg:space-y-40">
            <p className="text-base font-bold tracking-[-0.02em] text-white/95">{APP_NAME}</p>
            <div className="max-w-180 space-y-5">
              <h1 className=" text-4xl font-bold leading-[0.99]  text-white sm:text-5xl lg:text-[3.4rem]">
                Institutional-grade wealth management at your fingertips.
              </h1>
              <p className="text-sm leading-6 text-white/82 sm:text-base">
                Securing your financial future with transparency, technology, and trust.
              </p>
            </div>
          </div>

          <div className="relative flex flex-wrap gap-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 sm:gap-6">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#37d39b]" strokeWidth={2.2} />
              <span>SEC REGISTERED</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#37d39b]" strokeWidth={2.2} />
              <span>SIPC PROTECTED</span>
            </div>
          </div>
        </aside>

        <section className="flex h-full min-h-0 items-center justify-center bg-[#f7f8fb] px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
          <div className="flex w-full max-w-11/12 flex-col gap-8">
            <div className="grid grid-cols-2 gap-0 border-b border-outline-variant/70 text-[1.25rem] font-semibold text-on-surface-variant transition-all ">
              <NavLink
                className={({ isActive }) => `${tabBase} ${isActive ? tabActive : tabInactive}`}
                to="/login"
              >
                Login
              </NavLink>
              <NavLink
                className={({ isActive }) => `${tabBase} ${isActive ? tabActive : tabInactive}`}
                to="/register"
              >
                Register
              </NavLink>
            </div>

            <div className="w-full rounded-4xl  px-0 py-1 sm:px-0">
                <Outlet />
              </div>

            <div className="space-y-5 border-t border-outline-variant/50 pt-5 text-center text-[0.72rem] text-on-surface-variant">
              <div className="flex items-center justify-center gap-6 font-semibold uppercase tracking-[0.16em] text-on-surface/70">
                <span className="inline-flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4" />
                  Bank-level security
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  SSL encrypted
                </span>
              </div>
              <div className="flex items-center justify-center gap-5 text-[0.75rem] font-medium text-on-surface-variant/90">
                <span>Privacy</span>
                <span>Terms</span>
                <span>Security</span>
              </div>
              <p className="text-[0.72rem] text-on-surface-variant/70">© 2024 Modern Trust Wealth Management.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
