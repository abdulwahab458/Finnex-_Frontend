import type { TransactionCategory } from "@/features/transactions/types/transactions.type";
import {
    Car,
    CircleHelp,
    Film,
    GraduationCap,
    HeartPulse,
    House,
    Landmark,
    Receipt,
    Shield,
    ShoppingBag,
    ShoppingCart,
    TrendingUp,
    UtensilsCrossed,
    Wallet,
    Zap,
    ArrowLeftRight,
    type LucideIcon,
} from "lucide-react";


interface CategoryMeta {
    label: string;
    icon: LucideIcon;
    /** Hex color used for chart fills and tinted icon backgrounds. */
    color: string;
}

// Kept as the single source of truth for category → icon/color so the
// cashflow, allocation chart, and recent-activity list all agree visually.
export const categoryMeta: Record<TransactionCategory, CategoryMeta> = {
    FOOD_AND_DINING: { label: "Food & Dining", icon: UtensilsCrossed, color: "#f59e0b" },
    SHOPPING: { label: "Shopping", icon: ShoppingBag, color: "#ec4899" },
    GROCERIES: { label: "Groceries", icon: ShoppingCart, color: "#10b981" },
    TRANSPORT: { label: "Transport", icon: Car, color: "#3b82f6" },
    HEALTHCARE: { label: "Healthcare", icon: HeartPulse, color: "#ef4444" },
    INSURANCE: { label: "Insurance", icon: Shield, color: "#6366f1" },
    UTILITIES: { label: "Utilities", icon: Zap, color: "#eab308" },
    ENTERTAINMENT: { label: "Entertainment", icon: Film, color: "#a855f7" },
    INVESTMENT: { label: "Investment", icon: TrendingUp, color: "#14b8a6" },
    DIVIDEND: { label: "Dividend", icon: Landmark, color: "#0ea5e9" },
    SALARY: { label: "Salary", icon: Wallet, color: "#22c55e" },
    TRANSFER: { label: "Transfer", icon: ArrowLeftRight, color: "#64748b" },
    EDUCATION: { label: "Education", icon: GraduationCap, color: "#f97316" },
    RENT: { label: "Rent", icon: House, color: "#8b5cf6" },
    TAX: { label: "Tax", icon: Receipt, color: "#dc2626" },
    OTHER: { label: "Other", icon: CircleHelp, color: "#9ca3af" },
};

export function formatCurrency(value: number, symbol = "$"): string {
    return `${symbol}${value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}