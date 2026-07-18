import React from "react";
import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { getFieldError,cn } from "@/lib/utils";
import type { BaseFieldProps } from "./types";

export interface FormSwitchProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<BaseFieldProps<TFieldValues>, "label"> {
  label?: React.ReactNode;
}

export function FormSwitch<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  disabled,
  rules,
  className,
}: FormSwitchProps<TFieldValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const error = getFieldError(errors, name);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div className={cn("flex flex-col gap-1", className)}>
          <label
            htmlFor={name}
            className={cn(
              "flex items-center justify-between gap-3 text-sm text-gray-700",
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            )}
          >
            {label}
            <button
              id={name}
              type="button"
              role="switch"
              aria-checked={Boolean(field.value)}
              disabled={disabled}
              onClick={() => field.onChange(!field.value)}
              className={cn(
                "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                field.value ? "bg-gray-900" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  field.value ? "translate-x-4" : "translate-x-0.5"
                )}
              />
            </button>
          </label>
          {error?.message ? (
            <p className="text-xs text-red-500">{error.message}</p>
          ) : helperText ? (
            <p className="text-xs text-gray-400">{helperText}</p>
          ) : null}
        </div>
      )}
    />
  );
}
