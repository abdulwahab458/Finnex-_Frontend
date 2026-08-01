import type { ApiResponse } from "@/types/api";

// Only "HOME" appeared in your sample data — the rest are a reasonable
// guess at common loan types. Adjust to match your backend's real enum.
export type LoanType = "HOME" | "AUTO" | "PERSONAL" | "EDUCATION" | "BUSINESS" | "OTHER";

export type LoanStatus = "ACTIVE" | "CLOSED";

export interface Loan {
  id: string;
  loanName: string;
  loanType: LoanType;
  lenderName: string;
  principalAmount: number;
  outstandingBalance: number;
  interestRate: number; // e.g. 8.50 (percent)
  emiAmount: number;
  startDate: string; // "2026-01-01"
  endDate: string; // "2046-01-01"
  status: LoanStatus;
}

export type LoanListResponse = ApiResponse<Loan[]>;

/** POST /loans — outstandingBalance/status/id are server-set. */
export interface CreateLoanPayload {
  loanName: string;
  loanType: LoanType;
  lenderName: string;
  principalAmount: number;
  interestRate: number;
  emiAmount: number;
  startDate: string;
  endDate: string;
}

/** PUT /loans/{id} — no principalAmount: once a loan is created, its
 *  original principal can't be edited (matches your sample update payload,
 *  which omits it — presumably it can only move via recorded payments). */
export type UpdateLoanPayload = Omit<CreateLoanPayload, "principalAmount">;

/** POST /loans/{id}/payments */
export interface LoanPaymentPayload {
  amount: number;
}