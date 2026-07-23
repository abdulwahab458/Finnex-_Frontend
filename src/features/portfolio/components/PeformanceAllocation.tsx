
import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioAllocationData } from "../types/portfolio.types";

export interface PortfolioAllocationChartProps {
    allocation: PortfolioAllocationData[] | undefined;
    isLoading: boolean;
    isError: boolean;
    currencySymbol?: string;
    className?: string;
}

// Cycles through for however many sectors come back — matches the accent
// colors already used elsewhere (blue/green/amber/red/indigo) plus a few
// extras in case there are more than 5 sectors.
const SECTOR_COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // indigo/violet
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f97316", // orange
];

function formatCurrency(value: number, symbol: string, compact = false): string {
    return `${symbol}${value.toLocaleString("en-IN", {
        notation: compact ? "compact" : "standard",
        maximumFractionDigits: compact ? 1 : 2,
        minimumFractionDigits: compact ? 0 : 2,
    })}`;
}

function CustomTooltip({
    active,
    payload,
    currencySymbol,
}: {
    active?: boolean;
    payload?: Array<{ payload: PortfolioAllocationData & { color: string } }>;
    currencySymbol: string;
}) {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;

    return (
        <div className="rounded-lg border border-outline/30 bg-surface px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <p className="text-xs font-medium text-on-surface-variant">{item.sector}</p>
            </div>
            <p className="mt-0.5 text-sm font-bold text-on-surface">
                {formatCurrency(item.currentValue, currencySymbol)}
            </p>
            <p className="text-xs text-on-surface-variant">{item.percentage.toFixed(2)}%</p>
        </div>
    );
}

/**
 * Sector allocation donut chart. Same presentational pattern as
 * PortfolioPerformanceChart — data/loading/error come in as props, the
 * page owns fetching:
 *
 * const { allocation, isLoading, isError } = usePortfolioAllocation(portfolioId);
 *
 * <PortfolioAllocationChart allocation={allocation} isLoading={isLoading} isError={isError} />
 */
export function PortfolioAllocationChart({
    allocation,
    isLoading,
    isError,
    currencySymbol = "₹",
    className,
}: PortfolioAllocationChartProps) {
    const sectors = allocation ?? [];

    const chartData = useMemo(
        () => sectors.map((s, i) => ({ ...s, color: SECTOR_COLORS[i % SECTOR_COLORS.length] })),
        [sectors]
    );

    const totalValue = useMemo(
        () => sectors.reduce((sum, s) => sum + s.currentValue, 0),
        [sectors]
    );

    return (
        <div className={cn("rounded-2xl border  h-full border-outline/30 bg-surface p-6 shadow-card", className)}>
            {/* Header */}
            <div>
                <h3 className="text-xl font-bold text-on-surface">Allocation</h3>
                <p className="text-xs text-on-surface-variant">By sector</p>
            </div>

            {/* Body */}
            <div className="mt-8">
                {isLoading ? (
                    <div className="flex h-56 items-center justify-center text-on-surface-variant">
                        <Loader2 size={20} className="animate-spin" />
                    </div>
                ) : isError || sectors.length === 0 ? (
                    <div className="flex h-56 items-center justify-center text-sm text-on-surface-variant">
                        No allocation data available.
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        {/* Donut */}
                        <div className="relative h-56 w-56 shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="percentage"
                                        nameKey="sector"
                                        innerRadius="65%"
                                        outerRadius="100%"
                                        paddingAngle={chartData.length > 1 ? 2 : 0}
                                        strokeWidth={0}
                                    >
                                        {chartData.map((entry) => (
                                            <Cell key={entry.sector} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center label */}
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                                    Total
                                </p>
                                <p className="text-lg font-bold text-on-surface">
                                    {formatCurrency(totalValue, currencySymbol, true)}
                                </p>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex w-full flex-col gap-3">
                            {chartData.map((sector) => (
                                <div key={sector.sector} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                                            style={{ backgroundColor: sector.color }}
                                        />
                                        <span className="text-sm font-medium text-on-surface">{sector.sector}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-on-surface">
                                            {sector.percentage.toFixed(2)}%
                                        </p>
                                        <p className="text-xs text-on-surface-variant">
                                            {formatCurrency(sector.currentValue, currencySymbol)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}