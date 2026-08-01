import { useState } from 'react';
import { Check } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { PageShell } from '@/components/common/PageShell';
import { Modal } from '@/components/modal/Modal';
import { ConfirmModal } from '@/components/modal/Confirmmodal';
import { FormInput, FormSelect, FormCurrencyInput, FormDatePicker } from '@/components/form';
import { LoanCard } from '@/features/reports/components/LoanCard';
import { useLoans, useCreateLoan, useUpdateLoan, useDeleteLoan, useRecordLoanPayment } from '../hooks/useLoans';
import type { CreateLoanPayload, Loan, LoanPaymentPayload, UpdateLoanPayload} from '../types/loans.types';


type ConfirmAction = "create" | "update" | "delete" | "payment";

const defaultValues: CreateLoanPayload = {
  loanName: '',
  loanType: 'HOME',
  lenderName: '',
  principalAmount: 0,
  interestRate: 0,
  emiAmount: 0,
  startDate: '',
  endDate: '',
};

const paymentDefaultValues:   LoanPaymentPayload = {
  amount: 0,
};

const loanTypeOptions = [
  { label: "Home", value: "HOME" },
  { label: "Auto", value: "AUTO" },
  { label: "Personal", value: "PERSONAL" },
  { label: "Education", value: "EDUCATION" },
  { label: "Business", value: "BUSINESS" },
  { label: "Other", value: "OTHER" },
];

