export const AccountType = {
  CHECKING: "CHECKING",
  SAVINGS: "SAVINGS",
  INVESTMENT: "INVESTMENT",
  CREDIT: "CREDIT",
  MORTGAGE: "MORTGAGE",
} as const;

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