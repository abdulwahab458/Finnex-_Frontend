import { PageShell } from '@/components/common/PageShell'
import { Table } from '@/components/tables'
import { Building2, CreditCard, Landmark, MoreVertical, PiggyBank, Wallet } from 'lucide-react'
import { useAccounts } from '../hooks/useAccounts'
import { useEffect } from 'react';
import { AccountType } from '../types/accounts.type';

export const accountIcons = {
  [AccountType.SAVINGS]: PiggyBank,
  [AccountType.CHECKING]: Wallet,
  [AccountType.INVESTMENT]: Landmark,
  [AccountType.CREDIT]: CreditCard,
  [AccountType.MORTGAGE]: Building2,
};

export function AccountsPage() {
  const { accounts, isLoading, isError, error } = useAccounts();
  useEffect(() => {
    console.log('Accounts data:', accounts);
  }, [accounts]);

  return (
    <PageShell title="Accounts & Assets"
      subtitle="Comprehensive overview of your financial standing and asset distribution"
      exportAction={{
        label: 'Export Report',
        onClick: () => console.log('Exporting report...'),
      }}
      createAction={{
        label: 'Link New Account',
        onClick: () => console.log('Opening link account flow...'),
      }}
    >

      <Table.Root>
        <Table.Header>
          <Table.HeaderCell>Account Name</Table.HeaderCell>
          <Table.HeaderCell>Account Number</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell align="right">Balance</Table.HeaderCell>
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

                <Table.Cell align="right">
                  <span className="font-bold text-on-surface">{account.balance}</span>
                </Table.Cell>

                <Table.Cell align="center">
                  <button type="button" className="text-on-surface-variant hover:text-on-surface">
                    <MoreVertical size={18} />
                  </button>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </PageShell>
  )
}
