import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FinancialHealth, FinancialHealthStatus } from "../types/dashboard.types";

const statusConfig: Record<FinancialHealthStatus, { label: string; color: string; badgeClass: string }> = {
    EXCELLENT: { label: "Excellent", color: "#22c55e", badgeClass: "bg-[#e5f4f0] text-success" },
    GOOD: { label: "Good", color: "#16a34a", badgeClass: "bg-[#e5f4f0] text-success" },
    FAIR: { label: "Fair", color: "#eab308", badgeClass: "bg-[#fff7e6] text-warning" },
    NEEDS_IMPROVEMENT: { label: "Needs improvement", color: "#f97316", badgeClass: "bg-[#fff2e5] text-orange-600" },
    POOR: { label: "Poor", color: "#dc2626", badgeClass: "bg-[#fdecec] text-red-600" },
};

export interface FinancialHealthCardProps {
    health: FinancialHealth;
    className?: string;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FinancialHealthCard({ health, className }: FinancialHealthCardProps) {
    const status = statusConfig[health.status];
    const score = Math.min(Math.max(health.score, 0), 100);
    const dashOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

    return (
        <div
            className={cn(
                "flex items-center gap-5 rounded-[1.2rem] border border-outline/20 bg-surface p-5 shadow-card",
                className
            )}
        >
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
                    <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#f2f4f6" strokeWidth="9" />
                    <circle
                        cx="50"
                        cy="50"
                        r={RADIUS}
                        fill="none"
                        stroke={status.color}
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={dashOffset}
                        className="transition-all duration-700 ease-out"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-bold text-on-surface">{score}</span>
                    <span className="text-[10px] text-on-surface-variant">/ 100</span>
                </div>
            </div>

            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <Activity size={14} className="text-on-surface-variant" />
                    <span className="text-sm font-medium text-on-surface-variant">Financial Health</span>
                </div>
                <span
                    className={cn(
                        "mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold",
                        status.badgeClass
                    )}
                >
                    {status.label}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                    Based on your savings rate, budget adherence, and goal progress.
                </p>
            </div>
        </div>
    );
}