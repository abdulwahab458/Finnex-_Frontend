import { useState } from 'react';
import { Check, Target } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { PageShell } from '@/components/common/PageShell';
import { Modal } from '@/components/modal/Modal';
import { ConfirmModal } from '@/components/modal/Confirmmodal';
import { FormInput, FormCurrencyInput, FormDatePicker, FormSelect } from '@/components/form';
import GoalCard from '@/features/budgets/component/GoalCard';
import { useCreateGoal, useUpdateGoal, useDeleteGoal } from '../hooks/useGoals';
import { useContributeGoal,  } from '../hooks/useGoals';
import type { Goal, CreateGoalPayload } from '@/features/budgets/types/budget.types';
import { useGoals } from '../hooks/useGoals';
import type { ContributeGoalPayload } from '../api/goalApi';

type ConfirmAction = "create" | "update" | "delete" | "contribute";

const defaultValues: CreateGoalPayload = {
  name: '',
  targetAmount: 0,
  targetDate: '',
  category: 'OTHER',
};

const contributeDefaultValues: ContributeGoalPayload = {
  amount: 0,
};

const goalCategoryOptions = [
  { label: "Retirement", value: "RETIREMENT" },
  { label: "Home", value: "HOME" },
  { label: "Education", value: "EDUCATION" },
  { label: "Emergency Fund", value: "EMERGENCY_FUND" },
  { label: "Travel", value: "TRAVEL" },
  { label: "Vehicle", value: "VEHICLE" },
  { label: "Wedding", value: "WEDDING" },
  { label: "Health", value: "HEALTH" },
  { label: "Other", value: "OTHER" },
];

