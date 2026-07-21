import React from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** Small uppercase line under the title, e.g. "RECORD FINANCIAL ACTIVITY" */
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClass: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

/**
 * Pure layout. It renders a title, optional description, a scrollable
 * body (children), and an optional footer — nothing here knows or cares
 * whether the body contains a form, a confirmation message, or anything
 * else. Any <FormProvider>-wrapped form can be dropped in as `children`.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  loading,
  size = "md",
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-4xl bg-white shadow-xl",
          sizeClass[size]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {description && (
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            {footer}
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 size={20} className="animate-spin text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
}
