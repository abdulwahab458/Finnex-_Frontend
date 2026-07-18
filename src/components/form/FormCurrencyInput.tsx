
import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { fieldShellClass } from "./fieldStyles";

import type { BaseFieldProps } from "./types";
import { getFieldError } from "@/lib/utils";

export interface FormCurrencyInputProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldProps<TFieldValues> {
  placeholder?: string;
  currencySymbol?: string;
  /** Number of decimal places allowed, default 2 */
  decimals?: number;
}

const stripToNumberString = (raw: string, decimals: number) => {
  let cleaned = raw.replace(/[^0-9.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
  }
  if (decimals === 0) cleaned = cleaned.split(".")[0];
  else if (firstDot !== -1) {
    const [whole, frac] = cleaned.split(".");
    cleaned = `${whole}.${frac.slice(0, decimals)}`;
  }
  return cleaned;
};

/**
 * Money needs its own component because it stores a plain number in form
 * state (for validation with min/max etc.) while *displaying* a formatted
 * "0.00" string — that display/value split is exactly what Controller is
 * for, register() alone can't do it.
 */
export function FormCurrencyInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  disabled,
  rules,
  className,
  required,
  placeholder = "0.00",
  currencySymbol = "$",
  decimals = 2,
}: FormCurrencyInputProps<TFieldValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const error = getFieldError(errors, name);
  const isRequired = required ?? Boolean(rules?.required);

  return (
    <FormFieldWrapper
      label={label}
      htmlFor={name}
      required={isRequired}
      helperText={helperText}
      error={error}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              {currencySymbol}
            </span>
            <input
              id={name}
              inputMode="decimal"
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              className={fieldShellClass({ hasError: Boolean(error), disabled, extra: "pl-6" })}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(stripToNumberString(e.target.value, decimals))}
              onBlur={field.onBlur}
            />
          </div>
        )}
      />
    </FormFieldWrapper>
  );
}
