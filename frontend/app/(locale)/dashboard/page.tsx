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

  return (
    <div className="px-2">
      <h1 className="uppercase text-xl font-semibold">project overview</h1>
      <div className="md:mt-3">
        <ChartContainer
          config={chartConfig}
          className="min-h-[10rem] w-full max-w-2xl"
        >
          <BarChart
            accessibilityLayer
            data={taskData}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            barCategoryGap="0%"
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={2}
            />
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
            />
            <Bar
              dataKey="value"
              fill="#2563eb"
              radius={[0, 1, 1, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
