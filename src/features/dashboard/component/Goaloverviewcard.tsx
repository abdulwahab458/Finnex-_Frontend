import { Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GoalSummary } from "../types/dashboard.types";
import { formatCurrency } from "./Categorymeta";


export interface GoalOverviewCardProps {
    goalSummary: GoalSummary;
    currencySymbol?: string;
    className?: string;
}

export function GoalOverviewCard({ goalSummary, currencySymbol = "$", className }: GoalOverviewCardProps) {
    const savedPercentage =
        goalSummary.totalTargetAmount > 0
            ? Math.min((goalSummary.totalSavedAmount / goalSummary.totalTargetAmount) * 100, 100)
            : 0;

    return (
        <div className={cn("rounded-[1.2rem] border border-outline/20 bg-surface p-5 shadow-card", className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-on-surface-variant">
                    Goals &middot; {goalSummary.totalGoals} total
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5f4f0] text-success">
                    <Target size={16} />
                </div>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight text-on-surface">
                {formatCurrency(goalSummary.totalSavedAmount, currencySymbol)}
                <span className="ml-1 text-sm font-normal text-on-surface-variant">
                    / {formatCurrency(goalSummary.totalTargetAmount, currencySymbol)}
                </span>
            </p>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-outline/10">
                <div
                    className="h-full rounded-full bg-success transition-all duration-500"
                    style={{ width: `${savedPercentage}%` }}
                />
            </div>

            <div className="mt-4 flex items-center gap-4 border-t border-outline/10 pt-3 text-xs">
                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="text-on-surface-variant">{goalSummary.completedGoals} completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                    <span className="text-on-surface-variant">{goalSummary.inProgressGoals} in progress</span>
                </div>
            </div>
        </div>
    );
}