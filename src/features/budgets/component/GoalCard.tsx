import React from "react";
import {
  Home,
  PiggyBank,
  GraduationCap,
  ShieldCheck,
  Plane,
  Car,
  Heart,
  Landmark,
  TrendingUp,
  Target,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import type { Goal, GoalCategory } from "../types/budget.types" ;

const CATEGORY_ICON: Record<GoalCategory, LucideIcon> = {
  RETIREMENT: PiggyBank,
  HOME: Home,
  EDUCATION: GraduationCap,
  EMERGENCY_FUND: ShieldCheck,
  TRAVEL: Plane,
  VEHICLE: Car,
  WEDDING: Heart,
  HEALTH: Heart,
  OTHER: Target,
};

const STATUS_STYLES: Record<Goal["status"], string> = {
  IN_PROGRESS: "bg-emerald-50 text-emerald-700",
  COMPLETED: "bg-blue-50 text-blue-700",
  NOT_STARTED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-50 text-red-700",
};

const STATUS_LABEL: Record<Goal["status"], string> = {
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  NOT_STARTED: "Not started",
  CANCELLED: "Cancelled",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTargetDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const Icon = CATEGORY_ICON[goal.category] ?? Target;
  const progress = Math.min(100, Math.max(0, goal.progressPercentage));

  return (
    <div className="w-full max-w-sm rounded-[1.2rem] border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
          <Icon className="h-5 w-5 text-gray-700" strokeWidth={1.75} />
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[goal.status]}`}
          >
            {Math.round(progress)}% complete
          </span>
          <button
            type="button"
            aria-label={`Edit ${goal.name}`}
            onClick={() => onEdit?.(goal)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${goal.name}`}
            onClick={() => onDelete?.(goal)}
            className="rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <h3 className="mt-4 text-xl font-semibold leading-snug text-gray-900">
        {goal.name}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        <span className="text-emerald-600">
          Target: {formatCurrency(goal.targetAmount)}
        </span>
        <span className="mx-1.5">&middot;</span>
        {formatTargetDate(goal.targetDate)}
      </p>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-900 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

     

      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900">
          {formatCurrency(goal.currentAmount)}
        </span>
        <span className="text-gray-400">
          {formatCurrency(goal.targetAmount)}
        </span>
      </div>
    </div>
  );
}

export interface GoalListProps {
  goals: Goal[];
  onEdit?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
}

export function GoalList({ goals, onEdit, onDelete }: GoalListProps) {
  return (
    <div className="flex flex-wrap gap-5">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default GoalCard;