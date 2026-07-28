import { type LucideIcon, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    iconClass?: string;
    /** Small trend line under the value, e.g. "+4.2% vs last month". Positive
     *  numbers render green with an up arrow, negative render red with a
     *  down arrow. Omit for a plain, neutral subtext. */
    trendValue?: number;
    trendLabel?: string;
    /** Plain subtext shown instead of a trend, e.g. "Updated just now". */
    subtext?: string;
    className?: string;
    /** Makes the value larger — used for the hero "Total Balance" card. */
    emphasize?: boolean;
}

export function StatCard({
    label,
    value,
    icon: Icon,
    iconClass = "bg-[#f2f4f6] text-on-surface",
    trendValue,
    trendLabel,
    subtext,
    className,
    emphasize = false,
}: StatCardProps) {
    const isPositive = typeof trendValue === "number" && trendValue >= 0;

    return (
        <div
            className={cn(
                "rounded-2xl border border-outline/20 bg-surface p-5 shadow-card",
                className
            )}
        >
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-on-surface-variant">{label}</span>
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", iconClass)}>
                    <Icon size={16} />
                </div>
            </div>

            <p
                className={cn(
                    "mt-3 font-semibold tracking-tight text-on-surface",
                    emphasize ? "text-3xl" : "text-2xl"
                )}
            >
                {value}
            </p>

            {typeof trendValue === "number" ? (
                <div
                    className={cn(
                        "mt-2 flex items-center gap-1 text-xs font-semibold",
                        isPositive ? "text-success" : "text-red-600"
                    )}
                >
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>
                        {isPositive ? "+" : ""}
                        {trendValue.toFixed(2)}%
                    </span>
                    {trendLabel && <span className="font-normal text-on-surface-variant">{trendLabel}</span>}
                </div>
            ) : subtext ? (
                <p className="mt-2 text-xs text-on-surface-variant">{subtext}</p>
            ) : null}
        </div>
    );
}