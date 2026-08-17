// features/transactions/hooks/useTransactions.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransaction, deleteTransaction, downloadTransactionAttachment, getTransactions, getTransactionSummary, updateTransaction } from "../api/transactionApi";
import type { CreateTransactionPayload, TransactionFormValues } from "../types/transactions.type";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";


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


export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: TransactionFormValues) => createTransaction(payload),
    onSuccess: () => {
      toast.success("Account created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transaction-summary"],
      });
    },

    onError: (err: AxiosError<any>) => {
      toast.error(err.response?.data?.message);
    },
  });

  return {
    createTransaction: mutation.mutateAsync,

    // State
    isCreatePending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,

    // Data
    data: mutation.data,

    // Utilities
    reset: mutation.reset,
    status: mutation.status,

    // Optional (if you ever need them)
    mutate: mutation.mutate,
  };
};



export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateTransactionPayload;
    }) => updateTransaction(id, payload),

    onSuccess: () => {
      toast.success("Transaaction updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transaction-summary"],
      });
    },

    onError: (err: AxiosError<any>) => {
      toast.error(err.response?.data?.message);
    },
  });

  return {
    updateTransaction: mutation.mutateAsync,

    // State
    updateTransactionPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,

    // Data
    data: mutation.data,

    reset: mutation.reset,


  };
};
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn:(id:string)=>deleteTransaction(id),

    onSuccess: () => {
      toast.success("Transaaction updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transaction-summary"],
      });
    },

    onError: (err: AxiosError<any>) => {
      toast.error(err.response?.data?.message);
    },
  });

  return {
    deleteTransaction: mutation.mutateAsync,

    // State
    deleteTransactionPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,

    // Data
    data: mutation.data,

    reset: mutation.reset,


  };
};



export const useDownloadTransactionAttachment = () => {
  const mutation = useMutation({
    mutationFn: () => downloadTransactionAttachment(),

    onSuccess: (response) => {
      const blob = response.data;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = "attachment";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match) {
          fileName = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Attachment downloaded successfully.");
    },

    onError: () => {
      toast.error("Failed to download attachment.");
    },
  });

  return {
    downloadAttachment: mutation.mutateAsync,
    isDownloadPending: mutation.isPending,
  };
};


