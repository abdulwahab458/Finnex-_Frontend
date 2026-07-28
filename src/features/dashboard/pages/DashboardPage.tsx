import { Landmark, PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { PageShell } from "@/components/common/PageShell";

// Adjust these to whatever your data layer actually exposes — same
// react-query-style { data, isLoading } convention as useBudgets/useGoals.

import { FinancialHealthCard } from "../component/Financialhealthcard";
import { PortfolioSummaryCard } from "../component/Portfoliosummary";
import { BudgetOverviewCard } from "../component/Budgetoverviewcard";
import { GoalOverviewCard } from "../component/Goaloverviewcard";
import { CashflowChart } from "../component/Cashflowchart";
import { CategoryAllocationChart } from "../component/Categoryallocationchart";
import { RecentActivityCard } from "../component/Recentactivitycard";
import { useCashflow, useDashboardOverview, useRecentActivity, useTopCategories } from "../hooks/useDashboard";
import { formatCurrency } from "../component/Categorymeta";

const CURRENCY_SYMBOL = "$";

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            {children}
        </h2>
    );
}

function MiniStat({
    label,
    value,
    icon: Icon,
    iconClass,
    isFirst,
}: {
    label: string;
    value: string;
    icon: typeof TrendingUp;
    iconClass: string;
    isFirst?: boolean;
}) {
    return (
        <div
            className={`flex items-start gap-3 pl-4 first:pl-0 sm:border-l sm:border-outline/10 ${
                isFirst ? "sm:border-0" : ""
            }`}
        >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
                <Icon size={16} />
            </div>
            <div className="min-w-0">
                <p className="truncate text-xs text-on-surface-variant">{label}</p>
                <p className="mt-0.5 text-base font-semibold text-on-surface">{value}</p>
            </div>
        </div>
    );
}

export function DashboardPage() {
    const { data: overview, isLoading: isOverviewLoading } = useDashboardOverview();
    const { data: cashflow, isLoading: isCashflowLoading } = useCashflow();
    const { data: allocations, isLoading: isAllocationsLoading } = useTopCategories();
    const { data: activities, isLoading: isActivitiesLoading } = useRecentActivity();

    if (isOverviewLoading || !overview) {
        // Swap for your existing skeleton/loading component.
        return (
            <PageShell title="Dashboard" subtitle="Your complete financial overview">
                <p className="text-sm text-on-surface-variant">Loading dashboard…</p>
            </PageShell>
        );
    }

    const { financialOverview, portfolioSummary, budgetSummary, goalSummary, financialHealth } = overview;

    return (
        <PageShell title="Dashboard" subtitle="Your complete financial overview">
            <div className="flex flex-col gap-8">
                {/* Hero banner: balance + at-a-glance stats in one strip */}
                <div className="rounded-2xl border border-outline/20 bg-surface p-6 shadow-card">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                                <Wallet size={16} />
                                Total Balance
                            </div>
                            <p className="mt-2 text-4xl font-semibold tracking-tight text-on-surface">
                                {formatCurrency(financialOverview.totalBalance, CURRENCY_SYMBOL)}
                            </p>
                            <p className="mt-1 text-xs text-on-surface-variant">
                                Across all connected accounts, investments, and savings goals.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:min-w-[520px]">
                            <MiniStat
                                label="Monthly Income"
                                value={formatCurrency(financialOverview.monthlyIncome, CURRENCY_SYMBOL)}
                                icon={TrendingUp}
                                iconClass="bg-[#e5f4f0] text-success"
                                isFirst
                            />
                            <MiniStat
                                label="Monthly Expense"
                                value={formatCurrency(financialOverview.monthlyExpense, CURRENCY_SYMBOL)}
                                icon={TrendingDown}
                                iconClass="bg-[#fdecec] text-red-600"
                            />
                            <MiniStat
                                label="Net Savings"
                                value={formatCurrency(financialOverview.netSavings, CURRENCY_SYMBOL)}
                                icon={PiggyBank}
                                iconClass="bg-[#e8ecff] text-indigo-600"
                            />
                            <MiniStat
                                label="Savings Rate"
                                value={`${financialOverview.savingsRate.toFixed(1)}%`}
                                icon={Landmark}
                                iconClass="bg-[#fff7e6] text-warning"
                            />
                        </div>
                    </div>
                </div>

                {/* Snapshot: health + portfolio + budgets + goals, one even row */}
                <div>
                    <SectionHeading>Snapshot</SectionHeading>
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <FinancialHealthCard health={financialHealth} />
                        <PortfolioSummaryCard portfolio={portfolioSummary} currencySymbol={CURRENCY_SYMBOL} />
                        <BudgetOverviewCard budgetSummary={budgetSummary} currencySymbol={CURRENCY_SYMBOL} />
                        <GoalOverviewCard goalSummary={goalSummary} currencySymbol={CURRENCY_SYMBOL} />
                    </div>
                </div>

                {/* Breakdown: cashflow trend + category split */}
                <div>
                    <SectionHeading>Breakdown</SectionHeading>
                    <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-3">
                        <CashflowChart
                            timeline={isCashflowLoading ? [] : cashflow?.timeline ?? []}
                            currencySymbol={CURRENCY_SYMBOL}
                            className="xl:col-span-2"
                        />
                        <CategoryAllocationChart
                            allocations={isAllocationsLoading ? [] : allocations ?? []}
                            currencySymbol={CURRENCY_SYMBOL}
                        />
                    </div>
                </div>

                {/* Recent activity */}
                <div>
                    <SectionHeading>Activity</SectionHeading>
                    <div className="mt-3">
                        <RecentActivityCard
                            activities={isActivitiesLoading ? [] : activities ?? []}
                            currencySymbol={CURRENCY_SYMBOL}
                        />
                    </div>
                </div>
            </div>
        </PageShell>
    );
}