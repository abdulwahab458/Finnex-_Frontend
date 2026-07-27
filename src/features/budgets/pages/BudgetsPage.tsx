import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { PageShell } from '@/components/common/PageShell';
import { Modal } from '@/components/modal/Modal';
import { ConfirmModal } from '@/components/modal/Confirmmodal';
import { FormInput, FormSelect, FormCurrencyInput, FormDatePicker } from '@/components/form';
import { BudgetSpendingLimitsCard } from '../component/BudgetspendinglimitsCard';
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget, useGoals } from '../hooks/useBudget';
import type { Budget, CreateBudgetPayload } from '../types/budget.types';
import { GoalCard } from '../component/GoalCard';

type ConfirmAction = "create" | "update" | "delete";

// How many goals show on the budgets overview before the user has to go
// to the full goals page to see the rest.
const GOALS_PREVIEW_COUNT = 3;

const defaultValues: CreateBudgetPayload = {
  name: '',
  category: 'OTHER',
  targetAmount: 0,
  period: 'MONTHLY',
  startDate: '',
  endDate: '',
};

const categoryOptions = [
  { label: "Food & Dining", value: "FOOD_AND_DINING" },
  { label: "Shopping", value: "SHOPPING" },
  { label: "Groceries", value: "GROCERIES" },
  { label: "Transport", value: "TRANSPORT" },
  { label: "Healthcare", value: "HEALTHCARE" },
  { label: "Insurance", value: "INSURANCE" },
  { label: "Utilities", value: "UTILITIES" },
  { label: "Entertainment", value: "ENTERTAINMENT" },
  { label: "Investment", value: "INVESTMENT" },
  { label: "Dividend", value: "DIVIDEND" },
  { label: "Salary", value: "SALARY" },
  { label: "Transfer", value: "TRANSFER" },
  { label: "Education", value: "EDUCATION" },
  { label: "Rent", value: "RENT" },
  { label: "Tax", value: "TAX" },
  { label: "Other", value: "OTHER" },
];

const periodOptions = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Quarterly", value: "QUARTERLY" },
  { label: "Yearly", value: "YEARLY" },
  { label: "Custom", value: "CUSTOM" },
];

export function BudgetsPage() {
  const navigate = useNavigate();

  const { budgets, isLoading } = useBudgets();
  const { createBudget, isCreatePending } = useCreateBudget();
  const { updateBudget, isUpdatePending } = useUpdateBudget();
  const { deleteBudget, isDeletePending } = useDeleteBudget();

  const { goals } = useGoals();
  const visibleGoals = (goals ?? []).slice(0, GOALS_PREVIEW_COUNT);
  const hasMoreGoals = (goals?.length ?? 0) > GOALS_PREVIEW_COUNT;

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const isEditMode = selectedBudget !== null;

  const methods = useForm<CreateBudgetPayload>({
    mode: 'onBlur',
    defaultValues,
  });

  const onSubmit = methods.handleSubmit(() => {
    setConfirmAction(isEditMode ? "update" : "create");
    setOpen(false);
    setConfirmOpen(true);
  });

  const handleConfirm = async () => {
    const values = methods.getValues();

    switch (confirmAction) {
      case "create":
        await createBudget(values);
        break;

      case "update":
        await updateBudget({ id: selectedBudget!.id, payload: values });
        break;

      case "delete":
        await deleteBudget(selectedBudget!.id);
        break;
    }

    methods.reset(defaultValues);
    setSelectedBudget(null);
    setConfirmAction(null);
    setOpen(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <PageShell
        title="Budgets"
        subtitle="Track your spending against your limits"
        createAction={{
          label: 'Create Budget',
          onClick: () => {
            setSelectedBudget(null);
            methods.reset(defaultValues);
            setOpen(true);
          },
        }}
      >
        <div className="flex  gap-4">


          <BudgetSpendingLimitsCard
            budgets={budgets ?? []}
            onEdit={(budget: Budget) => {
              setSelectedBudget(budget);
              methods.reset({
                name: budget.name,
                category: budget.category,
                targetAmount: budget.targetAmount,
                period: budget.period,
                startDate: budget.startDate,
                endDate: budget.endDate,
              });
              setOpen(true);
            }}
            onDelete={(budget: Budget) => {
              setSelectedBudget(budget);
              setConfirmAction("delete");
              setConfirmOpen(true);
            }}
            className='flex-2'
          />

        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="m-0 whitespace-nowrap text-[clamp(1.3rem,1.5vw,2.3rem)] font-semibold tracking-[-0.02em] text-on-surface">
              Saving Goals
            </h1>

            {hasMoreGoals && (
              <button
                type="button"
                onClick={() => navigate('/user/dashboard/budgets/goals')}
                className="flex items-center gap-1 text-sm font-medium text-on-surface-variant hover:text-on-surface"
              >
                View all goals
                <ArrowRight size={16} />
              </button>
            )}
          </div>

          <div className='grid grid-cols-3 gap-3'>
            {visibleGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={() => {
                  console.log("Edit goal", goal);
                }}
                onDelete={() => {
                  console.log("Delete goal", goal);
                }}
              />
            ))}
          </div>
        </div>
      </PageShell>

      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={isEditMode ? "Edit Budget" : "Create Budget"}
          description={isEditMode ? "Update your budget details" : "Set a new spending limit"}
          footer={
            <>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border shadow-sm border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-budget-form"
                className="rounded-md flex justify-center items-center gap-1 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <Check size={16} />
                {isEditMode ? "Update Budget" : "Create Budget"}
              </button>
            </>
          }
        >
          <FormProvider {...methods}>
            <form
              id="create-budget-form"
              onSubmit={onSubmit}
              className="flex flex-col gap-4"
            >
              <FormInput
                name="name"
                label="Budget Name"
                placeholder="e.g. July Food Budget"
                rules={{ required: "Budget name is required" }}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  name="category"
                  label="Category"
                  options={categoryOptions}
                  rules={{ required: "Please select a category" }}
                />

                <FormSelect
                  name="period"
                  label="Period"
                  options={periodOptions}
                  rules={{ required: "Please select a period" }}
                />
              </div>

              <FormCurrencyInput
                name="targetAmount"
                label="Target Amount"
                rules={{
                  required: "Target amount is required",
                  min: { value: 0.01, message: "Target amount must be greater than zero" },
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormDatePicker
                  name="startDate"
                  label="Start Date"
                  rules={{ required: "Start date is required" }}
                />

                <FormDatePicker
                  name="endDate"
                  label="End Date"
                  rules={{
                    required: "End date is required",
                    validate: (value: string | number, formValues: CreateBudgetPayload) => {
                      const endDate = String(value);
                      const startDate = formValues.startDate;
                      return !startDate || !endDate || endDate >= startDate || "End date must be on or after the start date";
                    },
                  }}
                />
              </div>
            </form>
          </FormProvider>
        </Modal>
      )}

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        variant={confirmAction === "delete" ? "warning" : "info"}
        title={
          confirmAction === "create"
            ? "Create this budget?"
            : confirmAction === "update"
              ? "Update this budget?"
              : "Delete this budget?"
        }
        description={
          confirmAction === "create"
            ? "Are you sure you want to create this budget?"
            : confirmAction === "update"
              ? "Are you sure you want to update this budget?"
              : "Are you sure you want to delete this budget? This action cannot be undone."
        }
        confirmLabel={
          confirmAction === "create"
            ? "Create Budget"
            : confirmAction === "update"
              ? "Update Budget"
              : "Delete Budget"
        }
        onConfirm={handleConfirm}
        loading={isCreatePending || isUpdatePending || isDeletePending}
      />
    </>
  );
}