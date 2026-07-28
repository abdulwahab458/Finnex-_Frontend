import { Landmark, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

import type { PortfolioSummary } from "../types/dashboard.types";
import { formatCurrency } from "./Categorymeta";

export interface PortfolioSummaryCardProps {
    portfolio: PortfolioSummary;
    currencySymbol?: string;
    className?: string;
}

export function PortfolioSummaryCard({ portfolio, currencySymbol = "$", className }: PortfolioSummaryCardProps) {
    const gainLoss = portfolio.currentValue - portfolio.totalInvested;
    const isPositive = portfolio.totalReturnPercentage >= 0;

    return (
        <div className={cn("rounded-[1.2rem] border border-outline/20 bg-surface p-5 shadow-card", className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-on-surface-variant">Portfolio</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8ecff] text-indigo-600">
                    <Landmark size={16} />
                </div>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight text-on-surface">
                {formatCurrency(portfolio.currentValue, currencySymbol)}
            </p>

            <div
                className={cn(
                    "mt-2 flex items-center gap-1 text-xs font-semibold",
                    isPositive ? "text-success" : "text-red-600"
                )}
            >
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>
                    {isPositive ? "+" : ""}
                    {portfolio.totalReturnPercentage.toFixed(2)}%
                </span>
                <span className="font-normal text-on-surface-variant">
                    ({isPositive ? "+" : "-"}
                    {formatCurrency(Math.abs(gainLoss), currencySymbol)})
                </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-outline/10 pt-3 text-xs">
                <span className="text-on-surface-variant">Invested</span>
                <span className="font-medium text-on-surface">
                    {formatCurrency(portfolio.totalInvested, currencySymbol)}
                </span>
            </div>
        </div>
    );
}