export const AccountType = {
  CHECKING: "CHECKING",
  SAVINGS: "SAVINGS",
  INVESTMENT: "INVESTMENT",
  CREDIT: "CREDIT",
  MORTGAGE: "MORTGAGE",
} as const;

export type CurrencyCode = "KWD" | "USD" | "EUR" | "GBP" | "SAR" | "AED";

export type AccountType =
  (typeof AccountType)[keyof typeof AccountType];

export interface Account {
  id: string;
  accountName: string;
  maskedAccountNumber: string;
  accountType: AccountType;
  balance: number;
  availableBalance: number;
  currency: string;
  active: boolean;
  openedDate: string;
}

export type AccountsResponse = Account[];

export interface CreateAccountPayload {
  accountName: string;
  accountNumber: string;
  accountType: AccountType;
  currency: CurrencyCode;
  initialBalance: number;
}

export interface UpdateAccountPayload {
    id: string;
    accountName: string;
}

