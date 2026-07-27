import type { ApiResponse } from "@/types/api";

export type BudgetPeriod = "MONTHLY" | "QUARTERLY" | "YEARLY" | "CUSTOM";

export type BudgetStatus = "ON_TRACK" | "WARNING" | "OVER_BUDGET";

// Same set as TransactionCategory — if that type already exists in your
// transactions feature, prefer importing it from there instead of this
// local copy, so the two features can't drift out of sync with each other.
export type BudgetCategory =
    | "FOOD_AND_DINING"
    | "SHOPPING"
    | "GROCERIES"
    | "TRANSPORT"
    | "HEALTHCARE"
    | "INSURANCE"
    | "UTILITIES"
    | "ENTERTAINMENT"
    | "INVESTMENT"
    | "DIVIDEND"
    | "SALARY"
    | "TRANSFER"
    | "EDUCATION"
    | "RENT"
    | "TAX"
    | "OTHER";

export interface Budget {
    id: string;
    name: string;
    category: BudgetCategory;
    targetAmount: number;
    currentSpent: number;
    remainingAmount: number;
    progressPercentage: number;
    status: BudgetStatus;
    period: BudgetPeriod;
    startDate: string; // "2026-07-01"
    endDate: string; // "2026-07-31"
}


export interface CreateBudgetPayload {
    name: string;
    category: BudgetCategory;
    targetAmount: number;
    period: BudgetPeriod;
    startDate: string;
    endDate: string;
}

export type BudgetListResponse = ApiResponse<Budget[]>;


export type GoalCategory =
    | "RETIREMENT"
    | "HOME"
    | "EDUCATION"
    | "EMERGENCY_FUND"
    | "TRAVEL"
    | "VEHICLE"
    | "WEDDING"
    | "HEALTH"
    | "OTHER";

export type GoalStatus =
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export interface Goal {
    id: string;
    name: string;
    category: GoalCategory;
    targetAmount: number;
    currentAmount: number;
    remainingAmount: number;
    progressPercentage: number;
    status: GoalStatus;
    /** ISO date string, e.g. "2027-12-31" */
    targetDate: string;
}
    export type GoalResponse = ApiResponse<Goal[]>;