export function LoansPage() {
  const { loans } = useLoans();
  const { createLoan, isCreatePending } = useCreateLoan();
  const { updateLoan, isUpdatePending } = useUpdateLoan();
  const { deleteLoan, isDeletePending } = useDeleteLoan();
  const { recordLoanPayment, isPaymentPending } = useRecordLoanPayment();

  const [open, setOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  // isEditMode only applies to the create/edit modal flow, not payment —
  // selectedLoan is shared across edit/delete/payment, so this needs the
  // extra guard (same reasoning as GoalsPage's isEditMode).
  const isEditMode = selectedLoan !== null && confirmAction !== "payment" && confirmAction !== "delete";

  const methods = useForm<CreateLoanPayload>({
    mode: 'onBlur',
    defaultValues,
  });

  const paymentMethods = useForm<LoanPaymentPayload>({
    mode: 'onBlur',
    defaultValues: paymentDefaultValues,
  });

  const onSubmit = methods.handleSubmit(() => {
    setConfirmAction(isEditMode ? "update" : "create");
    setOpen(false);
    setConfirmOpen(true);
  });

  const onPaymentSubmit = paymentMethods.handleSubmit(() => {
    setConfirmAction("payment");
    setPaymentOpen(false);
    setConfirmOpen(true);
  });

  const handleConfirm = async () => {
    switch (confirmAction) {
      case "create": {
        const values = methods.getValues();
        await createLoan(values);
        methods.reset(defaultValues);
        break;
      }

      case "update": {
        // principalAmount isn't part of UpdateLoanPayload — strip it out
        // rather than sending a field the endpoint doesn't accept.
        const { principalAmount, ...updateValues } = methods.getValues();
        await updateLoan({ id: selectedLoan!.id, payload: updateValues as UpdateLoanPayload });
        methods.reset(defaultValues);
        break;
      }

      case "delete":
        await deleteLoan(selectedLoan!.id);
        break;

      case "payment": {
        const values = paymentMethods.getValues();
        await recordLoanPayment({ id: selectedLoan!.id, payload: values });
        paymentMethods.reset(paymentDefaultValues);
        break;
      }
    }

    setSelectedLoan(null);
    setConfirmAction(null);
    setOpen(false);
    setPaymentOpen(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <PageShell
        title="Loans"
        subtitle="Track what you owe and stay on top of payments"
        createAction={{
          label: 'Add Loan',
          onClick: () => {
            setSelectedLoan(null);
            methods.reset(defaultValues);
            setOpen(true);
          },
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loans?.map((loan: Loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onEdit={(l: Loan) => {
                setSelectedLoan(l);
                methods.reset({
                  loanName: l.loanName,
                  loanType: l.loanType,
                  lenderName: l.lenderName,
                  principalAmount: l.principalAmount,
                  interestRate: l.interestRate,
                  emiAmount: l.emiAmount,
                  startDate: l.startDate,
                  endDate: l.endDate,
                });
                setOpen(true);
              }}
              onDelete={(l: Loan) => {
                setSelectedLoan(l);
                setConfirmAction("delete");
                setConfirmOpen(true);
              }}
              onMakePayment={(l: Loan) => {
                setSelectedLoan(l);
                paymentMethods.reset(paymentDefaultValues);
                setPaymentOpen(true);
              }}
            />
          ))}
        </div>
      </PageShell>

      {/* Create / Edit modal */}
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={isEditMode ? "Edit Loan" : "Add Loan"}
          description={isEditMode ? "Update your loan details" : "Track a new loan"}
          size="lg"
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
                form="loan-form"
                className="rounded-md flex justify-center items-center gap-1 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <Check size={16} />
                {isEditMode ? "Update Loan" : "Add Loan"}
              </button>
            </>
          }
        >
          <FormProvider {...methods}>
            <form id="loan-form" onSubmit={onSubmit} className="flex flex-col gap-4">
              <FormInput
                name="loanName"
                label="Loan Name"
                placeholder="e.g. Home Loan"
                rules={{ required: "Loan name is required" }}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  name="loanType"
                  label="Loan Type"
                  options={loanTypeOptions}
                  rules={{ required: "Please select a loan type" }}
                />

                <FormInput
                  name="lenderName"
                  label="Lender Name"
                  placeholder="e.g. HDFC Bank"
                  rules={{ required: "Lender name is required" }}
                />
              </div>

              {/* Principal can only be set at creation — once a loan
                  exists, it's locked, matching UpdateLoanPayload's shape. */}
              {isEditMode ? (
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                    Principal Amount
                  </label>
                  <div className="mt-1.5 flex items-center justify-between rounded-md border border-outline/30 bg-surface-container-low px-3 py-2 text-sm">
                    <span className="font-semibold text-on-surface">
                      ₹{selectedLoan?.principalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs font-medium text-on-surface-variant">Can&apos;t be changed</span>
                  </div>
                </div>
              ) : (
                <FormCurrencyInput
                  name="principalAmount"
                  label="Principal Amount"
                  currencySymbol="₹"
                  rules={{
                    required: "Principal amount is required",
                    min: { value: 0.01, message: "Principal amount must be greater than zero" },
                  }}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  name="interestRate"
                  type="number"
                  step="0.01"
                  label="Interest Rate (%)"
                  rules={{
                    required: "Interest rate is required",
                    min: { value: 0, message: "Interest rate can't be negative" },
                  }}
                />

                <FormCurrencyInput
                  name="emiAmount"
                  label="EMI Amount"
                  currencySymbol="₹"
                  rules={{
                    required: "EMI amount is required",
                    min: { value: 0.01, message: "EMI amount must be greater than zero" },
                  }}
                />
              </div>

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
                    validate: (value: string | number, formValues: CreateLoanPayload) => {
                      const endDate = String(value);
                      return (
                        !formValues.startDate ||
                        !endDate ||
                        endDate >= formValues.startDate ||
                        "End date must be after the start date"
                      );
                    },
                  }}
                />
              </div>
            </form>
          </FormProvider>
        </Modal>
      )}

      {/* Payment modal */}
      {paymentOpen && (
        <Modal
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          title="Make a Payment"
          description={selectedLoan ? `Record a payment toward "${selectedLoan.loanName}"` : "Record a payment"}
          footer={
            <>
              <button
                type="button"
                onClick={() => setPaymentOpen(false)}
                className="rounded-md border shadow-sm border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="loan-payment-form"
                className="rounded-md flex justify-center items-center gap-1 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <Check size={16} />
                Make Payment
              </button>
            </>
          }
        >
          <FormProvider {...paymentMethods}>
            <form id="loan-payment-form" onSubmit={onPaymentSubmit} className="flex flex-col gap-4">
              {selectedLoan && (
                <p className="text-xs text-on-surface-variant">
                  Outstanding balance: ₹
                  {selectedLoan.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              )}
              <FormCurrencyInput
                name="amount"
                label="Payment Amount"
                currencySymbol="₹"
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
            ? "Add this loan?"
            : confirmAction === "update"
              ? "Update this loan?"
              : confirmAction === "payment"
                ? "Confirm payment?"
                : "Delete this loan?"
        }
        description={
          confirmAction === "create"
            ? "Are you sure you want to add this loan?"
            : confirmAction === "update"
              ? "Are you sure you want to update this loan?"
              : confirmAction === "payment"
                ? `Record a payment of ₹${(paymentMethods.getValues("amount") || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} toward "${selectedLoan?.loanName}"?`
                : "Are you sure you want to delete this loan? This action cannot be undone."
        }
        confirmLabel={
          confirmAction === "create"
            ? "Add Loan"
            : confirmAction === "update"
              ? "Update Loan"
              : confirmAction === "payment"
                ? "Confirm Payment"
                : "Delete Loan"
        }
        onConfirm={handleConfirm}
        loading={isCreatePending || isUpdatePending || isDeletePending || isPaymentPending}
      />
    </>
  );
}