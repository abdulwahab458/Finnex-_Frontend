import React from "react";
import { useFormContext, type FieldValues } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { fieldShellClass } from "./fieldStyles";;
import type { BaseFieldProps } from "./types";
import { getFieldError } from "@/lib/utils";

export interface FormTextAreaProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldProps<TFieldValues>,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "defaultValue" | "className"> {
  rows?: number;
}

export function FormTextArea<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  disabled,
  rules,
  className,
  required,
  rows = 3,
  placeholder,
  ...textareaProps
}: FormTextAreaProps<TFieldValues>) {
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
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={fieldShellClass({ hasError: Boolean(error), disabled, extra: "resize-none" })}
        {...register(name, rules)}
        {...textareaProps}
      />
    </FormFieldWrapper>
  );
}
