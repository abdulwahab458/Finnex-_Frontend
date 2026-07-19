import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Info,
  Loader2,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmVariant = "danger" | "warning" | "info" | "success" | "recommendation";

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  /** Can be sync or async. If it returns a promise, the modal shows its own
   *  spinner and disables both buttons until it resolves/rejects — you don't
   *  need to wire up a `loading` state yourself for the common case. */
  onConfirm: () => void | Promise<void>;

  /** Controls the default icon + color language. Override the icon itself with `icon`. */
  variant?: ConfirmVariant;
  icon?: LucideIcon;

  title: React.ReactNode;
  /** The "are you sure you want to..." body copy */
  description?: React.ReactNode;

  confirmLabel?: string;
  cancelLabel?: string;
  /** Hide the cancel button entirely, e.g. for a pure acknowledgement dialog */
  hideCancel?: boolean;
  /** External loading override, in case the caller wants to control it manually
   *  (e.g. the mutation is tracked in a parent hook rather than awaited here) */
  loading?: boolean;
}

const variantConfig: Record<
  ConfirmVariant,
  { icon: LucideIcon; iconWrapperClass: string; confirmButtonClass: string }
> = {
  danger: {
    icon: Trash2,
    iconWrapperClass: "bg-red-50 text-red-600",
    confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    icon: AlertTriangle,
    iconWrapperClass: "bg-amber-50 text-amber-600",
    confirmButtonClass: "bg-gray-900 hover:bg-gray-800 text-white",
  },
  info: {
    icon: Info,
    iconWrapperClass: "bg-blue-50 text-blue-600",
    confirmButtonClass: "bg-gray-900 hover:bg-gray-800 text-white",
  },
  success: {
    icon: CheckCircle2,
    iconWrapperClass: "bg-emerald-50 text-emerald-600",
    confirmButtonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  recommendation: {
    icon: Sparkles,
    iconWrapperClass: "bg-indigo-50 text-indigo-600",
    confirmButtonClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
  },
};

/**
 * Generic "are you sure?" confirmation dialog. Nothing here is tied to any
 * specific action — pass a variant (controls icon + color language), a
 * title/description, and an onConfirm handler. Works equally for
 * destructive confirmations (delete account), neutral acknowledgements
 * (info), or a "recommendation" style nudge (e.g. "You have 3 similar
 * transactions, merge them?").
 *
 * Usage:
 * <ConfirmModal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   variant="danger"
 *   title="Delete this account?"
 *   description="This will permanently remove the account and all of its transaction history. This can't be undone."
 *   confirmLabel="Delete Account"
 *   onConfirm={() => deleteAccount(account.id)}
 * />
 */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  variant = "warning",
  icon,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  hideCancel = false,
  loading: externalLoading,
}: ConfirmModalProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const loading = externalLoading ?? internalLoading;
  const config = variantConfig[variant];
  const Icon = icon ?? config.icon;

  useEffect(() => {
    if (!open) return;
    // Default focus goes to Cancel, not Confirm — safer default for
    // destructive actions triggered by an accidental Enter key press.
    cancelRef.current?.focus();

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const handleConfirm = async () => {
    const result = onConfirm();
    if (result instanceof Promise) {
      setInternalLoading(true);
      try {
        await result;
        onClose();
      } finally {
        setInternalLoading(false);
      }
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4 slide-down"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative w-full max-w-md rounded-lg bg-white p-6 text-center shadow-xl"
      >
        <div
          className={cn(
            "mx-auto flex h-15 w-14 items-center justify-center rounded-full",
            config.iconWrapperClass
          )}
        >
          <Icon size={22} />
        </div>

        <h2 id="confirm-modal-title" className="mt-4 text-base font-semibold text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-gray-500">{description}</p>
        )}

        <div className="mt-6 flex justify-center gap-3">
          {!hideCancel && (
            <button
              ref={cancelRef}
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70",
              config.confirmButtonClass
            )}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}