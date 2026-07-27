import React, { useRef } from "react";
import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { Calendar } from "lucide-react";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { fieldShellClass } from "./fieldStyles";
import { getFieldError, cn } from "../../lib/utils";
import type { BaseFieldProps } from "./types";

export interface FormDatePickerProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldProps<TFieldValues> {
  placeholder?: string;
  min?: string;
  max?: string;
}

/**
 * Wraps a native <input type="date"> via Controller (rather than register)
 * so we can fully control the value format and hide the browser's default
 * calendar icon in favour of our own — while still getting native
 * accessibility, keyboard entry, and the OS date picker on click.
 * Value format is "YYYY-MM-DD" — matches fields like startDate/endDate.
 */
export function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  disabled,
  rules,
  className,
  required,
  placeholder = "dd-mm-yyyy",
  min,
  max,
}: FormDatePickerProps<TFieldValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  const inputRef = useRef<HTMLInputElement>(null);

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
            <input
              id={name}
              ref={inputRef}
              type="date"
              min={min}
              max={max}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              placeholder={placeholder}
              className={cn(
                fieldShellClass({ hasError: Boolean(error), disabled, extra: "pr-9" }),
                // Hide the browser's built-in calendar icon; we render our own.
                "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0"
              )}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            />
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => inputRef.current?.showPicker?.()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
            >
              <Calendar size={16} />
            </button>
          </div>
        )}
      />
    </FormFieldWrapper>
  );
}