import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

import type { CategoryAllocationItem } from "../types/dashboard.types";
import { categoryMeta, formatCurrency } from "./Categorymeta";

export interface CategoryAllocationChartProps {
    allocations: CategoryAllocationItem[];
    currencySymbol?: string;
    className?: string;
}

function AllocationTooltip({
    active,
    payload,
    currencySymbol,
}: {
    active?: boolean;
    payload?: { name: string; value: number }[];
    currencySymbol: string;
}) {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
        <div className="rounded-lg border border-outline/20 bg-surface px-3 py-2 shadow-card">
            <p className="text-xs font-semibold text-on-surface">{item.name}</p>
            <p className="text-xs text-on-surface-variant">{formatCurrency(item.value, currencySymbol)}</p>
        </div>
    );
}

export function CategoryAllocationChart({
    allocations,
    currencySymbol = "$",
    className,
}: CategoryAllocationChartProps) {
    const total = allocations.reduce((sum, a) => sum + a.amount, 0);

    const chartData = allocations
        .map((a) => ({
            name: categoryMeta[a.category]?.label ?? a.category,
            value: a.amount,
            color: categoryMeta[a.category]?.color ?? "#9ca3af",
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <div className={cn("rounded-2xl border border-outline/20 bg-surface p-5 shadow-card", className)}>
            <h3 className="text-base font-semibold text-on-surface">Spending by Category</h3>

            {chartData.length === 0 ? (
                <p className="py-10 text-center text-sm text-on-surface-variant">No spending recorded yet.</p>
            ) : (
                <>
                    <div className="mx-auto mt-2 h-48 w-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius="65%"
                                    outerRadius="100%"
                                    paddingAngle={2}
                                    stroke="none"
                                >
                                    {chartData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<AllocationTooltip currencySymbol={currencySymbol} />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 flex flex-col gap-2.5">
                        {chartData.map((entry) => {
                            const percentage = total > 0 ? (entry.value / total) * 100 : 0;
                            return (
                                <div key={entry.name} className="flex items-center gap-2.5 text-sm">
                                    <span
                                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="min-w-0 flex-1 truncate text-on-surface">{entry.name}</span>
                                    <span className="shrink-0 text-xs text-on-surface-variant">
                                        {percentage.toFixed(0)}%
                                    </span>
                                    <span className="w-16 shrink-0 text-right text-xs font-medium text-on-surface">
                                        {formatCurrency(entry.value, currencySymbol)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}