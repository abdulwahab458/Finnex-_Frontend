import { apiClient } from "@/api/axios";
import type { Budget, BudgetListResponse, CreateBudgetPayload, Goal, GoalResponse } from "../types/budget.types";






export const getBudgets = async (): Promise<Budget[]> => {
    const response = await apiClient.get<BudgetListResponse>("/budgets");
    return response.data.data;
};




export const createBudget = async (payload: CreateBudgetPayload): Promise<Budget> => {
    const response = await apiClient.post<{ data: Budget }>("/budgets", payload);
    return response.data.data;
};



export const updateBudget = async (
    id: string,
    payload: CreateBudgetPayload
): Promise<Budget> => {
    const response = await apiClient.put<{ data: Budget }>(`/budgets/${id}`, payload);
    return response.data.data;
};

export const deleteBudget = async (id: string): Promise<void> => {
    await apiClient.delete(`/budgets/${id}`);
};




//goals

export const getGoals = async (): Promise<Goal[]> => {
    const response = await apiClient.get<GoalResponse>("/goals");
    return response.data.data;
};
