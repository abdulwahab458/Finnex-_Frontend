import { PageShell } from '@/components/common/PageShell'
import { Table } from '@/components/tables'
import { Ban, Building2, Check, CreditCard, Eye, Landmark, MoreVertical, Pencil, PiggyBank, Wallet } from 'lucide-react'
import { useAccounts, useCreateAccount, useDeactivateAccount, useUpdateAccount } from '../hooks/useAccounts'
import { useState } from 'react';
import { AccountType, type Account, type CreateAccountPayload } from '../types/accounts.type';
import { Modal } from '@/components/modal/Modal';
import { FormProvider, useForm } from 'react-hook-form';
import { FormCurrencyInput, FormInput, FormSelect } from '@/components/form';
import { ActionsMenu } from '@/components/menu/Actionmenu';
import { ConfirmModal } from '@/components/modal/Confirmmodal';

export const accountIcons = {
  [AccountType.SAVINGS]: PiggyBank,
  [AccountType.CHECKING]: Wallet,
  [AccountType.INVESTMENT]: Landmark,
  [AccountType.CREDIT]: CreditCard,
  [AccountType.MORTGAGE]: Building2,
};

const accountTypeOptions = [
  { label: "Checking", value: AccountType.CHECKING },
  { label: "Savings", value: AccountType.SAVINGS },
  { label: "Investment", value: AccountType.INVESTMENT },
  { label: "Credit", value: AccountType.CREDIT },
  { label: "Mortgage", value: AccountType.MORTGAGE },
];

const currencyOptions = [
  { label: "Kuwaiti Dinar (KWD)", value: "KWD" },
  { label: "US Dollar (USD)", value: "USD" },
  { label: "Euro (EUR)", value: "EUR" },
  { label: "British Pound (GBP)", value: "GBP" },
  { label: "Saudi Riyal (SAR)", value: "SAR" },
  { label: "UAE Dirham (AED)", value: "AED" },
  { label: "Indian Rupee (INR)", value: "INR" },
];

type ConfirmAction = "create" | "update" | "deactivate";

