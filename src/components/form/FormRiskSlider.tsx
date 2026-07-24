import { Controller, useFormContext } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import type { BaseFieldProps, FieldRules } from "./types";
import { cn, getFieldError } from "@/lib/utils";

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "AGGRESSIVE";

const RISK_LEVELS: RiskLevel[] = ["LOW", "MODERATE", "HIGH", "AGGRESSIVE"];

const RISK_LEVEL_STYLES: Record<RiskLevel, { badge: string; label: string }> = {
  LOW:         { badge: "bg-blue-100 text-blue-700",      label: "Low" },
  MODERATE:    { badge: "bg-emerald-100 text-emerald-700", label: "Moderate" },
  HIGH:        { badge: "bg-amber-100 text-amber-700",    label: "High" },
  AGGRESSIVE:  { badge: "bg-rose-100 text-rose-700",      label: "Aggressive" },
};

export interface FormRiskSliderProps extends BaseFieldProps {
  name: string;
  label?: string;
  rules?: FieldRules;
  minCaption?: string;
  maxCaption?: string;
}

export function FormRiskSlider({
  name,
  label = "Risk Tolerance",
  helperText,
  disabled,
  rules,
  className,
  required,
  minCaption = "Conservative",
  maxCaption = "Aggressive",
}: FormRiskSliderProps) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const fieldError = getFieldError(errors, name);
  const isRequired = required ?? Boolean(rules?.required);
  const watchedValue = watch(name) as RiskLevel | undefined;
  const currentLevel = watchedValue ?? RISK_LEVELS[0];
  const badgeStyles = RISK_LEVEL_STYLES[currentLevel];

  return (
    <FormFieldWrapper
      label={label}
      htmlFor={name}
      required={isRequired}
      helperText={helperText}
      error={fieldError}
      className={className}
      headerRight={
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", badgeStyles.badge)}>
          {badgeStyles.label}
        </span>
      }
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={RISK_LEVELS[0]}
        render={({ field }) => {
          const currentIndex = Math.max(0, RISK_LEVELS.indexOf(field.value as RiskLevel));
          const percent = (currentIndex / (RISK_LEVELS.length - 1)) * 100;

          return (
            <div className="pt-1">
              <div className="relative flex h-5 items-center">
                <div className="absolute h-1.5 w-full rounded-full bg-gray-200" />
                <div
                  className="absolute h-1.5 rounded-full bg-gray-900/80 transition-all"
                  style={{ width: `${percent}%` }}
                />
                <input
                  id={name}
                  type="range"
                  min={0}
                  max={RISK_LEVELS.length - 1}
                  step={1}
                  value={currentIndex}
                  onChange={(e) => field.onChange(RISK_LEVELS[Number(e.target.value)])}
                  onBlur={field.onBlur}
                  disabled={disabled}
                  className={cn(
                    "relative z-10 w-full cursor-pointer appearance-none bg-transparent",
                    "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
                    "[&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:shadow-sm",
                    "[&::-webkit-slider-thumb]:cursor-pointer",
                    "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:border-0",
                    "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-900",
                    "[&::-moz-range-thumb]:cursor-pointer",
                    fieldError && "outline-none"
                  )}
                  aria-label={label}
                  aria-invalid={!!fieldError}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] font-medium uppercase tracking-wide text-on-surface-variant">
                <span>{minCaption}</span>
                <span>{maxCaption}</span>
              </div>
            </div>
          );
        }}
      />
    </FormFieldWrapper>
  );
}
export default FormRiskSlider;
