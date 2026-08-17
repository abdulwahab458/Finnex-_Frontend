import { PageShell } from '@/components/common/PageShell'
import { TransactionStatCard, type TransactionStatCardProps } from '../component/TransactionStatCard'
import { ArrowLeftRight, Ban, Car, Check, CircleHelp, Clock, Eye, Film, GraduationCap, HeartPulse, House, Landmark,  Pencil, Receipt, Shield, ShoppingBag, ShoppingCart, TrendingDown, TrendingUp, UtensilsCrossed, Wallet, Zap, } from 'lucide-react'
import { useCreateTransaction, useDeleteTransaction, useDownloadTransactionAttachment, useTransactions, useTransactionSummary, useUpdateTransaction } from '../hooks/useTransaction';
import { Table } from '@/components/tables'
import { useState } from 'react';
import { TransactionCategory, TransactionStatus, TransactionType, type Transaction, type TransactionFormValues } from '../types/transactions.type';
import { ActionsMenu } from '@/components/menu/Actionmenu';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import { FormProvider, useForm } from 'react-hook-form';
import { Modal } from '@/components/modal/Modal';


import { FormCurrencyInput, FormDateTimePicker, FormFileUpload, FormInput, FormSelect, FormTextArea } from '@/components/form';
import { ConfirmModal } from '@/components/modal/Confirmmodal';



export const transactionCategoryIcons = {
  [TransactionCategory.FOOD_AND_DINING]: UtensilsCrossed,
  [TransactionCategory.SHOPPING]: ShoppingBag,
  [TransactionCategory.GROCERIES]: ShoppingCart,
  [TransactionCategory.TRANSPORT]: Car,
  [TransactionCategory.HEALTHCARE]: HeartPulse,
  [TransactionCategory.INSURANCE]: Shield,
  [TransactionCategory.UTILITIES]: Zap,
  [TransactionCategory.ENTERTAINMENT]: Film,
  [TransactionCategory.INVESTMENT]: TrendingUp,
  [TransactionCategory.DIVIDEND]: Landmark,
  [TransactionCategory.SALARY]: Wallet,
  [TransactionCategory.TRANSFER]: ArrowLeftRight,
  [TransactionCategory.EDUCATION]: GraduationCap,
  [TransactionCategory.RENT]: House,
  [TransactionCategory.TAX]: Receipt,
  [TransactionCategory.OTHER]: CircleHelp,
} as const;

export const transactionTypeOptions = [
  { label: "Credit", value: TransactionType.CREDIT },
  { label: "Debit", value: TransactionType.DEBIT },
  { label: "Transfer", value: TransactionType.TRANSFER },
];

export const transactionStatusOptions = [
  { label: "Pending", value: TransactionStatus.PENDING },
  { label: "Completed", value: TransactionStatus.COMPLETED },
  { label: "Failed", value: TransactionStatus.FAILED },
  { label: "Reversed", value: TransactionStatus.REVERSED },
];

export const transactionCategoryOptions = [
  { label: "Food & Dining", value: TransactionCategory.FOOD_AND_DINING },
  { label: "Shopping", value: TransactionCategory.SHOPPING },
  { label: "Groceries", value: TransactionCategory.GROCERIES },
  { label: "Transport", value: TransactionCategory.TRANSPORT },
  { label: "Healthcare", value: TransactionCategory.HEALTHCARE },
  { label: "Insurance", value: TransactionCategory.INSURANCE },
  { label: "Utilities", value: TransactionCategory.UTILITIES },
  { label: "Entertainment", value: TransactionCategory.ENTERTAINMENT },
  { label: "Investment", value: TransactionCategory.INVESTMENT },
  { label: "Dividend", value: TransactionCategory.DIVIDEND },
  { label: "Salary", value: TransactionCategory.SALARY },
  { label: "Transfer", value: TransactionCategory.TRANSFER },
  { label: "Education", value: TransactionCategory.EDUCATION },
  { label: "Rent", value: TransactionCategory.RENT },
  { label: "Tax", value: TransactionCategory.TAX },
  { label: "Other", value: TransactionCategory.OTHER },
];

