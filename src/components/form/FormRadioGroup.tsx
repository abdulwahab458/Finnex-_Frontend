
import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { getFieldError,cn } from "@/lib/utils";
import type { BaseFieldProps, SelectOption } from "./types";

export interface FormRadioGroupProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldProps<TFieldValues> {
  options: SelectOption[];
  /**
   * "stacked"   - traditional radio circles, one per line
   * "segmented" - pill-style tab group (e.g. Expense / Income / Transfer)
   */
  variant?: "stacked" | "segmented";
}

export function FormRadioGroup<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  disabled,
  rules,
  className,
  required,
  options,
  variant = "stacked",
}: FormRadioGroupProps<TFieldValues>) {
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
        render={({ field }) =>
          variant === "segmented" ? (
            <div className="grid grid-cols-3 gap-1 rounded-md bg-gray-100 p-1" role="radiogroup">
              {options.map((opt) => {
                const active = field.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={disabled || opt.disabled}
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                      active ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700",
                      (disabled || opt.disabled) && "cursor-not-allowed opacity-50"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2" role="radiogroup">
              {options.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 text-sm text-gray-700",
                    (disabled || opt.disabled) && "cursor-not-allowed opacity-60"
                  )}
                >
                  <input
                    type="radio"
                    name={name}
                    disabled={disabled || opt.disabled}
                    checked={field.value === opt.value}
                    onChange={() => field.onChange(opt.value)}
                    className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          )
        }
      />
    </FormFieldWrapper>
  );
}
