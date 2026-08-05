import React from "react";
import {
  House,
  Car,
  Wallet,
  GraduationCap,
  Briefcase,
  CircleHelp,
  Pencil,
  Trash2,
  Banknote,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionsMenu } from "@/components/menu/Actionmenu";
import type { Loan, LoanType, LoanStatus } from "@/features/reports/types/loans.types";

export interface LoanCardProps {
  loan: Loan;
  onEdit?: (loan: Loan) => void;
  onDelete?: (loan: Loan) => void;
  /** Optional — pass this to show a "Make Payment" button at the bottom.
   *  Automatically hidden for CLOSED loans regardless, since there's
   *  nothing left to pay off. */
  onMakePayment?: (loan: Loan) => void;
  currencySymbol?: string;
  className?: string;
}

const loanTypeIcons: Record<LoanType, LucideIcon> = {
  HOME: House,
  AUTO: Car,
  PERSONAL: Wallet,
  EDUCATION: GraduationCap,
  BUSINESS: Briefcase,
  OTHER: CircleHelp,
};

const statusConfig: Record<LoanStatus, { label: string; badgeClass: string }> = {
  ACTIVE: { label: "Active", badgeClass: "bg-[#e5f4f0] text-success" },
  CLOSED: { label: "Closed", badgeClass: "bg-gray-100 text-gray-600" },
};

function formatCurrency(value: number, symbol: string): string {
  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Loan overview tile. Progress is derived, not a field on Loan itself:
 * paidOffPercent = (principalAmount - outstandingBalance) / principalAmount.
 *
 * `onEdit`/`onDelete` render as an ActionsMenu (three-dot); `onMakePayment`
 * renders as a full-width button at the bottom, same layout pattern as
 * GoalCard's "Contribute" button — and is hidden automatically once the
 * loan is CLOSED, regardless of whether the prop was passed.
 *
 * Usage:
 * <LoanCard
 *   loan={loan}
 *   onEdit={(l) => openEditModal(l)}
 *   onDelete={(l) => openDeleteConfirm(l)}
 *   onMakePayment={(l) => openPaymentModal(l)}
 * />
 */
export function LoanCard({
  loan,
  onEdit,
  onDelete,
  onMakePayment,
  currencySymbol = "₹",
  className,
}: LoanCardProps) {
  const Icon = loanTypeIcons[loan.loanType] ?? CircleHelp;
  const status = statusConfig[loan.status];
  const isClosed = loan.status === "CLOSED";

  const paidOff = loan.principalAmount - loan.outstandingBalance;
  const paidOffPercent =
    loan.principalAmount > 0 ? Math.min(Math.max((paidOff / loan.principalAmount) * 100, 0), 100) : 0;

  const hasActions = Boolean(onEdit || onDelete);
  const showPaymentButton = Boolean(onMakePayment) && !isClosed;

  return (
    <div className={cn("rounded-[1.2rem] border border-outline/30 bg-surface p-5 shadow-card", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d6e3ff] text-on-surface">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-on-surface">{loan.loanName}</p>
            <p className="truncate text-xs text-on-surface-variant">{loan.lenderName}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", status.badgeClass)}>
            {status.label}
          </span>
          {hasActions && (
            <ActionsMenu
              actions={[
                ...(onEdit ? [{ label: "Edit Loan", icon: Pencil, onClick: () => onEdit(loan) }] : []),
                ...(onDelete
                  ? [
                      {
                        label: "Delete Loan",
                        icon: Trash2,
                        onClick: () => onDelete(loan),
                        variant: "destructive" as const,
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
            Outstanding
          </p>
          <p className="mt-1 text-sm font-bold text-on-surface">
            {formatCurrency(loan.outstandingBalance, currencySymbol)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
            Principal
          </p>
          <p className="mt-1 text-sm font-semibold text-on-surface-variant">
            {formatCurrency(loan.principalAmount, currencySymbol)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
            Interest Rate
          </p>
          <p className="mt-1 text-sm font-semibold text-on-surface">{loan.interestRate.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
            EMI
          </p>
          <p className="mt-1 text-sm font-semibold text-on-surface">
            {formatCurrency(loan.emiAmount, currencySymbol)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <span>{Math.round(paidOffPercent)}% paid off</span>
          <span>
            {new Date(loan.startDate).getFullYear()} – {new Date(loan.endDate).getFullYear()}
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-outline/15">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              isClosed ? "bg-gray-400" : "bg-gray-900"
            )}
            style={{ width: `${paidOffPercent}%` }}
          />
        </div>
      </div>

      {showPaymentButton && (
        <button
          type="button"
          onClick={() => onMakePayment!(loan)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-[1.2rem] bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          <Banknote size={16} />
          Record Payment
        </button>
      )}
    </div>
  );
}

export default LoanCard;