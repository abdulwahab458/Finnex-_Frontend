import { cn } from "@/lib/utils";
import React from "react";
import type { FieldError } from "react-hook-form";


interface FormFieldWrapperProps {
  label?: string;
  htmlFor: string;
  required?: boolean;
  helperText?: string;
  error?: FieldError;
  className?: string;
  children: React.ReactNode;
}

/**
 * Every reusable field (FormInput, FormSelect, FormDatePicker, ...) renders
 * its actual control through this wrapper so label styling, the required
 * asterisk, helper text, and error rendering only exist in ONE place.
 */
export function FormFieldWrapper({
  label,
  htmlFor,
  required,
  helperText,
  error,
  className,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-semibold uppercase tracking-wide text-gray-500"
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      {children}

      {error?.message ? (
        <p className="text-xs text-red-500" role="alert">
          {error.message}
        </p>
      ) : helperText ? (
        <p className="text-xs text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
}
