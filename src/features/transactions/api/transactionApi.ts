import { apiClient } from "@/api/axios";
import type { CreateTransactionPayload, TransactionFormValues, TransactionsPage, TransactionSummary } from "../types/transactions.type";



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

export const createTransaction = async (
  data: TransactionFormValues
) => {
  const {
    attachment,
    ...transactionData
  } = data;

  const formData = new FormData();

  formData.append(
    "transaction",
    new Blob(
      [JSON.stringify(transactionData)],
      {
        type: "application/json",
      }
    )
  );

  if (attachment) {
    formData.append(
      "attachment",
      attachment
    );
  }

  const response = await apiClient.post(
    "/transactions",
    formData
  );

  return response.data.data;
};
export const updateTransaction = async(id:string,data:CreateTransactionPayload) =>{
  const response = await apiClient.put(`/transactions/${id}`,data);
  return response.data.data;
}
export const deleteTransaction = async(id:string) =>{
  const response = await apiClient.delete(`/transactions/${id}`);
  return response.data.data;
}

export const downloadTransactionAttachment = async () => {
  const response = await apiClient.get(
    `/transactions/export`,
    {
      responseType: "blob",
    }
  );

  return response;
};