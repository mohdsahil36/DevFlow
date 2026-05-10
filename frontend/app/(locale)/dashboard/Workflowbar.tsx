import type { FC } from "react";

type FillVariant = "done" | "progress" | "todo";

interface WorkflowBarProps {
  label: string;
  value: number;
  total: number;
  variant: FillVariant;
}

const FILL_COLOR: Record<FillVariant, string> = {
  done: "bg-[var(--db-green-primary)]",
  progress: "bg-[var(--db-amber)]",
  todo: "bg-[var(--db-text-tertiary)]",
};

const WorkflowBar: FC<WorkflowBarProps> = ({
  label,
  value,
  total,
  variant,
}) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div
      className="grid items-center gap-2.5"
      style={{ gridTemplateColumns: "82px 1fr 28px" }}
    >
      <span className="text-[11px] font-medium text-right text-[var(--db-text-secondary)]">
        {label}
      </span>
      <div className="h-2.5 rounded-full bg-[var(--db-bg-surface-3)] overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-in-out ${FILL_COLOR[variant]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono-db text-[11px] text-right text-[var(--db-text-tertiary)]">
        {value}
      </span>
    </div>
  );
};

export default WorkflowBar;
