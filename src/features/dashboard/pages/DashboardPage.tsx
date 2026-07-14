import { PageShell } from '@/components/common/PageShell'
import { MetricCard } from '@/components/cards/MetricCard'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { Link } from 'react-router-dom'

const metrics = [
  { label: 'Net worth', value: formatCurrency(248_320), delta: '+8.2% this quarter' },
  { label: 'Cash available', value: formatCurrency(84_120), delta: '+$4.2k from last week' },
  { label: 'Invested assets', value: formatCurrency(142_800), delta: '60% allocation' },
  { label: 'Budget remaining', value: formatCurrency(6_420), delta: '18 days left' },
]

const activities = [
  { title: 'Portfolio rebalance completed', meta: 'Global equity and fixed income', amount: '+$1,245', date: '2026-07-11' },
  { title: 'Emergency fund contribution', meta: 'Transferred to savings account', amount: '+$750', date: '2026-07-10' },
  { title: 'Mortgage payment scheduled', meta: 'Upcoming expense reminder', amount: '-$2,180', date: '2026-07-09' },
]

export function DashboardPage() {
  return (
    <PageShell
      title="Overview"
      subtitle="A single screen for liquidity, investment performance, budgets, and goals."
      actions={
        <>
          <Button type="button">Export snapshot</Button>
          <Link className="inline-flex items-center justify-center rounded-md border border-outline-variant px-4 py-3 text-sm font-bold text-on-surface transition-all duration-150 hover:-translate-y-px hover:bg-surface-container-low" to="/reports">
            View reports
          </Link>
        </>
      }
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <article className="rounded-md border border-outline-variant bg-surface-container p-6 shadow-card">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-success">Recent activity</p>
                <h2 className="m-0 mt-1 text-xl font-bold tracking-[-0.04em] text-on-surface">Latest financial movements</h2>
              </div>
              <Button variant="ghost" type="button">
                Reconcile
              </Button>
            </div>
            <div className="grid gap-3">
              {activities.map((activity) => (
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant py-3 last:border-b-0 last:pb-0" key={activity.title}>
                  <div className="min-w-0">
                    <p className="m-0 text-sm font-semibold text-on-surface">{activity.title}</p>
                    <p className="m-0 mt-1 text-sm text-on-surface-variant">
                      {activity.meta} • {formatDate(activity.date)}
                    </p>
                  </div>
                  <p className="m-0 shrink-0 text-sm font-bold text-on-surface">{activity.amount}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-md border border-outline-variant bg-surface-container p-6 shadow-card">
            <div className="mb-5">
              <div>
                <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-success">Focus</p>
                <h2 className="m-0 mt-1 text-xl font-bold tracking-[-0.04em] text-on-surface">This week at a glance</h2>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-md border border-dashed border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant">Cash flow remains positive after recurring expenses and transfers.</div>
              <div className="rounded-md border border-dashed border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant">Your investment mix is within target bands. Review after earnings season.</div>
              <div className="rounded-md border border-dashed border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant">Budget utilization is on track, with travel and dining still below threshold.</div>
            </div>
          </article>
        </section>
      </div>
    </PageShell>
  )
}