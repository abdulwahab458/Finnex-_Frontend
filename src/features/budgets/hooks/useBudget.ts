import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBudget, deleteBudget, getBudgets, getGoals, updateBudget } from "../api/budgetsApi";
import type { CreateBudgetPayload } from "../types/budget.types";




export const useBudgets = () => {
    const query = useQuery({
        queryKey: ["budgets"],
        queryFn: getBudgets,
    });

    return {
        budgets: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};



export const useCreateBudget = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createBudget,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
        },
    });

    return {
        createBudget: mutation.mutateAsync,
        isCreatePending: mutation.isPending,
        isCreateError: mutation.isError,
    };
};

export const useUpdateBudget = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateBudgetPayload }) =>
            updateBudget(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
        },
    });

    return {
        updateBudget: mutation.mutateAsync,
        isUpdatePending: mutation.isPending,
        isUpdateError: mutation.isError,
    };
};


export const useDeleteBudget = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteBudget,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
        },
    });

    return {
        deleteBudget: mutation.mutateAsync,
        isDeletePending: mutation.isPending,
        isDeleteError: mutation.isError,
    };
};





export const useGoals = () => {
    const query = useQuery({
        queryKey: ["goals"],
        queryFn: getGoals,
    });

    return {
        goals: query.data,
        useGoalsLoading: query.isLoading,
        goalsIsError: query.isError,
        goalerror: query.error,
    };
};