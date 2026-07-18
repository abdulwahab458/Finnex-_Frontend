# Reusable Form System (React Hook Form + TypeScript + Tailwind)

## Install

```bash
npm install react-hook-form lucide-react
```

## Folder structure

```
lib/
  utils.ts                 cn() classname helper + getFieldError() nested-path lookup

components/
  form/
    types.ts               BaseFieldProps<T>, FieldRules<T>, SelectOption
    fieldStyles.ts          shared Tailwind "shell" class for every input-like control
    FormFieldWrapper.tsx    label + required asterisk + helper text + error (used by ALL fields)
    FormInput.tsx           text / email / password / number / tel / url
    FormCurrencyInput.tsx   money input ($ prefix, formatted, Controller-based)
    FormTextArea.tsx
    FormSelect.tsx
    FormDatePicker.tsx
    FormCheckbox.tsx
    FormSwitch.tsx
    FormRadioGroup.tsx      "stacked" radios OR "segmented" tab-style group
    FormFileUpload.tsx      drag/drop attachment field (example of a fully custom field)
    index.ts                barrel export

  modal/
    Modal.tsx               layout-only: title, description, children, footer, loading

examples/
  NewTransactionModal.tsx   full real-world usage, reproduces the provided screenshot
```

## Why it's built this way

**One context, not prop-drilling.**
Every field reads `register` / `control` / `errors` off `useFormContext()`. You wrap a screen
once in `<FormProvider {...methods}>`, and every `FormInput` / `FormSelect` / etc. underneath
it just works — no passing `register` or `errors` down through component trees.

**Validation lives with the caller, not the component.**
No field hardcodes a validation rule. Every component accepts a typed `rules` prop
(`FieldRules<T>`, a constrained version of RHF's `RegisterOptions`) and forwards it straight
into `register(name, rules)` or `<Controller rules={rules}>`. The reusable component's only
job is to *render* the resulting error — it never decides what's invalid.

```tsx
<FormInput
  name="accountName"
  label="Account Name"
  rules={{
    required: "Account name is required",
    minLength: { value: 3, message: "Minimum 3 characters" },
  }}
/>
```

**One error-rendering path.**
`FormFieldWrapper` is the only place that renders the required asterisk, helper text, and
error message. Every field composes it, so error/label/helper styling can never drift between
field types. `getFieldError()` in `lib/utils.ts` resolves `errors` by dot-path (`"address.city"`,
`"items.0.amount"`) so nested and array fields work without any extra code in the fields
themselves.

**register() where possible, Controller where necessary.**
`FormInput`, `FormTextArea`, `FormSelect`, and `FormCheckbox` use plain `register()` — the
cheapest path, no re-renders on every keystroke beyond RHF's own. `FormCurrencyInput`,
`FormDatePicker`, `FormSwitch`, `FormRadioGroup`, and `FormFileUpload` use `Controller` because
their underlying value isn't a plain DOM input value (formatted currency string, toggle
boolean, custom dropzone, etc.).

**Full type safety with generics.**
Every component is generic over `TFieldValues extends FieldValues`, and `name` is typed as
`Path<TFieldValues>` — so if you type your form's shape and pass it through
`useForm<TransactionFormValues>()`, every `name="..."` prop across every field is
autocompleted and typechecked against your actual schema. Typo a field name and TypeScript
catches it at compile time, not at runtime.

**Modal knows nothing about forms.**
`Modal` takes `title`, `description`, `children`, `footer`, `open`, `onClose`, `loading` — and
renders exactly that layout. It has zero knowledge of `react-hook-form`. Any form (or anything
else) can be dropped in as `children`; the submit button lives in `footer` and points at the
form via `form="form-id"` + `type="submit"`, so Modal and the form underneath are fully
decoupled.

**Adding a new field type.**
Copy the shape of `FormFileUpload.tsx` (the "fully custom" example): accept `name`, `label`,
`rules`, `helperText`, `disabled` like every other field, pull `error` via `getFieldError`,
render through `FormFieldWrapper`, and either `register()` or `Controller` depending on
whether the control produces a plain DOM value. Export it from `components/form/index.ts`.
No other file needs to change.

## Usage

```tsx
import { FormProvider, useForm } from "react-hook-form";
import { FormInput, FormSelect, FormCurrencyInput } from "@/components/form";
import { Modal } from "@/components/modal/Modal";

function EditAccountModal() {
  const methods = useForm<{ name: string; type: string; balance: string }>();

  return (
    <Modal open onClose={() => {}} title="Edit Account" footer={<button form="account-form">Save</button>}>
      <FormProvider {...methods}>
        <form id="account-form" onSubmit={methods.handleSubmit(console.log)}>
          <FormInput name="name" label="Account Name" rules={{ required: "Required" }} />
          <FormSelect name="type" label="Type" options={[{ label: "Checking", value: "checking" }]} />
          <FormCurrencyInput name="balance" label="Balance" rules={{ required: "Required", min: { value: 0, message: "Can't be negative" } }} />
        </form>
      </FormProvider>
    </Modal>
  );
}
```

See `examples/NewTransactionModal.tsx` for the complete, production-shaped example matching
the "New Transaction" screenshot (segmented transaction-type tabs, currency + date side by
side, account/category selects, merchant input, notes textarea, drag/drop attachment).
