

// Transactions reuse the same category set as budgets — aliased here so

import type { BudgetCategory } from "@/features/budgets/types/budget.types";

// dashboard code reads naturally without implying a different enum.
export type TransactionCategory = BudgetCategory;

export interface FinancialOverview {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    netSavings: number;
    savingsRate: number;
}

export interface PortfolioSummary {
    totalInvested: number;
    currentValue: number;
    totalReturnPercentage: number;
}

export interface BudgetSummary {
    totalBudgets: number;
    onTrack: number;
    warning: number;
    overBudget: number;
    totalBudgetAmount: number;
    totalSpent: number;
}

export interface GoalSummary {
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    totalSavedAmount: number;
    totalTargetAmount: number;
}

export type FinancialHealthStatus =
    | "EXCELLENT"
    | "GOOD"
    | "FAIR"
    | "NEEDS_IMPROVEMENT"
    | "POOR";

export interface FinancialHealth {
    score: number;
    status: FinancialHealthStatus;
}

export interface DashboardOverview {
    financialOverview: FinancialOverview;
    portfolioSummary: PortfolioSummary;
    budgetSummary: BudgetSummary;
    goalSummary: GoalSummary;
    financialHealth: FinancialHealth;
}

export interface CashflowPoint {
    period: string;
    income: number;
    expense: number;
}

export interface CashflowResponse {
    timeline: CashflowPoint[];
}

export interface CategoryAllocationItem {
    category: TransactionCategory;
    amount: number;
}

export type TransactionDirection = "CREDIT" | "DEBIT";

export interface RecentActivityItem {
    transactionId: string;
    title: string;
    category: TransactionCategory;
    type: TransactionDirection;
    amount: number;
    transactionDate: string;
}