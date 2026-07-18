import type { FieldValues, Path, RegisterOptions } from "react-hook-form";

/**
 * The subset of RHF's RegisterOptions we let consumers pass in.
 * We strip out the options that only make sense on <Controller/>-driven
 * fields (valueAsNumber etc. are handled internally per-component instead,
 * so behaviour stays predictable regardless of which field type is used).
 */
export type FieldRules<TFieldValues extends FieldValues = FieldValues> = Omit<
  RegisterOptions<TFieldValues, Path<TFieldValues>>,
  "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
>;

/**
 * Props every reusable field component shares. Concrete components
 * (FormInput, FormSelect, ...) extend this with only what they need
 * (options, rows, min/max, etc).
 */
export interface BaseFieldProps<TFieldValues extends FieldValues = FieldValues> {
  /** Dot-path into the form's values, e.g. "amount" or "address.city" */
  name: Path<TFieldValues>;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  /** Forwarded straight to RHF's register/Controller rules */
  rules?: FieldRules<TFieldValues>;
  className?: string;
  /** Explicit override for the required asterisk; inferred from rules.required if omitted */
  required?: boolean;
  "data-testid"?: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}
