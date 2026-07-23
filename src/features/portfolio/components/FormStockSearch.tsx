import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { Loader2, Search, X } from "lucide-react";
import { FormFieldWrapper } from "@/components/form/FormFieldWrapper";
import { fieldShellClass } from "@/components/form/fieldStyles";
import { getFieldError, cn } from "@/lib/utils";
import type { BaseFieldProps } from "@/components/form/types";
import type { StockSearchResult } from "../types/portfolio.types";

export interface FormStockSearchProps<TFieldValues extends FieldValues = FieldValues>
    extends BaseFieldProps<TFieldValues> {
    placeholder?: string;
    /**
     * Shown as the selected label when the form already has a symbol value
     * but no fresh search result to pull the company name from — e.g. when
     * editing an existing holding. Without this, an already-selected symbol
     * just shows the bare ticker until the user clears and re-searches.
     */
    initialLabel?: string;

    /** Controlled search state — the page owns the query + the useStockSearch() call. */
    query: string;
    onQueryChange: (query: string) => void;
    results: StockSearchResult[];
    isSearching: boolean;
    isError: boolean;
}

interface DropdownPosition {
    top: number;
    left: number;
    width: number;
}

/**
 * Search-as-you-type, single-select stock picker. Purely presentational
 * for the data side — `query`/`results`/`isSearching`/`isError` all come
 * in as props, the page owns the debounced useStockSearch() call:
 *
 * const [symbolQuery, setSymbolQuery] = useState("");
 * const { results, isSearching, isError } = useStockSearch(symbolQuery);
 *
 * <FormStockSearch
 *   name="symbol"
 *   label="Stock"
 *   query={symbolQuery}
 *   onQueryChange={setSymbolQuery}
 *   results={results}
 *   isSearching={isSearching}
 *   isError={isError}
 *   rules={{ required: "Please select a stock" }}
 * />
 *
 * The results dropdown is rendered through a portal into document.body,
 * positioned with `fixed` coordinates taken from the input's bounding
 * rect — same technique as ActionsMenu. Without this, an absolutely
 * positioned dropdown gets clipped by any ancestor with overflow-hidden /
 * overflow-y-auto (e.g. a Modal body that scrolls), which is what makes
 * the results list appear to "not show up" when this field is used
 * inside a modal.
 */
export function FormStockSearch<TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    helperText,
    disabled,
    rules,
    className,
    required,
    placeholder = "Search by company name or symbol",
    initialLabel,
    query,
    onQueryChange,
    results,
    isSearching,
    isError: searchFailed,
}: FormStockSearchProps<TFieldValues>) {
    const {
        control,
        clearErrors,
        formState: { errors },
    } = useFormContext<TFieldValues>();

    const error = getFieldError(errors, name);
    const isRequired = required ?? Boolean(rules?.required);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedResult, setSelectedResult] = useState<StockSearchResult | null>(null);
    const [position, setPosition] = useState<DropdownPosition | null>(null);
    const inputWrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const computePosition = () => {
        const wrapper = inputWrapperRef.current;
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };

    useLayoutEffect(() => {
        if (!isOpen) return;
        computePosition();

        const handleReposition = () => computePosition();
        window.addEventListener("scroll", handleReposition, true);
        window.addEventListener("resize", handleReposition);
        return () => {
            window.removeEventListener("scroll", handleReposition, true);
            window.removeEventListener("resize", handleReposition);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(e: MouseEvent) {
            const target = e.target as Node;
            const clickedWrapper = inputWrapperRef.current?.contains(target);
            const clickedDropdown = dropdownRef.current?.contains(target);
            if (!clickedWrapper && !clickedDropdown) setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

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
                    const hasSelection = Boolean(field.value);
                    const selectedLabel = selectedResult?.description ?? initialLabel;

                    const handleSelect = (result: StockSearchResult) => {
                        setSelectedResult(result);
                        field.onChange(result.symbol);
                        clearErrors(name); // selection always satisfies "required" — clear immediately,
                        // don't wait on revalidation, since the blur-before-click race above
                        // can leave a stale error in place otherwise.
                        onQueryChange("");
                        setIsOpen(false);
                    };

                    const handleClear = () => {
                        setSelectedResult(null);
                        field.onChange("");
                        onQueryChange("");
                        requestAnimationFrame(() => inputRef.current?.focus());
                    };

                    // Selected state: a single chip, not an editable input.
                    if (hasSelection) {
                        return (
                            <div
                                className={cn(
                                    fieldShellClass({ hasError: Boolean(error), disabled }),
                                    "flex items-center justify-between gap-2"
                                )}
                            >
                                <div className="min-w-0">
                                    <span className="font-semibold text-on-surface">{field.value}</span>
                                    {selectedLabel && (
                                        <span className="ml-2 truncate text-on-surface-variant">{selectedLabel}</span>
                                    )}
                                </div>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        aria-label="Clear selected stock"
                                        className="shrink-0 text-on-surface-variant hover:text-on-surface"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    }

                    const showDropdown = isOpen && query.trim().length >= 1;

                    // Search state: input + dropdown of matches.
                    return (
                        <div className="relative" ref={inputWrapperRef}>
                            <Search
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                            />
                            <input
                                id={name}
                                ref={inputRef}
                                type="text"
                                value={query}
                                disabled={disabled}
                                placeholder={placeholder}
                                aria-invalid={Boolean(error)}
                                onFocus={() => setIsOpen(true)}
                                onChange={(e) => {
                                    onQueryChange(e.target.value);
                                    setIsOpen(true);
                                }}
                                onBlur={field.onBlur}
                                className={fieldShellClass({
                                    hasError: Boolean(error),
                                    disabled,
                                    extra: "pl-9 pr-8",
                                })}
                            />
                            {isSearching && (
                                <Loader2
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-on-surface-variant"
                                />
                            )}

                            {showDropdown &&
                                createPortal(
                                    <div
                                        ref={dropdownRef}
                                        style={{
                                            position: "fixed",
                                            top: position?.top ?? -9999,
                                            left: position?.left ?? -9999,
                                            width: position?.width,
                                            visibility: position ? "visible" : "hidden",
                                        }}
                                        className="z-[9999] max-h-64 overflow-y-auto rounded-md border border-outline/30 bg-surface py-1 shadow-lg"
                                    >
                                        {searchFailed ? (
                                            <p className="px-3 py-2 text-sm text-red-600">Search failed. Try again.</p>
                                        ) : isSearching ? (
                                            <p className="px-3 py-2 text-sm text-on-surface-variant">Searching…</p>
                                        ) : results.length === 0 ? (
                                            <p className="px-3 py-2 text-sm text-on-surface-variant">
                                                No matches for &quot;{query}&quot;
                                            </p>
                                        ) : (
                                            results.map((result) => (
                                                <button
                                                    key={`${result.symbol}-${result.description}`}
                                                    type="button"
                                                    onClick={() => handleSelect(result)}
                                                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-surface-container-low"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-on-surface">{result.displaySymbol}</p>
                                                        <p className="truncate text-xs text-on-surface-variant">
                                                            {result.description}
                                                        </p>
                                                    </div>
                                                    <span className="shrink-0 rounded-full bg-[#f2f4f6] px-2 py-0.5 text-[10px] font-medium text-on-surface-variant">
                                                        {result.type}
                                                    </span>
                                                </button>
                                            ))
                                        )}
                                    </div>,
                                    document.body
                                )}
                        </div>
                    );
                }}
            />
        </FormFieldWrapper>
    );
}