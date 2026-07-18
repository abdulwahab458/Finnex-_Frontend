import { cn } from "@/lib/utils";


/**
 * One shared visual language for every field control (input, select,
 * textarea, date picker...). Change it once here and every field type
 * across the whole app updates together.
 */
export function fieldShellClass(opts: { hasError?: boolean; disabled?: boolean; extra?: string }) {
  const { hasError, disabled, extra } = opts;
  return cn(
    "w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors",
    "placeholder:text-gray-400",
    "border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900",
    hasError && "border-red-400 focus:border-red-500 focus:ring-red-500",
    disabled && "cursor-not-allowed bg-gray-50 text-gray-400",
    extra
  );
}
