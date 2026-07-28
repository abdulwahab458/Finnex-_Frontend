import { useQuery } from "@tanstack/react-query";
import {
    fetchCashflow,
    fetchDashboardOverview,
    fetchRecentActivity,
    fetchTopCategories,
} from "./../api/dashboardApi"

// Query keys namespaced under "dashboard" so a single invalidation
// (e.g. after a new transaction is created) can refresh all four at once:
// queryClient.invalidateQueries({ queryKey: ["dashboard"] })
export const dashboardKeys = {
    all: ["dashboard"] as const,
    overview: ["dashboard", "overview"] as const,
    cashflow: ["dashboard", "cashflow"] as const,
    topCategories: ["dashboard", "top-categories"] as const,
    recentActivity: ["dashboard", "recent-activity"] as const,
};

export function useDashboardOverview() {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: dashboardKeys.overview,
        queryFn: fetchDashboardOverview,
    });

    return { data, isLoading, isError, error, refetch };
}

export function useCashflow() {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: dashboardKeys.cashflow,
        queryFn: fetchCashflow,
    });

    return { data, isLoading, isError, error, refetch };
}

export function useTopCategories() {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: dashboardKeys.topCategories,
        queryFn: fetchTopCategories,
    });

    return { data, isLoading, isError, error, refetch };
}

export function useRecentActivity() {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: dashboardKeys.recentActivity,
        queryFn: fetchRecentActivity,
    });

    return { data, isLoading, isError, error, refetch };
}