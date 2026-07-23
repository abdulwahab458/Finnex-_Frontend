import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PORTFOLIO_PERIODS, type PortfolioPeriod, type PortfolioPerformanceData, type PortfolioPerformancePoint } from "../types/portfolio.types";

export interface PortfolioPerformanceChartProps {
  performance: PortfolioPerformanceData | undefined;
  isLoading: boolean;
  isError: boolean;
  period: PortfolioPeriod;
  onPeriodChange: (period: PortfolioPeriod) => void;
  currencySymbol?: string;
  className?: string;
}

const periodLabels: Record<PortfolioPeriod, string> = {
  W1: "1W",
  M1: "1M",
  YTD: "YTD",
  ALL: "ALL",
};

function formatCurrency(value: number, symbol: string, compact = false): string {
  return `${symbol}${value.toLocaleString("en-IN", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
    minimumFractionDigits: compact ? 0 : 2,
  })}`;
}

/** Tick label granularity changes with the selected period, same idea as
 *  a real trading chart: daily labels for 1W, "Jul 8" style for 1M, and
 *  just the month for YTD/ALL where showing every date would be unreadable. */
function formatXAxisTick(dateStr: string, period: PortfolioPeriod): string {
  const date = new Date(dateStr);
  if (period === "W1") return date.toLocaleDateString("en-US", { weekday: "short" });
  if (period === "M1") return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return date.toLocaleDateString("en-US", { month: "short" });
}

function CustomTooltip({
  active,
  payload,
  currencySymbol,
}: {
  active?: boolean;
  payload?: Array<{ payload: PortfolioPerformancePoint }>;
  currencySymbol: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-outline/30 bg-surface px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-on-surface-variant">
        {new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <p className="mt-0.5 text-sm font-bold text-on-surface">
        {formatCurrency(point.portfolioValue, currencySymbol)}
      </p>
    </div>
  );
}

/**
 * Portfolio value-over-time chart with a period switcher (1W / 1M / YTD /
 * ALL). Purely presentational — it takes `performance` / `isLoading` /
 * `isError` / `period` as props rather than fetching internally, so the
 * page owns the data-fetching and period state:
 *
 * const [period, setPeriod] = useState<PortfolioPeriod>("M1");
 * const { performance, isLoading, isError } = usePortfolioPerformance(portfolioId, period);
 *
 * <PortfolioPerformanceChart
 *   performance={performance}
 *   isLoading={isLoading}
 *   isError={isError}
 *   period={period}
 *   onPeriodChange={setPeriod}
 * />
 */
export function PortfolioPerformanceChart({
  performance,
  isLoading,
  isError,
  period,
  onPeriodChange,
  currencySymbol = "₹",
  className,
}: PortfolioPerformanceChartProps) {
  const timeline = performance?.timeline ?? [];

  // A few % of breathing room above/below the real min/max so the line
  // doesn't touch the top/bottom edge of the chart.
  const yDomain = useMemo((): [number, number] => {
    if (!performance) return [0, 0];
    const { minPortfolioValue, maxPortfolioValue } = performance;
    const padding = (maxPortfolioValue - minPortfolioValue) * 0.1 || maxPortfolioValue * 0.05;
    return [Math.max(0, minPortfolioValue - padding), maxPortfolioValue + padding];
  }, [performance]);

  // Keep roughly 6 visible x-axis labels no matter how many data points
  // the period returns (7 for 1W vs. ~95+ for ALL).
  const tickInterval = Math.max(0, Math.floor(timeline.length / 6) - 1);

  return (
    <div className={cn("rounded-2xl border border-outline/30 bg-surface p-6 shadow-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-on-surface">Performance</h3>
        <div className="flex items-center gap-1 rounded-lg bg-[#f2f4f6] p-1">
          {PORTFOLIO_PERIODS.map((p: PortfolioPeriod) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                p === period
                  ? "bg-surface text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4 h-64">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-on-surface-variant">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : isError || timeline.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-on-surface-variant">
            No performance data available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolioValueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={tickInterval}
                tickFormatter={(value) => formatXAxisTick(value, period)}
                tick={{ fontSize: 11, fill: "var(--color-on-surface-variant, #8a8a8a)" }}
              />

              <YAxis
                domain={yDomain}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatCurrency(value, currencySymbol, true)}
                tick={{ fontSize: 11, fill: "var(--color-on-surface-variant, #8a8a8a)" }}
                width={64}
              />

              <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />

              <Area
                dataKey="portfolioValue"
                type="natural"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#portfolioValueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer */}
      {performance && timeline.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-outline/20 pt-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
              Range
            </p>
            <p className="mt-0.5 text-sm font-semibold text-on-surface">
              {formatCurrency(performance.minPortfolioValue, currencySymbol)} —{" "}
              {formatCurrency(performance.maxPortfolioValue, currencySymbol)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
            <span className="text-sm font-medium text-on-surface-variant">Portfolio Value</span>
          </div>
        </div>
      )}
    </div>
  );
}