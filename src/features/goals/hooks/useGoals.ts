import { getGoals } from "@/features/budgets/api/budgetsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contributeToGoal, createGoal, deleteGoal, updateGoal, type ContributeGoalPayload } from "../api/goalApi";
import type { CreateGoalPayload } from "@/features/budgets/types/budget.types";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";


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

export const useCreateGoal = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
            toast.success("Goal Created Successfully")
        },
        onError: (err: AxiosError<any>) => {
            toast.error(err.response?.data.message);
            console.log()
        }
    });

    return {
        createGoal: mutation.mutateAsync,
        isCreatePending: mutation.isPending,
        isCreateError: mutation.isError,
    };
};

export const useUpdateGoal = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateGoalPayload }) =>
            updateGoal(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
         toast.success("Goal Updated Successfully")
        },
        onError: (err: AxiosError<any>) => {
            toast.error(err.response?.data.message);
        }
    });

    return {
        updateGoal: mutation.mutateAsync,
        isUpdatePending: mutation.isPending,
        isUpdateError: mutation.isError,
    };
};

export const useDeleteGoal = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
         toast.success("Goal Deleted Successfully")
        },
        onError: (err: AxiosError<any>) => {
            toast.error(err.response?.data.message);
        }
    });

    return {
        deleteGoal: mutation.mutateAsync,
        isDeletePending: mutation.isPending,
        isDeleteError: mutation.isError,
    };
};


export const useContributeGoal = () => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ContributeGoalPayload }) =>
      contributeToGoal(id, payload),
    onSuccess: () => {
      // currentAmount / progressPercentage changed — refetch the list.
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Added your contribution")
    },
  });
 
  return {
    contributeToGoal: mutation.mutateAsync,
    isContributePending: mutation.isPending,
    isContributeError: mutation.isError,
  };
};