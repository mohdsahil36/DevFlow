"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTaskStore } from "@/store/taskStore";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import chartConfig from "@/app/components/config/chartconfig";

type TaskData = {
  status: string;
  value: number;
};

export default function DashboardPage() {
  const [taskData, setTaskData] = useState<TaskData[]>([]);
  const tasks = useTaskStore((s) => s.tasks);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);

  useEffect(() => {
    void fetchTasks("kanban");
  }, [fetchTasks]);

  useEffect(() => {
    setTaskData([
      {
        status: "To Do",
        value: tasks.filter((t) => t.status === "To Do").length,
      },
      {
        status: "In Progress",
        value: tasks.filter((t) => t.status === "In Progress").length,
      },
      {
        status: "Done",
        value: tasks.filter((t) => t.status === "Done").length,
      },
    ]);
  }, [tasks]);

  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "In Progress",
  ).length;
  const todoTasks = tasks.filter((t) => t.status === "To Do").length;

  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const suggestedFocusMinutes = todoTasks > 8 ? 35 : todoTasks > 4 ? 25 : 15;

  return (
    <div className="mx-auto max-w-6xl space-y-5 py-6 px-4 bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md p-4 shadow-sm">
        <h1 className="text-base font-semibold">System Analytics</h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Task health snapshot for your workflow
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Tasks", value: tasks.length },
          { label: "In Progress", value: inProgressTasks },
          { label: "To Do", value: todoTasks },
          { label: "Completion", value: `${completionRate}%` },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md p-4 shadow-sm"
          >
            <p className="text-[11px] text-[var(--text-secondary)]">
              {item.label}
            </p>
            <p className="mt-1 text-xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Chart */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md p-4 shadow-sm lg:col-span-2">
          <h2 className="mb-3 text-xs font-medium tracking-wide text-[var(--text-secondary)]">
            Task Distribution
          </h2>

          <ChartContainer config={chartConfig} className="max-h-[24rem]">
            <BarChart data={taskData} layout="vertical">
              <CartesianGrid
                strokeDasharray="2 2"
                horizontal={false}
                opacity={0.2}
              />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis dataKey="status" type="category" width={90} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--green-primary)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Side */}
        <div className="space-y-5">
          {/* Focus Timer */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md p-4 shadow-sm">
            <h2 className="mb-3 text-xs font-medium tracking-wide text-[var(--text-secondary)]">
              Focus Timer
            </h2>

            <div className="space-y-3">
              <div className="rounded-md bg-[var(--green-soft)] text-[var(--green-active)] px-3 py-2 text-center text-xs font-medium">
                Suggested: {suggestedFocusMinutes} min
              </div>

              <p className="text-xs text-[var(--text-secondary)]">
                Use Pomodoro to clear high-priority items.
              </p>

              <Link
                href="/pomodoro"
                className="
                block w-full text-center text-xs font-medium
                bg-[var(--green-primary)] text-white px-4 py-2 rounded-md
                hover:bg-[var(--green-hover)]
                active:bg-[var(--green-active)]
                transition
              "
              >
                Open Pomodoro
              </Link>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md p-4 shadow-sm">
            <h2 className="mb-3 text-xs font-medium tracking-wide text-[var(--text-secondary)]">
              Insights
            </h2>

            <div className="space-y-2 text-xs">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Needs attention
                </p>
                <p className="mt-1 font-medium">
                  {todoTasks >= inProgressTasks
                    ? "To Do column"
                    : "In Progress"}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Done tasks
                </p>
                <p className="mt-1 font-medium">{completedTasks}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-[10px] text-[var(--text-secondary)]">Pace</p>
                <p className="mt-1 font-medium">
                  {completionRate >= 60 ? "Good" : "Improving"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
