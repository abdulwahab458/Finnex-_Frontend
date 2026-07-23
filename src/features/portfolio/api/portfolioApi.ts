import { apiClient } from "@/api/axios";
import type { CreateHoldingPayload, Holding, HoldingListResponse, Portfolio, PortfolioAllocationData, PortfolioAllocationResponse, PortfolioPerformanceData, PortfolioPerformanceResponse, PortfolioPeriod, StockSearchResponse, StockSearchResult, updateHoldingPayload } from "../types/portfolio.types";


export const getPortfolios = async (): Promise<Portfolio[]> => {
    const response = await apiClient.get("/portfolios");
    return response.data.data;
}

export const getPortfolioById = async (portfolioId: string): Promise<Portfolio> => {
    const response = await apiClient.get(`/portfolios/${portfolioId}`);
    return response.data.data;
}


export const getPortfolioPerformance = async (
    portfolioId: string,
    period: PortfolioPeriod
): Promise<PortfolioPerformanceData> => {
    const response = await apiClient.get<PortfolioPerformanceResponse>(
        `/portfolios/${portfolioId}/performance`,
        { params: { period } }
    );
    return response.data.data;
};
export const getPortfolioAllocation = async (
    portfolioId: string,
): Promise<PortfolioAllocationData[]> => {
    const response = await apiClient.get<PortfolioAllocationResponse>(
        `/portfolios/${portfolioId}/allocation`
    );
    return response.data.data;
};



export const getHoldings = async (portfolioId: string): Promise<Holding[]> => {
    const response = await apiClient.get<HoldingListResponse>(
        `/portfolios/${portfolioId}/holdings`
    );
    return response.data.data;
};


export const searchStocks = async (symbol: string): Promise<StockSearchResult[]> => {
    const response = await apiClient.get<StockSearchResponse>("/portfolios/search", {
        params: { symbol },
    });
    return response.data.data;
};
export const createHolding = async (portfolioId:string,payload:CreateHoldingPayload): Promise<StockSearchResult[]> => {
    const response = await apiClient.post<StockSearchResponse>( `/portfolios/${portfolioId}/holdings`,payload);
    return response.data.data;
};
export const updateHolding = async (portfolioId:string,payload:updateHoldingPayload,holdingId:string): Promise<StockSearchResult[]> => {
    const response = await apiClient.put<StockSearchResponse>( `/portfolios/${portfolioId}/holdings/${holdingId}`,payload);
    return response.data.data;
};

export const deleteHolding = async(portfolioId:string,holdingId:string) =>{
    const response = await apiClient.delete( `/portfolios/${portfolioId}/holdings/${holdingId}`);
    return response.data.data;
}





