import  { useRef } from "react";
import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { CalendarClock } from "lucide-react";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { fieldShellClass } from "./fieldStyles";
import { getFieldError, cn } from "../../lib/utils";
import type { BaseFieldProps } from "./types";

export interface FormDateTimePickerProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldProps<TFieldValues> {
  min?: string;
  max?: string;
}

/**
 * Native <input type="datetime-local"> wrapped via Controller. Its value
 * format is "YYYY-MM-DDTHH:mm" (no seconds, no timezone) — that's already
 * a near-exact match for a backend expecting "2026-07-01T15:30:00", so
 * converting is a one-line string append rather than a real date library.
 * Use `toBackendDateTime()` below right before sending the request.
 */
export function FormDateTimePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  disabled,
  rules,
  className,
  required,
  min,
  max,
}: FormDateTimePickerProps<TFieldValues>) {
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
              type="datetime-local"
              min={min}
              max={max}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              className={cn(
                fieldShellClass({ hasError: Boolean(error), disabled, extra: "pr-9" }),
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
              <CalendarClock size={16} />
            </button>
          </div>
        )}
      />
    </FormFieldWrapper>
  );
}

/**
 * Converts a datetime-local value ("2026-07-14T15:30") into the
 * backend's expected shape ("2026-07-14T15:30:00") by appending seconds
 * if they're missing. Safe to call on an already-complete string too.
 */
export function toBackendDateTime(value: string): string {
  if (!value) return value;
  return value.length === 16 ? `${value}:00` : value;
}