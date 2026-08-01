import { apiClient } from "@/api/axios";
import type { CreateLoanPayload, Loan, LoanListResponse, LoanPaymentPayload, UpdateLoanPayload } from "../types/loans.types";




export const getLoans = async (): Promise<Loan[]> => {
  const response = await apiClient.get<LoanListResponse>("/loans");
  return response.data.data;
};
 
export const createLoan = async (payload: CreateLoanPayload): Promise<Loan> => {
  const response = await apiClient.post<{ data: Loan }>("/loans", payload);
  return response.data.data;
};
 
export const updateLoan = async (id: string, payload: UpdateLoanPayload): Promise<Loan> => {
  const response = await apiClient.put<{ data: Loan }>(`/loans/${id}`, payload);
  return response.data.data;
};
 
export const deleteLoan = async (id: string): Promise<void> => {
  await apiClient.delete(`/loans/${id}`);
};
 
export const recordLoanPayment = async (
  id: string,
  payload: LoanPaymentPayload
): Promise<Loan> => {
  const response = await apiClient.post<{ data: Loan }>(`/loans/${id}/payments`, payload);
  return response.data.data;
};