type ConfirmAction = "create" | "update" | "delete";

export function TransactionsPage() {
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);
  const [confirmAction, setConfirmAction] =
    useState<ConfirmAction | null>(null);


  const isEditMode = selectedTransaction !== null;
  const pageSize = 10;

  //hooks
  const {
    transactions,
    page,
    totalPages,
    isLoading,
  } = useTransactions(pageNumber, pageSize);
  const { summary } = useTransactionSummary();
  const { accounts } = useAccounts();
  const { createTransaction, isCreatePending } = useCreateTransaction();
  const {updateTransaction,updateTransactionPending} = useUpdateTransaction();
  const {deleteTransaction} = useDeleteTransaction();
  const { downloadAttachment} =
  useDownloadTransactionAttachment
  (); 


  const summaryCards: TransactionStatCardProps[] = [
    {
      title: "Total Balance",
      value: summary?.totalBalance,
      icon: Wallet,
      accent: "blue",
    },
    {
      title: "Pending Amount",
      value: summary?.pendingAmount,
      subtitle: `${summary?.pendingTransactions} pending transactions`,
      icon: Clock,
      accent: "amber",
    },
    {
      title: "Monthly Spend",
      value: summary?.monthlySpend,
      icon: TrendingDown,
      accent: "red",
    },
    {
      title: "Dividends",
      value: summary?.dividends,
      icon: Landmark,
      accent: "green",
    },
  ];
  const accountOptions = accounts?.map((account) => ({
    label: account.accountName,
    value: account.id,
  })) ?? [];

  const methods = useForm<TransactionFormValues >({
    mode: "onBlur",
    defaultValues: {
      accountId: "",
      amount: 0,
      type: TransactionType.DEBIT,
      category: TransactionCategory.OTHER,
      status: TransactionStatus.PENDING,
      transactionDate: "",
      merchantName: "",
      notes: "",
      attachmentUrl: null,
    },
  });

  const onSubmit = methods.handleSubmit(() => {
    setConfirmAction(isEditMode ? "update" : "create");
    setOpen(false);
    setConfirmOpen(true);
  });

  const handleConfirmSubmit = async () => {
    const values = methods.getValues();
    


    switch (confirmAction) {
      case "create":
        await createTransaction(values);
        break;

      case "update":
        await updateTransaction({
            id: selectedTransaction!.id,
            payload:values,
        });
        break;

      case "delete":
        await deleteTransaction(selectedTransaction!.id);
        break;
    }

    methods.reset();

    setSelectedTransaction(null);
    setConfirmAction(null);
    setOpen(false);
    setConfirmOpen(false);
  };



  return (
    <>
      <PageShell title="Transactions" showBackButton
        subtitle="View and manage your recent activity across all accounts."
        exportAction={{
          label: 'Export Report',
          onClick: () => downloadAttachment(),
        }}
        createAction={{
          label: "Create New Transaction",
          onClick: () => {
            setSelectedTransaction(null);

            methods.reset({
              accountId: "",
              amount: 0,
              type: TransactionType.DEBIT,
              category: TransactionCategory.OTHER,
              status: TransactionStatus.PENDING,
              transactionDate: "",
              merchantName: "",
              notes: "",
              attachmentUrl: null,
            });

            setConfirmAction("create");
            setOpen(true);
          },
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10 slide-down">
          {summaryCards.map((card) => (
            <TransactionStatCard
              key={card.title}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              accent={card.accent}
            />
          ))}
        </div>

        <Table.Root
          pagination={{
            currentPage: (page ?? 0) + 1,
            totalPages: totalPages ?? 1,
            onPageChange: (selectedPage) => {
              setPageNumber(selectedPage - 1);
            },
          }}
        >
          <Table.Header>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Transaction</Table.HeaderCell>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell align="right">Amount</Table.HeaderCell>
            <Table.HeaderCell align="center">Actions</Table.HeaderCell>
          </Table.Header>

          <Table.Body>
            {!isLoading && (transactions ?? []).length === 0 && (
              <Table.Row>
                <Table.Cell align="center" className="py-12" colSpan={7} >
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">No transactions yet</p>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        Start by creating your first transaction to see it here.
                      </p>
                    </div>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}

            {(transactions ?? []).map((transaction) => {
              const CategoryIcon = transactionCategoryIcons[transaction.category];
              return (

                <Table.Row key={transaction.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-medium text-on-surface">
                        {new Date(transaction.transactionDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>

                      <span className="text-xs text-on-surface-variant">
                        {new Date(transaction.transactionDate).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-[#d6e3ff] text-on-surface">
                        <CategoryIcon size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-on-surface">
                          {transaction.merchantName}
                        </p>

                        <p className="text-xs text-on-surface-variant">
                          {transaction.notes}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <span className="font-medium">
                      {transaction.category.replaceAll("_", " ")}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${transaction.type === "CREDIT"
                        ? "bg-[#e5f4f0] text-success"
                        : transaction.type === "DEBIT"
                          ? "bg-[#fdecec] text-red-600"
                          : "bg-[#eef2ff] text-primary"
                        }`}
                    >
                      {transaction.type}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${transaction.status === "COMPLETED"
                        ? "bg-[#e5f4f0] text-success"
                        : transaction.status === "PENDING"
                          ? "bg-[#fff7e6] text-warning"
                          : transaction.status === "FAILED"
                            ? "bg-[#fdecec] text-red-600"
                            : "bg-[#eef2ff] text-primary"
                        }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {transaction.status}
                    </span>
                  </Table.Cell>

                  <Table.Cell align="right">
                    <span
                      className={`font-bold ${transaction.type === "CREDIT"
                        ? "text-success"
                        : "text-red-600"
                        }`}
                    >
                      {transaction.type === "CREDIT" ? "+" : "-"}₹
                      {transaction.amount.toLocaleString()}
                    </span>
                  </Table.Cell>

                  <Table.Cell align="center">
                    <div className="flex items-center justify-center gap-2">
                      
                    <ActionsMenu
                      actions={[
                        {
                          label: "Edit", icon: Pencil,
                          onClick: () => {
                            setSelectedTransaction(transaction);

                            methods.reset({
                              accountId: transaction.accountId,
                              amount: transaction.amount,
                              type: transaction.type,
                              category: transaction.category,
                              status: transaction.status,
                              transactionDate: transaction.transactionDate,
                              merchantName: transaction.merchantName,
                              notes: transaction.notes,
                              attachmentUrl: transaction.attachmentUrl,
                            });

                            setConfirmAction("update");
                            setOpen(true);
                          }
                        },
                        { label: "View Details", icon: Eye, onClick: () => setViewTransaction(transaction) },
                        {
                          label: "Delete", icon: Ban,
                          onClick: () => {
                            setSelectedTransaction(transaction);

                            setConfirmAction("delete");
                            setConfirmOpen(true);
                          },
                          variant: "destructive"
                        },
                      ]}
                    />
                    </div>
                  </Table.Cell>
                </Table.Row>
              )
            }

            )}
          </Table.Body>
        </Table.Root>


      </PageShell>

      {
        open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 slide-down">
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              title={
                isEditMode
                  ? "Edit Transaction"
                  : "New Transaction"
              }

              description={
                isEditMode
                  ? "Update transaction information"
                  : "Create a new transaction"
              }

              loading={
                isCreatePending || updateTransactionPending
              }
              size='lg'
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
                    form="create-transaction-form"
                    className="rounded-md flex justify-center items-center gap-1 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    <Check size={16} />
                    {isEditMode ? "Update Transaction" : "Create Transaction"}
                  </button>
                </>
              }
            >
              <FormProvider {...methods}>
                <form
                  id="create-transaction-form"
                  onSubmit={onSubmit}
                  className="flex flex-col gap-4"
                >
                  <FormSelect
                    name="accountId"
                    label="Account"
                    options={accountOptions}
                    rules={{
                      required: "Please select an account",
                    }}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormCurrencyInput
                      name="amount"
                      label="Amount"
                      rules={{
                        required: "Amount is required",
                        min: {
                          value: 0.01,
                          message: "Amount must be greater than zero",
                        },
                      }}
                    />

                    <FormDateTimePicker name="transactionDate" label="Date" rules={{ required: "Date is required" }} />

                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      name="type"
                      label="Transaction Type"
                      options={transactionTypeOptions}
                      rules={{
                        required: "Please select a transaction type",
                      }}
                    />

                    <FormSelect
                      name="status"
                      label="Status"
                      options={transactionStatusOptions}
                      rules={{
                        required: "Please select a status",
                      }}
                    />
                  </div>

                  <FormSelect
                    name="category"
                    label="Category"
                    options={transactionCategoryOptions}
                    rules={{
                      required: "Please select a category",
                    }}
                  />

                  <FormInput
                    name="merchantName"
                    label="Merchant"
                    placeholder="e.g. Amazon"
                    rules={{
                      required: "Merchant name is required",
                    }}
                  />

                  <FormTextArea
                    name="notes"
                    label="Notes"
                    placeholder="Optional notes"
                    rows={3}
                    rules={{
                      validate: (value) => {
                        if (!value) return true; // field is optional — empty is fine
                        const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
                        return wordCount <= 20 || `Notes must be 20 words or fewer (currently ${wordCount})`;
                      },
                    }}
                  />

                  {/* Replace with your reusable FormFileUpload if you have one */}
                  <FormFileUpload name="attachment" label="Attachment" hint="Click to upload or drag file" />
                </form>
              </FormProvider>

            </Modal>
          </div>

        )
      }

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        variant={
          confirmAction === "delete"
            ? "warning"
            : "info"
        }
        title={
          confirmAction === "create"
            ? "Create this transaction?"
            : confirmAction === "update"
              ? "Update this transaction?"
              : "Delete this transaction?"
        }
        description={
          confirmAction === "create"
            ? "Are you sure you want to create this transaction?"
            : confirmAction === "update"
              ? "Are you sure you want to update this transaction?"
              : "Are you sure you want to delete this transaction? This action cannot be undone."
        }
        confirmLabel={
          confirmAction === "create"
            ? "Create Transaction"
            : confirmAction === "update"
              ? "Update Transaction"
              : "Delete Transaction"
        }
        onConfirm={handleConfirmSubmit}
      />

      <Modal
        open={viewTransaction !== null}
        onClose={() => setViewTransaction(null)}
        title="Transaction Details"
        description="Attachment"
        size="lg"
      >
        {viewTransaction?.attachmentUrl ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-4 py-3 text-sm">
              <div>
                <p className="font-semibold text-on-surface">
                  {viewTransaction.merchantName}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {new Date(viewTransaction.transactionDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <span className={`font-bold ${viewTransaction.type === "CREDIT" ? "text-success" : "text-red-600"}`}>
                {viewTransaction.type === "CREDIT" ? "+" : "-"}₹
                {viewTransaction.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex w-full max-h-[55vh] items-center justify-center overflow-hidden rounded-lg bg-black/5 p-2">
              <img
                src={viewTransaction.attachmentUrl}
                alt={viewTransaction.merchantName}
                className="max-h-[50vh] max-w-full rounded-lg object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant">
              <Receipt size={20} />
            </div>
            <div>
              <p className="font-semibold text-on-surface">No attachment</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                This transaction does not have an attachment.
              </p>
            </div>
          </div>
        )}
      </Modal>

    </>
  )
}
