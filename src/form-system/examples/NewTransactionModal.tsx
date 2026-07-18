// import React, { useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import { Modal } from "../components/modal/Modal";
// import {
//   FormCurrencyInput,
//   FormDatePicker,
//   FormSelect,
//   FormInput,
//   FormTextArea,
//   FormFileUpload,
//   FormRadioGroup,
// } from "../../components/form";

// interface TransactionFormValues {
//   type: "expense" | "income" | "transfer";
//   amount: string;
//   date: string;
//   account: string;
//   category: string;
//   merchant: string;
//   notes: string;
//   attachment: FileList | null;
// }

// const accountOptions = [
//   { label: "Priority Checking", value: "priority-checking" },
//   { label: "Savings", value: "savings" },
//   { label: "Credit Card", value: "credit-card" },
// ];

// const categoryOptions = [
//   { label: "Food & Dining", value: "food-dining" },
//   { label: "Transport", value: "transport" },
//   { label: "Utilities", value: "utilities" },
//   { label: "Rent", value: "rent" },
// ];

// /**
//  * This is a full, real usage example — every field here is one of the
//  * reusable components from `components/form`, wired up purely through
//  * props. Nothing in this file re-implements labels, validation display,
//  * or error rendering.
//  */
// export function NewTransactionModal({ onCreated }: { onCreated?: (v: TransactionFormValues) => void }) {
//   const [open, setOpen] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const methods = useForm<TransactionFormValues>({
//     mode: "onBlur",
//     defaultValues: {
//       type: "expense",
//       amount: "",
//       date: "",
//       account: "priority-checking",
//       category: "food-dining",
//       merchant: "",
//       notes: "",
//       attachment: null,
//     },
//   });

//   const onSubmit = methods.handleSubmit(async (values) => {
//     setSubmitting(true);
//     try {
//       // await api.createTransaction(values)
//       onCreated?.(values);
//       setOpen(false);
//     } finally {
//       setSubmitting(false);
//     }
//   });

//   return (
//     <Modal
//       open={open}
//       onClose={() => setOpen(false)}
//       title="New Transaction"
//       description="Record financial activity"
//       loading={submitting}
//       footer={
//         <>
//           <button
//             type="button"
//             onClick={() => setOpen(false)}
//             className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             form="new-transaction-form"
//             className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
//           >
//             ✓ Create Transaction
//           </button>
//         </>
//       }
//     >
//       <FormProvider {...methods}>
//         <form id="new-transaction-form" onSubmit={onSubmit} className="flex flex-col gap-4">
//           <FormRadioGroup
//             name="type"
//             label="Transaction Type"
//             variant="segmented"
//             options={[
//               { label: "Expense", value: "expense" },
//               { label: "Income", value: "income" },
//               { label: "Transfer", value: "transfer" },
//             ]}
//           />

//           <div className="grid grid-cols-2 gap-4">
//             <FormCurrencyInput
//               name="amount"
//               label="Amount"
//               rules={{ required: "Amount is required" }}
//             />
//             <FormDatePicker name="date" label="Date" rules={{ required: "Date is required" }} />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <FormSelect
//               name="account"
//               label="Account"
//               options={accountOptions}
//               rules={{ required: "Please select an account" }}
//             />
//             <FormSelect
//               name="category"
//               label="Category"
//               options={categoryOptions}
//               rules={{ required: "Please select a category" }}
//             />
//           </div>

//           <FormInput
//             name="merchant"
//             label="Merchant / Payee"
//             placeholder="e.g. Starbucks, Amazon, Landlord"
//             rules={{ required: "Merchant is required" }}
//           />

//           <FormTextArea
//             name="notes"
//             label="Notes (optional)"
//             placeholder="Add additional details about this transaction..."
//             rows={3}
//           />

//           <FormFileUpload name="attachment" label="Attachment" hint="Click to upload or drag receipt" />
//         </form>
//       </FormProvider>
//     </Modal>
//   );
// }
