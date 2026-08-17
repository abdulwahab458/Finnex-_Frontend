
import { useFormContext, type FieldValues } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { fieldShellClass } from "./fieldStyles";
import { getFieldError,cn } from "@/lib/utils";
import type { BaseFieldProps, SelectOption } from "./types";

export interface FormSelectProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldProps<TFieldValues> {
  options: SelectOption[];
  placeholder?: string;
}

export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  disabled,
  rules,
  className,
  required,
  options,
  placeholder = "Select an option",
}: FormSelectProps<TFieldValues>) {
  const {
    register,
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
      <div className="relative">
        <select
          id={name}
          disabled={disabled}
          defaultValue=""
          aria-invalid={Boolean(error)}
          className={cn(
            fieldShellClass({ hasError: Boolean(error), disabled }),
            "appearance-none pr-9"
          )}
          {...register(name, rules)}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </FormFieldWrapper>
  );
}
