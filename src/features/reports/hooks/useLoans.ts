import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLoan, deleteLoan, getLoans, recordLoanPayment, updateLoan } from "../api/loansApi";
import type { LoanPaymentPayload, UpdateLoanPayload } from "../types/loans.types";


export const useLoans = () => {
    const query = useQuery({
        queryKey: ["loans"],
        queryFn: getLoans,
    });

    return {
        loans: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};

export const useCreateLoan = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createLoan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["loans"] });
        },
    });

    return {
        createLoan: mutation.mutateAsync,
        isCreatePending: mutation.isPending,
        isCreateError: mutation.isError,
    };
};

export const useUpdateLoan = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateLoanPayload }) =>
            updateLoan(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["loans"] });
        },
    });

    return {
        updateLoan: mutation.mutateAsync,
        isUpdatePending: mutation.isPending,
        isUpdateError: mutation.isError,
    };
};

export const useDeleteLoan = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteLoan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["loans"] });
        },
    });

    return {
        deleteLoan: mutation.mutateAsync,
        isDeletePending: mutation.isPending,
        isDeleteError: mutation.isError,
    };
};

export const useRecordLoanPayment = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: LoanPaymentPayload }) =>
            recordLoanPayment(id, payload),
        onSuccess: () => {
            // outstandingBalance / status change after a payment — refetch.
            queryClient.invalidateQueries({ queryKey: ["loans"] });
        },
    });

    return {
        recordLoanPayment: mutation.mutateAsync,
        isPaymentPending: mutation.isPending,
        isPaymentError: mutation.isError,
    };
};
