import { PageShell } from '@/components/common/PageShell'
import { TransactionStatCard, type TransactionStatCardProps } from '../component/TransactionStatCard'
import { ArrowLeftRight, Ban, Car, CircleHelp, Clock, Eye, Film, GraduationCap, HeartPulse, House, Landmark, MoreVertical, Pencil, Receipt, Shield, ShoppingBag, ShoppingCart, TrendingDown, TrendingUp, UtensilsCrossed, Wallet, Zap, type LucideIcon } from 'lucide-react'
import { useTransactions, useTransactionSummary } from '../hooks/useTransaction';
import { Table } from '@/components/tables'
import { useState } from 'react';
import { TransactionCategory } from '../types/transactions.type';
import { ActionsMenu } from '@/components/menu/Actionmenu';


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

export function TransactionsPage() {
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 10;
  const {
    transactions,
    page,
    totalPages,
    isLoading,
  } = useTransactions(pageNumber, pageSize);
  const { summary } = useTransactionSummary();
  

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
  return (
    <>
      <PageShell title="Transactions"
        subtitle="View and manage your recent activity across all accounts."
        exportAction={{
          label: 'Export Report',
          onClick: () => console.log('Exporting report...'),
        }}
        createAction={{
          label: 'Link New Account',
          onClick: () => {
            console.log('Linking new account...')
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
                    <ActionsMenu
                      actions={[
                        {
                          label: "Edit", icon: Pencil,
                          onClick: () => {
                            console.log(`Edit transaction: ${transaction.id}`);
                          }
                        },
                        { label: "View Details", icon: Eye, onClick: () => alert("View details") },
                        {
                          label: "Delete", icon: Ban,
                          onClick: () => {
                           console.log(`delete transaction: ${transaction.id}`);
                          },
                          variant: "destructive"
                        },
                      ]}
                    />
                  </Table.Cell>
                </Table.Row>
              )
            }

            )}
          </Table.Body>
        </Table.Root>


      </PageShell>
    </>
  )
}
