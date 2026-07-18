import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  /** "destructive" renders the item in red, e.g. Delete / Deactivate */
  variant?: "default" | "destructive";
  disabled?: boolean;
}

export interface ActionsMenuProps {
  actions: ActionItem[];
  /** Which side of the trigger the menu opens toward. Default "right". */
  align?: "left" | "right";
  /** Custom trigger button. Defaults to the three-dot MoreVertical icon. */
  trigger?: React.ReactNode;
  triggerLabel?: string;
  menuWidth?: number;
}

interface MenuPosition {
  top: number;
  left: number;
}

/**
 * Fully generic row-actions dropdown. Pass however many actions you want —
 * each is just { label, icon, onClick, variant, disabled }. Nothing about
 * "accounts" or any specific page is baked in, so the same component works
 * for accounts, transactions, budgets, goals, etc.
 *
 * The menu itself is rendered through a portal into document.body and
 * positioned with `fixed` coordinates taken from the trigger's bounding
 * rect. That's what lets it render on top of a table (or any other
 * container) that has `overflow-hidden` / `overflow-auto` for scrolling —
 * an absolutely-positioned child can never escape a clipped ancestor, but
 * a portaled one isn't a descendant of it in the DOM at all, so it can't
 * be clipped by it. Position is recalculated on open, on scroll, and on
 * resize, and flips above the trigger automatically if there isn't enough
 * room below.
 *
 * Usage:
 * <ActionsMenu
 *   actions={[
 *     { label: "Edit", icon: Pencil, onClick: () => onEdit(row) },
 *     { label: "View Details", icon: Eye, onClick: () => onView(row) },
 *     { label: "Deactivate", icon: Ban, onClick: () => onDeactivate(row), variant: "destructive" },
 *   ]}
 * />
 */
export function ActionsMenu({
  actions,
  align = "right",
  trigger,
  triggerLabel = "Actions",
  menuWidth = 208, // 13rem / w-52, matches default menu width below
}: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const computePosition = () => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    const menuHeight = menu?.offsetHeight ?? actions.length * 44 + 8;
    const gap = 4;

    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const openUpward = spaceBelow < menuHeight + gap && triggerRect.top > menuHeight + gap;

    const top = openUpward
      ? triggerRect.top - menuHeight - gap
      : triggerRect.bottom + gap;

    const left =
      align === "right"
        ? Math.max(8, triggerRect.right - menuWidth)
        : Math.min(triggerRect.left, window.innerWidth - menuWidth - 8);

    setPosition({ top, left });
  };

  // Recompute once the menu has actually rendered (so menuHeight is accurate),
  // and whenever the page scrolls/resizes while it's open.
  useLayoutEffect(() => {
    if (!open) return;
    computePosition();

    const handleReposition = () => computePosition();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel}
        className="text-on-surface-variant hover:text-on-surface"
      >
        {trigger ?? <MoreVertical size={18} />}
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: "fixed",
              top: position?.top ?? -9999,
              left: position?.left ?? -9999,
              width: menuWidth,
              // Avoid a flash at the wrong spot on the very first paint.
              visibility: position ? "visible" : "hidden",
            }}
            className="z-[9999] overflow-hidden rounded-md border border-gray-100 bg-white py-1 shadow-lg"
          >
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    action.onClick();
                  }}
                  disabled={action.disabled}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-200",
                    "border-b border-outline last:border-b-0",
                    action.variant === "destructive"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-700 hover:bg-gray-50",
                    action.disabled && "cursor-not-allowed opacity-50 hover:bg-transparent"
                  )}
                >
                  {Icon && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#D6E3FF] text-black">
                      <Icon size={16} />
                    </div>
                  )}
                  <span className="flex-1 font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}