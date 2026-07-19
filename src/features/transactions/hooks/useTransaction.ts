// features/transactions/hooks/useTransactions.ts

import { useQuery } from "@tanstack/react-query";
import { getTransactions, getTransactionSummary } from "../api/transactionApi";

export const useTransactions = (page = 0, size = 10) => {
  const query = useQuery({
    queryKey: ["transactions", page, size],
    queryFn: () => getTransactions(page, size),
  });

  return {
    transactions: query.data?.content,
    page: query.data?.page,
    size: query.data?.size,
    totalElements: query.data?.totalElements,
    totalPages: query.data?.totalPages,
    last: query.data?.last,

    isLoading: query.isPending,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,

    refetch: query.refetch,
  };
};


export const useTransactionSummary = () => {
  const query = useQuery({
    queryKey: ["transaction-summary"],
    queryFn: getTransactionSummary,
  });

  return {
    summary: query.data,

    isLoading: query.isPending,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,

    refetch: query.refetch,
  };
};