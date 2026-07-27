import React, { useState } from "react";
import {
    Car,
    CircleHelp,
    Film,
    GraduationCap,
    HeartPulse,
    House,
    Landmark,
    Receipt,
    Shield,
    ShoppingBag,
    ShoppingCart,
    TrendingUp,
    UtensilsCrossed,
    Wallet,
    Zap,
    ArrowLeftRight,
    Pencil,
    Trash2,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionsMenu } from "@/components/menu/Actionmenu";
import type { Budget, BudgetCategory, BudgetPeriod, BudgetStatus } from "../types/budget.types";

export interface BudgetSpendingLimitsCardProps {
    /** Full, unfiltered list from GET /budgets — this component slices it
     *  by `budget.period` itself, since the endpoint takes no query params. */
    budgets: Budget[];
    /** Shown as the small pill top-right, e.g. "NOVEMBER 2024". Defaults to
     *  deriving the month/year from the first visible (post-filter) budget's startDate. */
    periodLabel?: string;
    currencySymbol?: string;
    className?: string;
    /** Which period tabs to show, and in what order. Defaults to all four. */
    availablePeriods?: BudgetPeriod[];
    /** Which tab is active on first render. Defaults to the first entry in availablePeriods. */
    defaultPeriod?: BudgetPeriod;
    /** Pass either (or both) and an ActionsMenu appears on every row. Both
     *  optional — omit both and rows render exactly as before, no menu. */
    onEdit?: (budget: Budget) => void;
    onDelete?: (budget: Budget) => void;
}

// Same icon set used elsewhere for TransactionCategory — kept local here
// so this component has no hard dependency on the transactions feature.
const categoryIcons: Record<BudgetCategory, LucideIcon> = {
    FOOD_AND_DINING: UtensilsCrossed,
    SHOPPING: ShoppingBag,
    GROCERIES: ShoppingCart,
    TRANSPORT: Car,
    HEALTHCARE: HeartPulse,
    INSURANCE: Shield,
    UTILITIES: Zap,
    ENTERTAINMENT: Film,
    INVESTMENT: TrendingUp,
    DIVIDEND: Landmark,
    SALARY: Wallet,
    TRANSFER: ArrowLeftRight,
    EDUCATION: GraduationCap,
    RENT: House,
    TAX: Receipt,
    OTHER: CircleHelp,
};

const statusConfig: Record<BudgetStatus, { label: string; badgeClass: string; barClass: string }> = {
    ON_TRACK: { label: "On Track", badgeClass: "bg-[#e5f4f0] text-success", barClass: "bg-gray-900" },
    WARNING: { label: "Warning", badgeClass: "bg-[#fff7e6] text-warning", barClass: "bg-gray-900" },
    OVER_BUDGET: { label: "Over Budget", badgeClass: "bg-[#fdecec] text-red-600", barClass: "bg-red-500" },
};

const periodLabels: Record<BudgetPeriod, string> = {
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    YEARLY: "Yearly",
    CUSTOM: "Custom",
};

const DEFAULT_PERIODS: BudgetPeriod[] = ["MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"];

const headingByPeriod: Record<BudgetPeriod, string> = {
  MONTHLY: "Monthly Spending Limits",
  QUARTERLY: "Quarterly Spending Limits",
  YEARLY: "Yearly Spending Limits",
  CUSTOM: "Custom Spending Limits",
};

