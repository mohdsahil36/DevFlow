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
    <div className="mx-auto max-w-6xl space-y-6 py-2 font-mono text-[#231f1a]">
      <div className="border-2 border-[#231f1a] bg-[#fffdf8] p-5 shadow-[5px_5px_0px_#231f1a]">
        <div className="mb-3 inline-block bg-[#231f1a] px-2 py-1 text-xs text-[#fffdf5]">
          SYSTEM
        </div>
        <h1 className="text-lg font-bold sm:text-xl">System Analytics</h1>
        <p className="text-xs text-[#6b6256] sm:text-sm">
          Task health snapshot for your workflow
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-2 border-[#231f1a] bg-[#fffaf0] p-4 shadow-[4px_4px_0px_#231f1a]">
          <p className="text-xs text-[#6b6256]">Total Tasks</p>
          <p className="mt-2 text-2xl font-bold">{tasks.length}</p>
        </div>
        <div className="border-2 border-[#231f1a] bg-[#edf3ff] p-4 shadow-[4px_4px_0px_#231f1a]">
          <p className="text-xs text-[#6b6256]">In Progress</p>
          <p className="mt-2 text-2xl font-bold">{inProgressTasks}</p>
        </div>
        <div className="border-2 border-[#231f1a] bg-[#fff3c7] p-4 shadow-[4px_4px_0px_#231f1a]">
          <p className="text-xs text-[#6b6256]">To Do</p>
          <p className="mt-2 text-2xl font-bold">{todoTasks}</p>
        </div>
        <div className="border-2 border-[#231f1a] bg-[#eaf8ee] p-4 shadow-[4px_4px_0px_#231f1a]">
          <p className="text-xs text-[#6b6256]">Completion</p>
          <p className="mt-2 text-2xl font-bold">{completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="border-2 border-[#231f1a] bg-[#fffdf8] p-5 shadow-[6px_6px_0px_#231f1a] lg:col-span-2">
          <div className="mb-4 inline-block bg-[#231f1a] px-2 py-1 text-xs text-[#fffdf5]">
            TASK DISTRIBUTION
          </div>
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
              <Bar
                dataKey="value"
                fill="oklch(58.8% 0.158 241.966)"
                radius={0}
              />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-[#231f1a] bg-[#fffdf8] p-5 shadow-[6px_6px_0px_#231f1a]">
            <div className="mb-4 inline-block bg-[#231f1a] px-2 py-1 text-xs text-[#fffdf5]">
              FOCUS TIMER
            </div>

            <div className="space-y-4">
              <div className="rounded-full border-2 border-[#231f1a] bg-[#fff6dd] px-4 py-2 text-center text-sm font-bold">
                Suggested session: {suggestedFocusMinutes} minutes
              </div>

              <p className="text-xs text-[#6b6256]">
                Use Pomodoro to clear high-priority items with short focused
                bursts.
              </p>

              <Link
                href="/pomodoro"
                className="inline-block w-full border-2 border-[#231f1a] bg-[#edf3ff] px-4 py-2 text-center text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_#231f1a] transition-all duration-150 hover:bg-[#dfeaff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Open Pomodoro
              </Link>
            </div>
          </div>

          <div className="border-2 border-[#231f1a] bg-[#fffdf8] p-5 shadow-[6px_6px_0px_#231f1a]">
            <div className="mb-4 inline-block bg-[#231f1a] px-2 py-1 text-xs text-[#fffdf5]">
              QUICK INSIGHTS
            </div>
            <div className="space-y-4 text-sm">
              <div className="border-2 border-[#231f1a] bg-[#fffaf0] p-3">
                <p className="text-xs text-[#6b6256]">Most attention needed</p>
                <p className="mt-1 font-bold">
                  {todoTasks >= inProgressTasks
                    ? "To Do column"
                    : "In Progress column"}
                </p>
              </div>
              <div className="border-2 border-[#231f1a] bg-[#edf3ff] p-3">
                <p className="text-xs text-[#6b6256]">Done tasks</p>
                <p className="mt-1 font-bold">{completedTasks}</p>
              </div>
              <div className="border-2 border-[#231f1a] bg-[#eaf8ee] p-3">
                <p className="text-xs text-[#6b6256]">Current pace</p>
                <p className="mt-1 font-bold">
                  {completionRate >= 60
                    ? "Great momentum"
                    : "Building momentum"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
