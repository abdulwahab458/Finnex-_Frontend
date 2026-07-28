import { cn } from "@/lib/utils";

import type { RecentActivityItem } from "../types/dashboard.types";
import { categoryMeta, formatCurrency } from "./Categorymeta";

export interface RecentActivityCardProps {
    activities: RecentActivityItem[];
    currencySymbol?: string;
    className?: string;
    onViewAll?: () => void;
}

function formatRelativeDate(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays === 1) return "Tomorrow";

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RecentActivityCard({
    activities,
    currencySymbol = "$",
    className,
    onViewAll,
}: RecentActivityCardProps) {
    return (
        <div className={cn("rounded-2xl border border-outline/20 bg-surface p-5 shadow-card", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-on-surface">Recent Activity</h3>
                {onViewAll && (
                    <button
                        type="button"
                        onClick={onViewAll}
                        className="text-sm font-medium text-on-surface-variant hover:text-on-surface"
                    >
                        View all
                    </button>
                )}
            </div>

            <div className="mt-2 divide-y divide-outline/10">
                {activities.length === 0 ? (
                    <p className="py-8 text-center text-sm text-on-surface-variant">No recent transactions.</p>
                ) : (
                    activities.map((activity) => {
                        const meta = categoryMeta[activity.category];
                        const Icon = meta?.icon;
                        const isCredit = activity.type === "CREDIT";

                        return (
                            <div key={activity.transactionId} className="flex items-center gap-3 py-3">
                                <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: `${meta?.color ?? "#9ca3af"}1a`,
                                        color: meta?.color ?? "#9ca3af",
                                    }}
                                >
                                    {Icon && <Icon size={16} />}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-on-surface">{activity.title}</p>
                                    <p className="text-xs text-on-surface-variant">
                                        {meta?.label ?? activity.category} &middot;{" "}
                                        {formatRelativeDate(activity.transactionDate)}
                                    </p>
                                </div>

                                <span
                                    className={cn(
                                        "shrink-0 text-sm font-semibold",
                                        isCredit ? "text-success" : "text-on-surface"
                                    )}
                                >
                                    {isCredit ? "+" : "-"}
                                    {formatCurrency(activity.amount, currencySymbol)}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}