function formatCurrency(value: number, symbol: string): string {
    return `${symbol}${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * Pill text next to the heading, shaped differently per period:
 * - MONTHLY   → a single month, e.g. "JULY 2026"
 * - QUARTERLY → start month → end month, e.g. "JUL - SEP 2026"
 * - YEARLY    → just the year, e.g. "2026"
 * - CUSTOM    → literal "CUSTOM", since a custom range has no fixed shape
 *   that's meaningful to summarize across every budget in the tab
 *
 * Derived from the first *visible* (already period-filtered) budget's
 * dates, since that's the one actually representative of the active tab.
 */
function formatPeriodLabel(period: BudgetPeriod, budgets: Budget[]): string {
    const first = budgets[0];
    if (!first) return "";

    const start = new Date(first.startDate);

    switch (period) {
        case "MONTHLY":
            return start.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();

        case "QUARTERLY": {
            const end = new Date(first.endDate);
            const startMonth = start.toLocaleDateString("en-US", { month: "short" });
            const endMonth = end.toLocaleDateString("en-US", { month: "short" });
            return `${startMonth} - ${endMonth} ${end.getFullYear()}`.toUpperCase();
        }

        case "YEARLY":
            return String(start.getFullYear());

        case "CUSTOM":
            return "CUSTOM";
    }
}

/**
 * Spending Limits overview card. The heading and the pill next to it both
 * change shape based on the active period tab (Monthly / Quarterly /
 * Yearly / Custom — matching BudgetPeriod):
 * - Heading: "Monthly Spending Limits" / "Quarterly Spending Limits" / etc.
 * - Pill: a single month ("JULY 2026") for Monthly, a month range
 *   ("JUL - SEP 2026") for Quarterly, just the year ("2026") for Yearly,
 *   and the literal "CUSTOM" for Custom.
 *
 * Your GET /budgets endpoint takes no query params — it returns every
 * budget across every period in one call. This component is what does
 * the segregating: it filters the full `budgets` list down to
 * `budget.period === activePeriod` internally, entirely client-side.
 *
 * `onEdit`/`onDelete` are both optional — the page passes them straight
 * through as props, and this component forwards them into `ActionsMenu`
 * per row (page → BudgetSpendingLimitsCard → ActionsMenu). Pass either
 * one (or both) and a three-dot menu appears on every row; pass neither
 * and rows render with no menu at all, same as before.
 *
 * Usage:
 * const { budgets } = useBudgets(); // GET /budgets — no params
 * <BudgetSpendingLimitsCard
 *   budgets={budgets ?? []}
 *   onEdit={(budget) => openEditModal(budget)}
 *   onDelete={(budget) => openDeleteConfirm(budget)}
 * />
 */
export function BudgetSpendingLimitsCard({
    budgets,
    periodLabel,
    currencySymbol = "$",
    className,
    availablePeriods = DEFAULT_PERIODS,
    defaultPeriod,
    onEdit,
    onDelete,
}: BudgetSpendingLimitsCardProps) {
    const [activePeriod, setActivePeriod] = useState<BudgetPeriod>(
        defaultPeriod ?? availablePeriods[0] ?? "MONTHLY"
    );

    const visibleBudgets = budgets.filter((b) => b.period === activePeriod);

    const resolvedPeriodLabel = periodLabel ?? formatPeriodLabel(activePeriod, visibleBudgets);
    const hasActions = Boolean(onEdit || onDelete);

    return (
        <div className={cn("rounded-[1.2rem] border border-outline/30 bg-surface p-6 shadow-card", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-on-surface">{headingByPeriod[activePeriod]}</h3>
                {resolvedPeriodLabel && (
                    <span className="rounded-full bg-[#f2f4f6] px-3 py-1 text-xs font-bold text-on-surface-variant">
                        {resolvedPeriodLabel}
                    </span>
                )}
            </div>

            {/* Period tabs */}
            <div className="mt-4 flex items-center gap-1 rounded-lg bg-[#f2f4f6] p-1">
                {availablePeriods.map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => setActivePeriod(p)}
                        className={cn(
                            "flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                            p === activePeriod
                                ? "bg-surface text-on-surface shadow-sm"
                                : "text-on-surface-variant hover:text-on-surface"
                        )}
                    >
                        {periodLabels[p]}
                    </button>
                ))}
            </div>

            {/* Rows */}
            <div className="mt-5 flex flex-col gap-5">
                {visibleBudgets.length === 0 ? (
                    <p className="py-6 text-center text-sm text-on-surface-variant">
                        No {periodLabels[activePeriod].toLowerCase()} budgets set yet.
                    </p>
                ) : (
                    visibleBudgets.map((budget) => {
                        const Icon = categoryIcons[budget.category] ?? CircleHelp;
                        const status = statusConfig[budget.status];
                        const isOverBudget = budget.status === "OVER_BUDGET";
                        const barWidth = Math.min(Math.max(budget.progressPercentage, 0), 100);

                        return (
                            <div key={budget.id}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#d6e3ff] text-on-surface">
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-on-surface">{budget.name}</p>
                                            <p
                                                className={cn(
                                                    "text-xs font-medium",
                                                    isOverBudget ? "text-red-600" : "text-on-surface-variant"
                                                )}
                                            >
                                                {isOverBudget
                                                    ? `Over budget by: ${formatCurrency(Math.abs(budget.remainingAmount), currencySymbol)}`
                                                    : `Remaining: ${formatCurrency(budget.remainingAmount, currencySymbol)}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-bold text-on-surface">
                                                {formatCurrency(budget.currentSpent, currencySymbol)} /{" "}
                                                {formatCurrency(budget.targetAmount, currencySymbol)}
                                            </p>
                                            <span
                                                className={cn(
                                                    "mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                                                    status.badgeClass
                                                )}
                                            >
                                                {status.label}
                                            </span>
                                        </div>

                                        {hasActions && (
                                            <ActionsMenu
                                                actions={[
                                                    ...(onEdit
                                                        ? [{ label: "Edit Budget", icon: Pencil, onClick: () => onEdit(budget) }]
                                                        : []),
                                                    ...(onDelete
                                                        ? [
                                                            {
                                                                label: "Delete Budget",
                                                                icon: Trash2,
                                                                onClick: () => onDelete(budget),
                                                                variant: "destructive" as const,
                                                            },
                                                        ]
                                                        : []),
                                                ]}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-outline/15">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-500", status.barClass)}
                                        style={{ width: `${barWidth}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}