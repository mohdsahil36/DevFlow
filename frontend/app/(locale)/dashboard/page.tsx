"use client";

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
        value: tasks.filter((task) => task.status === "To Do").length,
      },
      {
        status: "In Progress",
        value: tasks.filter((task) => task.status === "In Progress").length,
      },
      {
        status: "Done",
        value: tasks.filter((task) => task.status === "Done").length,
      },
    ]);
  }, [tasks]);

  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="p-2 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Analytics</h1>
        <p className="text-sm text-muted-foreground">Overview of your vitals</p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border rounded-2xl shadow-sm p-4 w-1/2">
        <div className="flex flex-col gap-6">
          <ChartContainer config={chartConfig} className="w-full max-w-2xl">
            <BarChart
              accessibilityLayer
              data={taskData}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                className="opacity-30"
              />

              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                className="text-xs"
              />

              <YAxis
                dataKey="status"
                type="category"
                tickLine={false}
                axisLine={false}
                width={100}
                className="text-sm font-medium"
              />

              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: "hsl(var(--muted) / 0.25)" }}
              />

              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[6, 6, 6, 6]}
                barSize={22}
              />
            </BarChart>
          </ChartContainer>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Active Tasks
              </span>
              <span className="text-xl font-semibold">{tasks.length}</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-sm text-muted-foreground">
                Completion Rate
              </span>
              <span className="text-xl font-semibold text-blue-600">
                {completionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
