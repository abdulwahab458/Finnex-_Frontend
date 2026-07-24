import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createHolding, createPortfolio, deleteHolding, deletePortfolio, getHoldings, getPortfolioAllocation, getPortfolioById, getPortfolioPerformance, getPortfolios, searchStocks, updateHolding, updatePortfolio } from "../api/portfolioApi";
import type { CreateHoldingPayload, CreatePortfolioPayload, PortfolioPeriod, updateHoldingPayload } from "../types/portfolio.types";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";




export const usePortfolios = () => {
    const query = useQuery({
        queryKey: ["portfolios"],
        queryFn: getPortfolios,
    });

    return {
        portfolioData: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};


export const useCreatePortfolio = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: CreatePortfolioPayload) =>
            createPortfolio(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["portfolios"],
            });
            toast.success("Portfolio created successfully");
        },
        onError: (err: AxiosError<any>) => {
            toast.error(err.response?.data?.message ?? "Failed to create portfolio");
        },
    });

    return {
        createPortfolio: mutation.mutateAsync,
        isCreatePending: mutation.isPending,
        createError: mutation.error,
    };
};
export const useUpdatePortfolio = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (
            {
                portfolioId,
                payload
            }:{
                portfolioId:string,
                payload:CreatePortfolioPayload
            }
        ) =>
            updatePortfolio(portfolioId,payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["portfolios"],
            });
            toast.success("Portfolio updated successfully");
        },
        onError: (err: AxiosError<any>) => {
            toast.error(err.response?.data?.message ?? "Failed to create portfolio");
        },
    });

    return {
        updatePortfolio: mutation.mutateAsync,
        isUpdatePending: mutation.isPending,
        updateError: mutation.error,
    };
};
export const useDeletePortfolio = () => {
    const queryClient = useQueryClient();


    const mutation = useMutation({
        mutationFn: (portfolioId:string) =>
            deletePortfolio(portfolioId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["portfolios"],
            });
            toast.success("Portfolio deleted successfully");
        },
        onError: (err: AxiosError<any>) => {
            toast.error(err.response?.data?.message ?? "Failed to create portfolio");
        },
    });

    return {
        deletePortfolio: mutation.mutateAsync,
        isDeletePending: mutation.isPending,
        updateError: mutation.error,
    };
};

export const usePortfolio = (portfolioId: string) => {
    const query = useQuery({
        queryKey: ["portfolio", portfolioId],
        queryFn: () => getPortfolioById(portfolioId),
        enabled: !!portfolioId,
    });

    return {
        portfolio: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};


export const usePortfolioPerformance = (portfolioId: string, period: PortfolioPeriod) => {
    const query = useQuery({
        queryKey: ["portfolio-performance", portfolioId, period],
        queryFn: () => getPortfolioPerformance(portfolioId, period),
        enabled: Boolean(portfolioId),
    });

    return {
        performance: query.data,
        performanceLoading: query.isLoading,
        performanceError: query.isError,
        error: query.error,
    };
};


export const usePortfolioAllocation = (portfolioId: string) => {
    const query = useQuery({
        queryKey: ["portfolio-allocation", portfolioId],
        queryFn: () => getPortfolioAllocation(portfolioId),
        enabled: Boolean(portfolioId),
    });

    return {
        allocation: query.data,
        allocationLoading: query.isLoading,
        allocationError: query.isError,
        error: query.error,
    };
};

export const useHoldings = (portfolioId: string) => {
    const query = useQuery({
        queryKey: ["portfolio-holdings", portfolioId],
        queryFn: () => getHoldings(portfolioId),
        enabled: Boolean(portfolioId),
    });

    return {
        holdings: query.data,
        holdingsLoading: query.isLoading,
        holdingsIsError: query.isError,
        holdingerror: query.error,
    };
};


export function useStockSearch(query: string) {
    const debouncedQuery = useDebounce(query.trim(), 350);
    const isQueryReady = debouncedQuery.length >= 1;

    const searchQuery = useQuery({
        queryKey: ["stock-search", debouncedQuery],
        queryFn: () => searchStocks(debouncedQuery),
        enabled: isQueryReady,
        staleTime: 60_000, // symbol search results don't change minute to minute
    });

    return {
        results: searchQuery.data ?? [],
        // "searching" reflects the debounce + fetch together, so the UI can
        // show a spinner the whole time input is settling and the request is in flight.
        isSearching: query.trim().length >= 1 && (query.trim() !== debouncedQuery || searchQuery.isFetching),
        isError: searchQuery.isError,
    };
}


export const useCreateHolding = (portfolioId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: CreateHoldingPayload) =>
            createHolding(portfolioId, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["portfolio-holdings", portfolioId],
            });

            queryClient.invalidateQueries({
                queryKey: ["portfolio-performance", portfolioId],
            });

            queryClient.invalidateQueries({
                queryKey: ["portfolio-allocation", portfolioId],
            });
            toast.success("Holding created successfully");

        },
        onError:(err:AxiosError<any>)=>{
            toast.error(err.response?.data.message)
        }
    });

    return {
        createHolding: mutation.mutateAsync,
        isCreatePending: mutation.isPending,
        createHoldingError: mutation.error,
    };
};

export const useUpdateHolding = (portfolioId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({
            holdingId,
            payload,
        }: {
            holdingId: string;
            payload: updateHoldingPayload;
        }) => updateHolding(portfolioId, payload, holdingId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["portfolio-holdings", portfolioId],
            });

            queryClient.invalidateQueries({
                queryKey: ["portfolio-performance", portfolioId],
            });

            queryClient.invalidateQueries({
                queryKey: ["portfolio-allocation", portfolioId],
            });
            toast.success("Holding created successfully");

        },
        onError:(err:AxiosError<any>)=>{
            toast.error(err.response?.data.message)
        }
    });

    return {
        updateHolding: mutation.mutateAsync,
        isUpdatePending: mutation.isPending,
        updateHoldingError: mutation.error,
    };
};
export const useDeleteHolding = (portfolioId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (holdingId: string) => 
            deleteHolding(portfolioId ,holdingId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["portfolio-holdings", portfolioId],
            });

            queryClient.invalidateQueries({
                queryKey: ["portfolio-performance", portfolioId],
            });

            queryClient.invalidateQueries({
                queryKey: ["portfolio-allocation", portfolioId],
            });

        },
    });

    return {
        deleteHolding: mutation.mutateAsync,
    };
};






