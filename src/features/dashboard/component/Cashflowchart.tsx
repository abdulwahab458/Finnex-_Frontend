import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

import type { CashflowPoint } from "../types/dashboard.types";
import { formatCurrency } from "./Categorymeta";

export interface CashflowChartProps {
    timeline: CashflowPoint[];
    currencySymbol?: string;
    className?: string;
}

function CashflowTooltip({
    active,
    payload,
    label,
    currencySymbol,
}: {
    active?: boolean;
    payload?: { value: number; dataKey: string }[];
    label?: string;
    currencySymbol: string;
}) {
    if (!active || !payload?.length) return null;

    const income = payload.find((p) => p.dataKey === "income")?.value ?? 0;
    const expense = payload.find((p) => p.dataKey === "expense")?.value ?? 0;

    return (
        <div className="rounded-lg border border-outline/20 bg-surface px-3 py-2 shadow-card">
            <p className="text-xs font-semibold text-on-surface">{label}</p>
            <p className="mt-1 text-xs text-success">Income: {formatCurrency(income, currencySymbol)}</p>
            <p className="text-xs text-red-500">Expense: {formatCurrency(expense, currencySymbol)}</p>
        </div>
    );
}

export function CashflowChart({ timeline, currencySymbol = "$", className }: CashflowChartProps) {
    return (
        <div className={cn("rounded-2xl border border-outline/20 bg-surface p-5 shadow-card", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-on-surface">Cashflow</h3>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-success" /> Income
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500" /> Expense
                    </span>
                </div>
            </div>

            <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeline} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#f2f4f6" />
                        <XAxis
                            dataKey="period"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#8a8f98" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#8a8f98" }}
                            tickFormatter={(v) => formatCurrency(v, currencySymbol)}
                            width={70}
                        />
                        <Tooltip content={<CashflowTooltip currencySymbol={currencySymbol} />} />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#22c55e"
                            strokeWidth={2}
                            fill="url(#incomeGradient)"
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fill="url(#expenseGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}