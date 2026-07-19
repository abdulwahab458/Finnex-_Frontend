import { apiClient } from "@/api/axios";
import type { TransactionsPage, TransactionSummary } from "../types/transactions.type";



export const getTransactionSummary = async(): Promise<TransactionSummary> =>{
  const response = await apiClient.get("/transactions/summary");
  return response.data.data;
}


export const getTransactions = async (
  page = 0,
  size = 10
): Promise<TransactionsPage> => {
  const response = await apiClient.get("/transactions", {
    params: {
      page,
      size,
    },
  });

  return response.data.data;
};