export function AccountsPage() {
  //hooks
  const { accounts, isLoading } = useAccounts();
  const { createAccount, isPending } = useCreateAccount();
  const { updateAccount, updatePending } = useUpdateAccount();
  const { deactivateAccount, deactivatePending } = useDeactivateAccount();

  const [page, setPage] = useState(1);
  const totalPages = 12;

  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [confirmAction, setConfirmAction] =
    useState<ConfirmAction | null>(null);
  const isEditMode = selectedAccount !== null;
  const methods = useForm<CreateAccountPayload>({
    mode: "onBlur",
    defaultValues: {
      accountName: "",
      accountNumber: "",
      accountType: AccountType.SAVINGS,
      currency: "KWD",
      initialBalance: 0,
    },
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
        await createAccount(values);
        break;

      case "update":
        await updateAccount({
          id: selectedAccount!.id,
          accountName: values.accountName,
        });
        break;

      case "deactivate":
        await deactivateAccount(selectedAccount!.id);
        console.log(`Deactivating account with ID: ${selectedAccount!.id}`);
        break;
    }

    methods.reset();
    setSelectedAccount(null);
    setConfirmAction(null);
    setOpen(false);
    setConfirmOpen(false);
  };

  return (
    <>

      <PageShell title="Accounts & Assets"
        subtitle="Comprehensive overview of your financial standing and asset distribution"
        exportAction={{
          label: 'Export Report',
          onClick: () => console.log('Exporting report...'),
        }}
        createAction={{
          label: 'Link New Account',
          onClick: () => {
            setSelectedAccount(null);

            methods.reset({
              accountName: "",
              accountNumber: "",
              accountType: AccountType.SAVINGS,
              currency: "KWD",
              initialBalance: 0,
            });
            setConfirmAction("create");
            setOpen(prev => !prev)

          },
        }}
      >

        <Table.Root
          
        >
          <Table.Header>
            <Table.HeaderCell>Account Name</Table.HeaderCell>
            <Table.HeaderCell>Account Number</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell align="left">Balance</Table.HeaderCell>
            <Table.HeaderCell align="center">Actions</Table.HeaderCell>
          </Table.Header>

          <Table.Body>
            {(accounts ?? []).map((account) => {
              const Icon = accountIcons[account.accountType] || Wallet; // Default to Wallet if no icon is found
              return (
                <Table.Row key={account.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d6e3ff] text-on-surface">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="m-0 font-semibold text-on-surface">{account.accountName}</p>

                      </div>
                    </div>
                  </Table.Cell>

                  <Table.Cell>

                    <span className="font-semibold text-warning">{account.maskedAccountNumber}</span>
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${account.active
                        ? "bg-[#e5f4f0] text-success"
                        : "bg-[#fdecec] text-red-600"
                        }`}
                    >
                      {account.active ? "Active" : "Inactive"}
                    </span>
                  </Table.Cell>

                  <Table.Cell align="left">
                    <span className="font-bold text-on-surface">${account.balance}</span>
                  </Table.Cell>

                  <Table.Cell align="center">
                    <ActionsMenu
                      actions={[
                        {
                          label: "Edit", icon: Pencil,
                          onClick: () => {
                            setSelectedAccount(account);

                            methods.reset({
                              accountName: account.accountName,
                            });
                            setConfirmAction("update");
                            setOpen(true);
                          }
                        },
                        { label: "View Details", icon: Eye, onClick: () => alert(`View details for account: ${account.accountName}`) },
                        {
                          label: "Deactivate", icon: Ban,
                          onClick: () => {
                            setSelectedAccount(account);
                            setConfirmAction("deactivate");
                            setConfirmOpen(true);
                          },
                          variant: "destructive"
                        },
                      ]}
                    />
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </PageShell>
      {
        open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 slide-down">
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              title={isEditMode ? "Edit Account" : "New Account"}
              description={isEditMode ? "Update account information" : "Create a new account"}
              loading={isPending || updatePending}
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
                    form="create-account-form"
                    className="rounded-md flex justify-center items-center gap-1 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    <Check size={16} />
                    {isEditMode ? "Update Account" : "Create Account"}
                  </button>
                </>
              }
            >
              <FormProvider {...methods}>
                <form
                  id="create-account-form"
                  onSubmit={onSubmit}
                  className="flex flex-col gap-4"
                >
                  <FormInput
                    name="accountName"
                    label="Account Name"
                    placeholder="e.g. Primary Savings"
                    rules={{
                      required: "Account name is required",
                      minLength: {
                        value: 3,
                        message: "Account name must be at least 3 characters",
                      },
                    }}
                  />

                  {!isEditMode && (
                    <>
                      <FormInput
                        name="accountNumber"
                        label="Account Number"
                        placeholder="Enter account number"
                        rules={{
                          required: "Account number is required",
                          minLength: {
                            value: 8,
                            message: "Account number is too short",
                          },
                          maxLength: {
                            value: 20,
                            message: "Account number is too long",
                          },
                        }}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormSelect
                          name="accountType"
                          label="Account Type"
                          options={accountTypeOptions}
                          rules={{
                            required: "Please select an account type",
                          }}
                        />

                        <FormSelect
                          name="currency"
                          label="Currency"
                          options={currencyOptions}
                          rules={{
                            required: "Please select a currency",
                          }}
                        />
                      </div>

                      <FormCurrencyInput
                        name="initialBalance"
                        label="Initial Balance"
                        rules={{
                          required: "Initial balance is required",
                          min: {
                            value: 0,
                            message: "Balance cannot be negative",
                          },
                        }}
                      />
                    </>
                  )}
                </form>
              </FormProvider>
            </Modal>
          </div>

        )
      }

      <ConfirmModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);

        }}
        variant={isEditMode ? "warning" : "info"}
        title={
          confirmAction === "create"
            ? "Create this account?"
            : confirmAction === "update"
              ? "Update this account?"
              : "Deactivate this account?"
        }
        description={
          confirmAction === "create"
            ? "Are you sure you want to create this account?"
            : confirmAction === "update"
              ? "Are you sure you want to update this account? This will change its name."
              : "Are you sure you want to deactivate this account? It will no longer be available for transactions."
        }
        confirmLabel={
          confirmAction === "create"
            ? "Create Account"
            : confirmAction === "update"
              ? "Update Account"
              : "Deactivate Account"
        }
        onConfirm={handleConfirm}
      />

    </>
  )
}
