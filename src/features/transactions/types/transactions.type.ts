// transactions.type.ts

/**
 * Transaction Type
 */
export const TransactionType = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
  TRANSFER: "TRANSFER",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

/**
 * Transaction Status
 */
export const TransactionStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REVERSED: "REVERSED",
} as const;

export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

/**
 * Transaction Category
 */
export const TransactionCategory = {
  FOOD_AND_DINING: "FOOD_AND_DINING",
  SHOPPING: "SHOPPING",
  GROCERIES: "GROCERIES",
  TRANSPORT: "TRANSPORT",
  HEALTHCARE: "HEALTHCARE",
  INSURANCE: "INSURANCE",
  UTILITIES: "UTILITIES",
  ENTERTAINMENT: "ENTERTAINMENT",
  INVESTMENT: "INVESTMENT",
  DIVIDEND: "DIVIDEND",
  SALARY: "SALARY",
  TRANSFER: "TRANSFER",
  EDUCATION: "EDUCATION",
  RENT: "RENT",
  TAX: "TAX",
  OTHER: "OTHER",
} as const;

export type TransactionCategory =
  (typeof TransactionCategory)[keyof typeof TransactionCategory];

/**
 * Transaction
 */
export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  status: TransactionStatus;
  transactionDate: string;
  merchantName: string;
  notes: string;
  attachmentUrl: string | null;
}

/**
 * Paginated Transactions
 */
export interface TransactionsPage {
  content: Transaction[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}




export interface TransactionSummary {
  totalBalance: number;
  pendingAmount: number;
  pendingTransactions: number;
  monthlySpend: number;
  dividends: number;
}

export interface TransactionSummaryResponse {
  success: boolean;
  message: string;
  data: TransactionSummary;
  errorCode: string | null;
  timestamp: string;
}