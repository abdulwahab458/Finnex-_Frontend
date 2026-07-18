// features/accounts/hooks/useAccounts.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAccount, deleteAccount, getAccounts, updateAccount } from "../api/accountApi";
import type { CreateAccountPayload, UpdateAccountPayload } from "../types/accounts.type";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

export const useAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  return {
    accounts: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useCreateAccount = () => {
   const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateAccountPayload) => createAccount(payload),
    onSuccess: () => {
      toast.success("Account created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },

    onError: (err:AxiosError<any>) => {
      toast.error(err.response?.data?.message);
    },
  });

  return {
    createAccount: mutation.mutateAsync,

    // State
    isPending: mutation.isPending,
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





export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, accountName }: UpdateAccountPayload) =>
      updateAccount(id, accountName),

    onSuccess: () => {
      toast.success("Account updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },

    onError: (err: AxiosError<any>) => {
      toast.error(err.response?.data?.message);
    },
  });

  return {
    updateAccount: mutation.mutateAsync,

    // State
    updatePending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,

    // Data
    data: mutation.data,

    reset: mutation.reset,

    
  };
};

export const useDeactivateAccount = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id:string) =>
      deleteAccount(id),

    onSuccess: () => {
      toast.success("Account deactivated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },

    onError: (err: AxiosError<any>) => {
      toast.error(err.response?.data?.message);
    },
  });

  return {
    deactivateAccount: mutation.mutateAsync,

    // State
    deactivatePending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,

    // Data
    data: mutation.data,

    reset: mutation.reset,

    
  };
};