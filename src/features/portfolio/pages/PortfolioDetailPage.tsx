import { useParams } from "react-router-dom";
import { useCreateHolding, useDeleteHolding, useHoldings, usePortfolio, usePortfolioAllocation, usePortfolioPerformance, useStockSearch, useUpdateHolding } from "../hooks/usePortfolio";
import { PageShell } from "@/components/common/PageShell";
import { PortfolioPerformanceChart } from "../components/PortfolioPeformanceChart";
import { useState } from "react";
import type { ConfirmAction, CreateHoldingPayload, Holding, PortfolioPeriod } from "../types/portfolio.types";
import { PortfolioAllocationChart } from "../components/PeformanceAllocation";
import { Table } from "@/components/tables/Table";
import { cn } from "@/lib/utils";
import { Ban, Check, Pencil, TrendingDown, TrendingUp } from "lucide-react";
import { ActionsMenu } from "@/components/menu/Actionmenu";
import { Modal } from "@/components/modal/Modal";
import { FormCurrencyInput,FormInput} from '@/components/form';
import { FormProvider, useForm } from 'react-hook-form';
import { ConfirmModal } from "@/components/modal/Confirmmodal";
import { FormStockSearch } from "../components/FormStockSearch";


export function PortfolioDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [period, setPeriod] = useState<PortfolioPeriod>("M1");
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedHolding, setSelectedHolding] =
        useState<Holding | null>(null);
    const [confirmAction, setConfirmAction] =
        useState<ConfirmAction | null>(null);
    const isEditMode = selectedHolding !== null;
    const [symbolQuery, setSymbolQuery] = useState("");


    //hooks to fetch portfolio data, performance data, and allocation data
    const { portfolio} = usePortfolio(id!);
    const { performance, performanceLoading, performanceError } = usePortfolioPerformance(id!, period);
    const { allocation, allocationLoading, allocationError } = usePortfolioAllocation(id!);
    const { holdings, holdingsLoading, holdingsIsError } = useHoldings(id!);
    const { results, isSearching, isError: stockSearchError } = useStockSearch(symbolQuery);
    const { createHolding } = useCreateHolding(id!);
    const { updateHolding } = useUpdateHolding(id!);
    const { deleteHolding } = useDeleteHolding(id!);



    const totalReturn =
        (portfolio?.currentValue ?? 0) - (portfolio?.totalInvested ?? 0);

    const isPositive = totalReturn >= 0;

    const methods = useForm<CreateHoldingPayload
    >({
        mode: "onBlur",
        defaultValues: {
            symbol: "",
            quantity: 1,
            averageCostBasis: 0,
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

                await createHolding(values);
                break;

            case "update":
                const updatePayload = {
                    quantity: values.quantity,
                    averageCostBasis: values.averageCostBasis,
                };
                await updateHolding({
                    holdingId: selectedHolding!.id,
                    payload: updatePayload,
                });
                break;

            case "delete":
                await deleteHolding(selectedHolding!.id);
                break;
        }

        methods.reset();

        setSelectedHolding(null);
        setConfirmAction(null);
        setOpen(false);
        setConfirmOpen(false);
    };


    return (
        <>
            <PageShell title={portfolio?.name} showBackButton
                exportAction={{
                    label: 'Export Report',
                    onClick: () => console.log('Exporting report...'),
                }}
                createAction={{
                    label: 'Create Holding',
                    onClick: () => {
                        setSelectedHolding(null);

                        methods.reset({
                            symbol: "",
                            quantity: 1,
                            averageCostBasis: 0,
                        });

                        setConfirmAction("create");
                        setOpen(true);
                    }
                }}
            >
                <div className="mb-8">
                    {/* <p className="text-sm font-medium text-on-surface-variant">
                        {portfolio?.riskLevel} Portfolio
                    </p> */}

                    <div className="mt-1 flex items-end gap-4">
                        <h1 className="text-5xl font-bold tracking-tight text-on-surface">
                            $
                            {(portfolio?.currentValue ?? 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </h1>

                        <span
                            className={`mb-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${isPositive
                                ? "bg-[#e5f4f0] text-success"
                                : "bg-[#fdecec] text-red-600"
                                }`}
                        >
                            {isPositive ? "+" : ""}
                            {portfolio?.totalReturnPercent.toFixed(2)}% (
                            {isPositive ? "+" : ""}
                            $
                            {Math.abs(totalReturn).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                            )
                        </span>
                    </div>
                </div>

                <div className="flex gap-6 ">
                    {/* Portfolio Performance Chart */}
                    <div className="flex-2">
                        <PortfolioPerformanceChart
                            performance={performance}
                            isLoading={performanceLoading}
                            isError={performanceError}
                            period={period}
                            onPeriodChange={setPeriod}
                        />
                    </div>
                    <div className="flex-1">
                        <PortfolioAllocationChart allocation={allocation} isLoading={allocationLoading} isError={allocationError} />
                    </div>
                </div>

                {/* Holdings Table */}
                <div className="mt-8 overflow-hidden rounded-3xl border border-outline/30 bg-surface shadow-card">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h3 className="text-lg font-bold text-on-surface">Top Holdings</h3>
                        <button
                            type="button"
                            onClick={() => console.log("View all holdings")}
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            View All {holdings?.length ?? 0} Holdings
                        </button>
                    </div>

                    <Table.Root>
                        <Table.Header>
                            <Table.HeaderCell>Asset</Table.HeaderCell>
                            <Table.HeaderCell align="right">Price</Table.HeaderCell>
                            <Table.HeaderCell align="right">24H Change</Table.HeaderCell>
                            <Table.HeaderCell align="right">Shares</Table.HeaderCell>
                            <Table.HeaderCell align="right">Market Value</Table.HeaderCell>
                            <Table.HeaderCell align="right">Unrealized G/L</Table.HeaderCell>
                            <Table.HeaderCell align="center">Actions</Table.HeaderCell>
                        </Table.Header>

                        <Table.Body>
                            {holdingsLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                                        Loading holdings...
                                    </td>
                                </tr>
                            ) : holdingsIsError ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-red-600">
                                        Failed to load holdings.
                                    </td>
                                </tr>
                            ) : !holdings || holdings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                                        No holdings yet.
                                    </td>
                                </tr>
                            ) : (
                                holdings.map((holding) => {
                                    const dayUp = holding.dayChangePercent >= 0;
                                    const gainUp = holding.totalReturnPercent >= 0;
                                    const unrealizedGL =
                                        holding.currentValue - holding.quantity * holding.averageCostBasis;

                                    return (
                                        <Table.Row key={holding.id}>
                                            <Table.Cell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d6e3ff] text-sm font-bold text-on-surface">
                                                        {holding.symbol.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-on-surface">{holding.symbol}</p>
                                                        <p className="truncate text-xs text-on-surface-variant">
                                                            {holding.companyName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Table.Cell>

                                            <Table.Cell align="right">
                                                <span className="font-medium text-on-surface">
                                                    ${holding.currentPrice.toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </span>
                                            </Table.Cell>

                                            <Table.Cell align="right">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1 font-semibold",
                                                        dayUp ? "text-success" : "text-red-600"
                                                    )}
                                                >
                                                    {dayUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                    {dayUp ? "+" : ""}
                                                    {holding.dayChangePercent.toFixed(2)}%
                                                </span>
                                            </Table.Cell>

                                            <Table.Cell align="right">
                                                <span className="text-on-surface">
                                                    {holding.quantity.toLocaleString()}
                                                </span>
                                            </Table.Cell>

                                            <Table.Cell align="right">
                                                <span className="font-semibold text-on-surface">
                                                    ${holding.currentValue.toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </span>
                                            </Table.Cell>

                                            <Table.Cell align="right">
                                                <div className="flex flex-col items-end">
                                                    <span className={cn("font-bold", gainUp ? "text-success" : "text-red-600")}>
                                                        {gainUp ? "+" : ""}
                                                        ${unrealizedGL.toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            "text-xs font-medium",
                                                            gainUp ? "text-success" : "text-red-600"
                                                        )}
                                                    >
                                                        {gainUp ? "+" : ""}
                                                        {holding.totalReturnPercent.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell align="center">
                                                <ActionsMenu
                                                    actions={[
                                                        {
                                                            label: "Edit", icon: Pencil,
                                                            onClick: () => {
                                                                setSelectedHolding(holding);

                                                                methods.reset({
                                                                    symbol: holding.symbol,
                                                                    quantity: holding.quantity,
                                                                    averageCostBasis: holding.averageCostBasis,
                                                                });

                                                                setConfirmAction("update");
                                                                setOpen(true);
                                                            }
                                                        },
                                                        // { label: "View Details", icon: Eye, onClick: () => alert(`View details for account: ${account.accountName}`) },
                                                        {
                                                            label: "Delete Holding", icon: Ban,
                                                            onClick: () => {
                                                                setSelectedHolding(holding);

                                                                setConfirmAction("delete");
                                                                setConfirmOpen(true);
                                                            },
                                                            variant: "destructive"
                                                        },
                                                    ]}
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })
                            )}
                        </Table.Body>
                    </Table.Root>
                </div>
            </PageShell>
            {
                open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 slide-down">
                        <Modal
                            open={open}
                            onClose={() => setOpen(false)}
                            title={"Create Holding"}
                            description={"Create a new holding"}
                            //   loading={isPending || updatePending}
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
                                        {"Create Account"}
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
                                    {/* add the search bar  in here */}

                                    {isEditMode ? (
                                        <div>
                                            <label className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                                                Stock
                                            </label>
                                            <div className="mt-1.5 flex items-center justify-between rounded-md border border-outline/30 bg-surface-container-low px-3 py-2 text-sm">
                                                <div className="min-w-0">
                                                    <span className="font-semibold text-on-surface">{selectedHolding?.symbol}</span>
                                                    {selectedHolding?.companyName && (
                                                        <span className="ml-2 truncate text-on-surface-variant">{selectedHolding.companyName}</span>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    ) : (
                                        <FormStockSearch
                                            name="symbol"
                                            label="Stock"
                                            placeholder="Search by company name or symbol"
                                            query={symbolQuery}
                                            onQueryChange={setSymbolQuery}
                                            results={results}
                                            isSearching={isSearching}
                                            isError={stockSearchError}
                                            rules={{ required: "Please select a stock" }}
                                        />
                                    )}



                                    <div className="grid grid-cols-2 gap-4">

                                        <FormInput
                                            name="quantity"
                                            type="number"
                                            label="Quantity"
                                            rules={{
                                                required: "Quantity is required",
                                                min: {
                                                    value: 1,
                                                    message: "Quantity must be at least 1",
                                                },
                                            }}
                                        />


                                        <FormCurrencyInput
                                            name="averageCostBasis"
                                            label="Average Cost Basis"
                                            rules={{
                                                required: "Average cost is required",
                                                min: {
                                                    value: 0.01,
                                                    message: "Average cost must be greater than zero",
                                                },
                                            }}
                                        />

                                    </div>
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
                        ? "Create this holding?"
                        : confirmAction === "update"
                            ? "Update this holding?"
                            : "Delete this holding?"
                }
                description={
                    confirmAction === "create"
                        ? "Are you sure you want to create this holding?"
                        : confirmAction === "update"
                            ? "Are you sure you want to update this holding?"
                            : "Are you sure you want to delete this holding? This action cannot be undone."
                }
                confirmLabel={
                    confirmAction === "create"
                        ? "Create Holding"
                        : confirmAction === "update"
                            ? "Update Holding"
                            : "Delete Holding"
                }
                onConfirm={handleConfirm}
            />
        </>
    )
}


