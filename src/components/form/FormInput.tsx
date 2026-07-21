import React from "react";
import { useFormContext, type FieldValues } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { fieldShellClass } from "./fieldStyles";
import { getFieldError,cn } from "@/lib/utils";
import type { BaseFieldProps } from "./types";

export interface FormInputProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldProps<TFieldValues>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue" | "className"> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "file";
  /** Rendered inline at the left edge, e.g. "$" for money fields */
  leadingIcon?: React.ReactNode;
}

/**
 * Covers Text / Email / Password / Number / Tel / Url — they're all the
 * same shape (a single <input>), so one component with a `type` prop
 * avoids five near-duplicate files.
 */
export function FormInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  disabled,
  rules,
  className,
  required,
  type = "text",
  prefix,
  placeholder,
  ...inputProps
}: FormInputProps<TFieldValues>) {
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
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {prefix}
          </span>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={cn(fieldShellClass({ hasError: Boolean(error), disabled }), prefix && "pl-6")}
          {...register(name, rules)}
          {...inputProps}
        />
      </div>
    </FormFieldWrapper>
  );
}
