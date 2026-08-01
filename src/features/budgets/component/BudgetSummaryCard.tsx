import { TriangleAlert, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Budget } from "../types/budget.types";

export interface BudgetSummaryCardProps {
    /** Full list from GET /budgets — the card summarizes every budget across
     *  all periods (total target, total spent, total over budget). */
    budgets: Budget[];
    currencySymbol?: string;
    className?: string;
}

function formatCurrency(value: number, symbol: string): string {
    return `${symbol}${value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}

/**
 * Dark "Budget Overview" summary card shown next to the monthly spending
 * limits. Aggregates the whole `budgets` list into:
 * - Total budget (sum of all `targetAmount`)
 * - Total spent (sum of all `currentSpent`)
 * - Total exceeded (sum of positive overages: `currentSpent - targetAmount`)
 * - How many budgets are currently over budget
 */
export function BudgetSummaryCard({
    budgets,
    currencySymbol = "$",
    className,
}: BudgetSummaryCardProps) {
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.targetAmount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.currentSpent, 0);
    const totalExceeded = budgets.reduce(
        (sum, budget) => sum + Math.max(0, budget.currentSpent - budget.targetAmount),
        0
    );
    const overBudgetCount = budgets.filter((budget) => budget.status === "OVER_BUDGET").length;

    const spentPercentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    return (
        <div
            className={cn(
                "rounded-[1.2rem] border border-primary/60 bg-primary p-6 text-white shadow-card",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Budget Overview</h3>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                    <Wallet size={18} />
                </div>
            </div>

            {/* Total budget */}
            <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {formatCurrency(totalBudget, currencySymbol)}
            </p>
            <p className="mt-1 text-xs text-white/60">
                Total budget across {budgets.length} {budgets.length === 1 ? "budget" : "budgets"}
            </p>

            {/* Spent progress */}
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${spentPercentage}%` }}
                />
            </div>

            {/* Stats */}
            <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white/70">
                        <TrendingUp size={15} className="text-emerald-400" />
                        Total spent
                    </span>
                    <span className="font-semibold text-white">
                        {formatCurrency(totalSpent, currencySymbol)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white/70">
                        <TriangleAlert size={15} className={overBudgetCount > 0 ? "text-amber-400" : "text-white/40"} />
                        Over budget
                    </span>
                    <span
                        className={cn(
                            "font-semibold",
                            totalExceeded > 0 ? "text-amber-400" : "text-white/70"
                        )}
                    >
                        {formatCurrency(totalExceeded, currencySymbol)}
                    </span>
                </div>

                {overBudgetCount > 0 && (
                    <p className="pt-1 text-xs text-white/50">
                        {overBudgetCount} {overBudgetCount === 1 ? "budget has" : "budgets have"} exceeded
                        their limit.
                    </p>
                )}
            </div>
        </div>
    );
}
