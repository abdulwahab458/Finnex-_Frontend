import React, { useRef, useState } from "react";
import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { UploadCloud } from "lucide-react";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { getFieldError,cn } from "@/lib/utils";
import type { BaseFieldProps } from "./types";

export interface FormFileUploadProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldProps<TFieldValues> {
  accept?: string;
  multiple?: boolean;
  hint?: string;
}

/**
 * "Any future custom field" example: same contract as every other field
 * (name/label/rules/helperText/disabled) even though the underlying
 * control (a dropzone) looks nothing like an <input>.
 */
export function FormFileUpload<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  disabled,
  rules,
  className,
  required,
  accept,
  multiple,
  hint = "Click to upload or drag file",
}: FormFileUploadProps<TFieldValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

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
        render={({ field }) => {
          const files: FileList | File[] | undefined = field.value;
          const fileNames = files ? Array.from(files as FileList).map((f) => f.name) : [];

          const setFiles = (list: FileList | null) => {
            if (!list) return;
            field.onChange(multiple ? list : list);
          };

          return (
            <div
              onClick={() => !disabled && inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                if (!disabled) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (!disabled) setFiles(e.dataTransfer.files);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-6 text-center transition-colors",
                dragging ? "border-gray-900 bg-gray-50" : "border-gray-300",
                error && "border-red-400",
                disabled && "cursor-not-allowed opacity-60"
              )}
            >
              <UploadCloud size={20} className="text-gray-400" />
              <p className="text-sm text-gray-500">
                {fileNames.length > 0 ? fileNames.join(", ") : hint}
              </p>
              <input
                id={name}
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                className="hidden"
                onChange={(e) => setFiles(e.target.files)}
                onBlur={field.onBlur}
              />
            </div>
          );
        }}
      />
    </FormFieldWrapper>
  );
}
