import { apiClient } from "@/api/axios";
import type { CreateGoalPayload } from "@/features/budgets/types/budget.types";
import type { Goal } from "@/types/goal";





export const createGoal = async (payload: CreateGoalPayload): Promise<Goal> => {
  const response = await apiClient.post<{ data: Goal }>("/goals", payload);
  return response.data.data;
};
 
export const updateGoal = async (id: string, payload: CreateGoalPayload): Promise<Goal> => {
  const response = await apiClient.put<{ data: Goal }>(`/goals/${id}`, payload);
  return response.data.data;
};
 
export const deleteGoal = async (id: string): Promise<void> => {
  await apiClient.delete(`/goals/${id}`);
};



export interface ContributeGoalPayload {
  amount: number;
}
 
export const contributeToGoal = async (
  id: string,
  payload: ContributeGoalPayload
): Promise<Goal> => {
  const response = await apiClient.post<{ data: Goal }>(`/goals/${id}/contribute`, payload);
  return response.data.data;
};