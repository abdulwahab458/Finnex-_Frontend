
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TransactionStatCardProps {
    title: string;
    value?: number;
    icon: LucideIcon;
    subtitle?: string;
    /** Colors the icon chip + background glow. Defaults to the app's primary blue. */
    accent?: "blue" | "green" | "red" | "amber" | "indigo";
    /** Optional small trend badge next to the icon, e.g. { value: "+12.4%", direction: "up" } */
    trend?: { value: string; direction: "up" | "down" };
}

const accentMap: Record<NonNullable<TransactionStatCardProps["accent"]>, { chip: string; glow: string }> = {
    blue: { chip: "bg-[#d6e3ff] text-[#1a56db]", glow: "bg-[#d6e3ff]" },
    green: { chip: "bg-[#e5f4f0] text-emerald-600", glow: "bg-[#c8ece1]" },
    red: { chip: "bg-[#fdecec] text-red-600", glow: "bg-[#fbd6d6]" },
    amber: { chip: "bg-amber-50 text-amber-600", glow: "bg-amber-100" },
    indigo: { chip: "bg-indigo-50 text-indigo-600", glow: "bg-indigo-100" },
};

/**
 * Dashboard stat tile matching the app's existing visual language (the same
 * pastel icon-chip treatment used for account-type icons in the table, the
 * on-surface / on-surface-variant text tokens, rounded-xl surfaces).
 *
 * `accent` and `trend` are optional — the card looks complete with just
 * title/value/icon, and picks them up as nice-to-haves when provided.
 *
 * Usage:
 * <TransactionStatCard
 *   title="Total Balance"
 *   value="$48,230.00"
 *   icon={Wallet}
 *   subtitle="Across 4 accounts"
 *   accent="blue"
 *   trend={{ value: "+4.2%", direction: "up" }}
 * />
 */
export function TransactionStatCard({
    title,
    value,
    icon: Icon,
    subtitle,
    accent = "blue",
    trend,
}: TransactionStatCardProps) {
    const colors = accentMap[accent];

    return (
        <div className="group relative overflow-hidden rounded-4xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            {/* decorative glow blob, echoes the icon accent color */}
            <div
                className={cn(
                    "pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70",
                    colors.glow
                )}
            />

            <div className="relative flex items-start justify-between">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", colors.chip)}>
                    <Icon size={20} />
                </div>

                {trend && (
                    <span
                        className={cn(
                            "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                            trend.direction === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        )}
                    >
                        {trend.direction === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trend.value}
                    </span>
                )}
            </div>

            <p className="relative mt-4 text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                {title}
            </p>
            <p className="relative mt-1 text-2xl font-bold tracking-tight text-on-surface">${value}</p>
            {subtitle && <p className="relative mt-1 text-xs text-on-surface-variant">{subtitle}</p>}
        </div>
    );
}