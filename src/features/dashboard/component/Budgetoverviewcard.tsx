import { Wallet2 } from "lucide-react";
import { cn } from "@/lib/utils";

import type { BudgetSummary } from "../types/dashboard.types";
import { formatCurrency } from "./Categorymeta";

export interface BudgetOverviewCardProps {
    budgetSummary: BudgetSummary;
    currencySymbol?: string;
    className?: string;
}

export function BudgetOverviewCard({ budgetSummary, currencySymbol = "$", className }: BudgetOverviewCardProps) {
    const spentPercentage =
        budgetSummary.totalBudgetAmount > 0
            ? Math.min((budgetSummary.totalSpent / budgetSummary.totalBudgetAmount) * 100, 100)
            : 0;

    const breakdown = [
        { label: "On track", count: budgetSummary.onTrack, dotClass: "bg-success" },
        { label: "Warning", count: budgetSummary.warning, dotClass: "bg-warning" },
        { label: "Over budget", count: budgetSummary.overBudget, dotClass: "bg-red-500" },
    ];

    return (
        <div className={cn("rounded-[1.2rem] border border-outline/20 bg-surface p-5 shadow-card", className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-on-surface-variant">
                    Budgets &middot; {budgetSummary.totalBudgets} active
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f4f6] text-on-surface">
                    <Wallet2 size={16} />
                </div>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight text-on-surface">
                {formatCurrency(budgetSummary.totalSpent, currencySymbol)}
                <span className="ml-1 text-sm font-normal text-on-surface-variant">
                    / {formatCurrency(budgetSummary.totalBudgetAmount, currencySymbol)}
                </span>
            </p>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-outline/10">
                <div
                    className="h-full rounded-full bg-gray-900 transition-all duration-500"
                    style={{ width: `${spentPercentage}%` }}
                />
            </div>

            <div className="mt-4 flex items-center gap-4 border-t border-outline/10 pt-3 text-xs">
                {breakdown.map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", item.dotClass)} />
                        <span className="text-on-surface-variant">
                            {item.count} {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}