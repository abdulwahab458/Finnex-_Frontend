import React from "react";
import { useFormContext, type FieldValues } from "react-hook-form";
import { getFieldError,cn } from "@/lib/utils";
import type { BaseFieldProps } from "./types";

export interface FormCheckboxProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<BaseFieldProps<TFieldValues>, "label"> {
  label?: React.ReactNode;
}

export function FormCheckbox<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  disabled,
  rules,
  className,
}: FormCheckboxProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const error = getFieldError(errors, name);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        htmlFor={name}
        className={cn(
          "flex cursor-pointer items-start gap-2 text-sm text-gray-700",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <input
          id={name}
          type="checkbox"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={cn(
            "mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900",
            error && "border-red-400"
          )}
          {...register(name, rules)}
        />
        {label}
      </label>
      {error?.message ? (
        <p className="text-xs text-red-500">{error.message}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
}
