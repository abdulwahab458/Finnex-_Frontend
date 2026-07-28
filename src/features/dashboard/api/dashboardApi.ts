import type { ApiResponse } from "@/types/api";
import type { CashflowResponse, CategoryAllocationItem, DashboardOverview, RecentActivityItem } from "../types/dashboard.types";
import { apiClient } from "@/api/axios";



export async function fetchDashboardOverview(): Promise<DashboardOverview> {
    const { data } = await apiClient.get<ApiResponse<DashboardOverview>>("/dashboard");
    return data.data;
}

export async function fetchCashflow(): Promise<CashflowResponse> {
    const { data } = await apiClient.get<ApiResponse<CashflowResponse>>(`dashboard/cash-flow`);
    return data.data;
}

export async function fetchTopCategories(): Promise<CategoryAllocationItem[]> {
    const { data } = await apiClient.get<ApiResponse<CategoryAllocationItem[]>>(
        `dashboard/top-categories`
    );
    return data.data;
}

export async function fetchRecentActivity(): Promise<RecentActivityItem[]> {
    const { data } = await apiClient.get<ApiResponse<RecentActivityItem[]>>(
        `dashboard/recent-activity`
    );
    return data.data;
}