import  { useEffect, useState } from "react";
import { Briefcase, Pencil, Trash2, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Portfolio, RiskLevel } from "../types/portfolio.types";
import { ActionsMenu } from "@/components/menu/Actionmenu";

export interface PortfolioCardProps {
  portfolio: Portfolio;
  onClick?: (portfolio: Portfolio) => void;
  onEdit?: (portfolio: Portfolio) => void;
  onDelete?: (portfolio: Portfolio) => void;
  /** Defaults to ₹ to match the rest of the app (e.g. the transactions table) */
  currencySymbol?: string;
  icon?: LucideIcon;
}

const riskConfig: Record<RiskLevel, { label: string; badgeClass: string }> = {
  LOW: { label: "Low Risk", badgeClass: "bg-[#e5f4f0] text-success" },
  MODERATE: { label: "Moderate Risk", badgeClass: "bg-[#fff7e6] text-warning" },
  HIGH: { label: "High Risk", badgeClass: "bg-[#fdecec] text-red-600" },
  AGGRESSIVE: { label: "Aggressive", badgeClass: "bg-red-100 text-red-700" },
};

function formatCurrency(value: number, symbol: string): string {
  return `${symbol}${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Overview tile for a single portfolio, meant to be rendered in a grid on
 * the Portfolio landing page. Matches the app's existing card language
 * (rounded-[1rem] surface, border-outline/30, shadow-card, pastel icon
 * chip, success/warning/red semantic colors) rather than introducing a
 * new one.
 *
 * The return-percent bar fills in on mount (0 → actual width) purely with
 * a CSS transition — a small bit of motion without anything gimmicky.
 *
 * `onEdit`/`onDelete` are both optional — pass either (or both) and an
 * ActionsMenu (three-dot) appears in the header; pass neither and the
 * card renders exactly as before, no menu at all. Clicking the menu (or
 * anything inside it) stops propagation, so it never triggers `onClick`
 * on the card underneath it.
 *
 * The whole card is a <div role="button"> rather than a real <button>
 * now — that's what lets the ActionsMenu's own trigger button live
 * inside it without nesting an interactive <button> inside another
 * <button>, which is invalid HTML.
 *
 * Usage:
 * {portfolios.map((p) => (
 *   <PortfolioCard
 *     key={p.id}
 *     portfolio={p}
 *     onClick={(p) => navigate(`/portfolio/${p.id}`)}
 *     onEdit={(p) => openEditModal(p)}
 *     onDelete={(p) => openDeleteConfirm(p)}
 *   />
 * ))}
 */
export function PortfolioCard({
  portfolio,
  onClick,
  onEdit,
  onDelete,
  currencySymbol = "₹",
  icon: Icon = Briefcase,
}: PortfolioCardProps) {
  const { name, riskLevel, totalInvested, currentValue, totalReturnPercent } = portfolio;
  const risk = riskConfig[riskLevel];

  const isPositive = totalReturnPercent > 0;
  const isNegative = totalReturnPercent < 0;
  const isFlat = totalReturnPercent === 0;

  const returnColorClass = isPositive ? "text-success" : isNegative ? "text-red-600" : "text-on-surface-variant";
  const barColorClass = isPositive ? "bg-success" : isNegative ? "bg-red-500" : "bg-outline";

  const hasActions = Boolean(onEdit || onDelete);

  // Animate the return bar filling in from 0 on mount, instead of
  // rendering at full width immediately.
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    const target = Math.min(Math.abs(totalReturnPercent), 100);
    const raf = requestAnimationFrame(() => setBarWidth(target));
    return () => cancelAnimationFrame(raf);
  }, [totalReturnPercent]);

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={() => onClick?.(portfolio)}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(portfolio);
        }
      }}
      className={cn(
        "group relative w-full overflow-hidden rounded-[1rem] border border-outline/30 bg-surface p-5 text-left shadow-card",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-outline/50 hover:shadow-lg",
        onClick ? "cursor-pointer" : "cursor-default"
      )}
    >
      {/* Header: icon + risk badge + actions menu */}
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d6e3ff] text-on-surface transition-transform duration-300 group-hover:scale-105">
          <Icon size={20} />
        </div>

        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", risk.badgeClass)}>
            {risk.label}
          </span>

          {hasActions && (
            <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
              <ActionsMenu
                actions={[
                  ...(onEdit
                    ? [{ label: "Edit Portfolio", icon: Pencil, onClick: () => onEdit(portfolio) }]
                    : []),
                  ...(onDelete
                    ? [
                        {
                          label: "Delete Portfolio",
                          icon: Trash2,
                          onClick: () => onDelete(portfolio),
                          variant: "destructive" as const,
                        },
                      ]
                    : []),
                ]}
              />
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="mt-4 truncate text-base font-semibold text-on-surface">{name}</h3>

      {/* Invested / Current value */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
            Invested
          </p>
          <p className="mt-1 text-sm font-semibold text-on-surface">
            {formatCurrency(totalInvested, currencySymbol)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
            Current Value
          </p>
          <p className="mt-1 text-sm font-semibold text-on-surface">
            {formatCurrency(currentValue, currencySymbol)}
          </p>
        </div>
      </div>

      {/* Return */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
            Total Return
          </span>
          <span className={cn("flex items-center gap-1 text-sm font-bold", returnColorClass)}>
            {!isFlat &&
              (isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />)}
            {isPositive ? "+" : ""}
            {totalReturnPercent.toFixed(2)}%
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-outline/20">
          <div
            className={cn("h-full rounded-full transition-all duration-700 ease-out", barColorClass)}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}