export function GoalsPage() {
  const { goals, useGoalsLoading } = useGoals();
  const { createGoal, isCreatePending } = useCreateGoal();
  const { updateGoal, isUpdatePending } = useUpdateGoal();
  const { deleteGoal, isDeletePending } = useDeleteGoal();
  const { contributeToGoal, isContributePending } = useContributeGoal();

  const [open, setOpen] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const isEditMode = selectedGoal !== null && confirmAction !== "contribute";

  const methods = useForm<CreateGoalPayload>({
    mode: 'onBlur',
    defaultValues,
  });

  // Separate form instance — the contribute payload ({ amount }) has
  // nothing in common with CreateGoalPayload, so it doesn't share `methods`.
  const contributeMethods = useForm<ContributeGoalPayload>({
    mode: 'onBlur',
    defaultValues: contributeDefaultValues,
  });

  const onSubmit = methods.handleSubmit(() => {
    setConfirmAction(isEditMode ? "update" : "create");
    setOpen(false);
    setConfirmOpen(true);
  });

  const onContributeSubmit = contributeMethods.handleSubmit(() => {
    setConfirmAction("contribute");
    setContributeOpen(false);
    setConfirmOpen(true);
  });

  const handleConfirm = async () => {
    switch (confirmAction) {
      case "create": {
        const values = methods.getValues();
        await createGoal(values);
        methods.reset(defaultValues);
        break;
      }

      case "update": {
        const values = methods.getValues();
        await updateGoal({ id: selectedGoal!.id, payload: values });
        methods.reset(defaultValues);
        break;
      }

      case "delete":
        await deleteGoal(selectedGoal!.id);
        break;

      case "contribute": {
        const values = contributeMethods.getValues();
        await contributeToGoal({ id: selectedGoal!.id, payload: values });
        contributeMethods.reset(contributeDefaultValues);
        break;
      }
    }

    setSelectedGoal(null);
    setConfirmAction(null);
    setOpen(false);
    setContributeOpen(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <PageShell
        title="Goals"
        subtitle="Track your progress toward what you're saving for"
        createAction={{
          label: 'Create Goal',
          onClick: () => {
            setSelectedGoal(null);
            methods.reset(defaultValues);
            setOpen(true);
          },
        }}
      >
        <div className='grid grid-cols-3 gap-3'>
          {!useGoalsLoading && (goals ?? []).length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-outline/30 bg-surface py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant">
                <Target size={22} />
              </div>
              <div>
                <p className="font-semibold text-on-surface">No goals yet</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Set your first savings goal to start tracking your progress.
                </p>
              </div>
            </div>
          )}

          {goals?.map((goal: Goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => {
                setSelectedGoal(goal);
                methods.reset({
                  name: goal.name,
                  targetAmount: goal.targetAmount,
                  targetDate: goal.targetDate,
                  category: goal.category,
                });
                setOpen(true);
              }}
              onDelete={() => {
                setSelectedGoal(goal);
                setConfirmAction("delete");
                setConfirmOpen(true);
              }}
              onContribute={() => {
                setSelectedGoal(goal);
                contributeMethods.reset(contributeDefaultValues);
                setContributeOpen(true);
              }}
            />
          ))}
        </div>
      </PageShell>

      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={isEditMode ? "Edit Goal" : "Create Goal"}
          description={isEditMode ? "Update your savings goal" : "Set a new savings goal"}
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
                form="create-goal-form"
                className="rounded-md flex justify-center items-center gap-1 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <Check size={16} />
                {isEditMode ? "Update Goal" : "Create Goal"}
              </button>
            </>
          }
        >
          <FormProvider {...methods}>
            <form
              id="create-goal-form"
              onSubmit={onSubmit}
              className="flex flex-col gap-4"
            >
              <FormInput
                name="name"
                label="Goal Name"
                placeholder="e.g. Emergency Fund"
                rules={{ required: "Goal name is required" }}
              />

              <FormSelect
                name="category"
                label="Category"
                options={goalCategoryOptions}
                rules={{ required: "Please select a category" }}
              />

              <FormCurrencyInput
                name="targetAmount"
                label="Target Amount"
                rules={{
                  required: "Target amount is required",
                  min: { value: 0.01, message: "Target amount must be greater than zero" },
                }}
              />

              <FormDatePicker
                name="targetDate"
                label="Target Date"
                rules={{ required: "Target date is required" }}
              />
            </form>
          </FormProvider>
        </Modal>
      )}

      {contributeOpen && (
        <Modal
          open={contributeOpen}
          onClose={() => setContributeOpen(false)}
          title="Contribute to Goal"
          description={selectedGoal ? `Add funds toward "${selectedGoal.name}"` : "Add funds toward this goal"}
          footer={
            <>
              <button
                type="button"
                onClick={() => setContributeOpen(false)}
                className="rounded-md border shadow-sm border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="contribute-goal-form"
                className="rounded-md flex justify-center items-center gap-1 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <Check size={16} />
                Contribute
              </button>
            </>
          }
        >
          <FormProvider {...contributeMethods}>
            <form
              id="contribute-goal-form"
              onSubmit={onContributeSubmit}
              className="flex flex-col gap-4"
            >
              <FormCurrencyInput
                name="amount"
                label="Contribution Amount"
                rules={{
                  required: "Amount is required",
                  min: { value: 0.01, message: "Amount must be greater than zero" },
                }}
              />
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
            ? "Create this goal?"
            : confirmAction === "update"
              ? "Update this goal?"
              : confirmAction === "contribute"
                ? "Confirm contribution?"
                : "Delete this goal?"
        }
        description={
          confirmAction === "create"
            ? "Are you sure you want to create this goal?"
            : confirmAction === "update"
              ? "Are you sure you want to update this goal?"
              : confirmAction === "contribute"
                ? `Add ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                    contributeMethods.getValues("amount") || 0
                  )} to "${selectedGoal?.name}"?`
                : "Are you sure you want to delete this goal? This action cannot be undone."
        }
        confirmLabel={
          confirmAction === "create"
            ? "Create Goal"
            : confirmAction === "update"
              ? "Update Goal"
              : confirmAction === "contribute"
                ? "Confirm Contribution"
                : "Delete Goal"
        }
        onConfirm={handleConfirm}
        loading={isCreatePending || isUpdatePending || isDeletePending || isContributePending}
      />
    </>
  );
}