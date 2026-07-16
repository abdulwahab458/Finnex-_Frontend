// features/accounts/hooks/useAccounts.ts

import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../api/accountApi";

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