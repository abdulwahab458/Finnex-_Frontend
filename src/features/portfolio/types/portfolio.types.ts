export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "AGGRESSIVE";
export type ConfirmAction = "create" | "update" | "delete";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode: string | null;
  timestamp: string;
}

export interface Portfolio {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  totalInvested: number;
  currentValue: number;
  totalReturnPercent: number;
}

export interface PortfolioListResponse {
  success: boolean;
  message: string;
  data: Portfolio[];
  errorCode: string | null;
}


export const PORTFOLIO_PERIODS = ["W1", "M1", "YTD", "ALL"] as const;
export type PortfolioPeriod = (typeof PORTFOLIO_PERIODS)[number];
 
export interface PortfolioPerformancePoint {
  date: string; // "2026-07-21"
  portfolioValue: number;
}
 
export interface PortfolioPerformanceData {
  minPortfolioValue: number;
  maxPortfolioValue: number;
  timeline: PortfolioPerformancePoint[];
}

export interface PortfolioPerformanceResponse {
  success: boolean;
  message: string;
  data: PortfolioPerformanceData;
  errorCode: string | null;
  timestamp: string;
}
export interface PortfolioAllocationData {
  sector:string;
  currentValue: number;
  percentage: number;
  
}
export interface PortfolioAllocationResponse {
  success: boolean;
  message: string;
  data: PortfolioAllocationData[];
  errorCode: string | null;
  timestamp: string;
}

export interface Holding {
  id: string;
  symbol: string;
  companyName: string;
  sector: string;
  quantity: number;
  averageCostBasis: number;
  currentPrice: number;
  previousClose: number;
  dayChangePercent: number;
  currentValue: number;
  totalReturnPercent: number;
}

export type HoldingListResponse = ApiResponse<Holding[]>;

export type CreateHoldingPayload = {
  symbol:string;
  quantity:number;
  averageCostBasis:number;
}
export type updateHoldingPayload = {
  quantity:number;
  averageCostBasis:number;
}

export type CreatePortfolioPayload = {
  name: string;
  riskLevel: RiskLevel;
}

export interface StockSearchResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}
 
export type StockSearchResponse = ApiResponse<StockSearchResult[]>;

