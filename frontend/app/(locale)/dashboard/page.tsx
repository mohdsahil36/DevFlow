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
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="bg-[#e6e3de] min-h-screen">
      <div className="sm:px-6 py-6 space-y-6">
        <div
          className="border-2 border-black bg-white 
                        shadow-[3px_3px_0px_#1f1f1f] 
                        p-4 font-mono max-w-6xl mx-auto px-4"
        >
          <div className="bg-black text-white text-xs px-2 py-1 inline-block mb-3">
            SYSTEM
          </div>

          <h1 className="text-lg sm:text-xl font-bold">System Analytics</h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Overview of your vitals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="border-2 border-black bg-white 
                          shadow-[6px_6px_0px_#1f1f1f] 
                          p-5 font-mono"
          >
            <div className="bg-black text-white text-xs px-2 py-1 inline-block mb-4">
              TASK ANALYTICS
            </div>

            <div className="flex flex-col gap-6">
              <ChartContainer config={chartConfig} className=" max-h-[30rem]">
                <BarChart data={taskData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="2 2"
                    horizontal={false}
                    opacity={0.2}
                  />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis dataKey="status" type="category" width={60} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="value"
                    fill="oklch(58.8% 0.158 241.966)"
                    radius={0}
                  />
                </BarChart>
              </ChartContainer>

              <div className="border-t-2 border-black pt-4 grid grid-cols-2 gap-4">
                <div className="border-2 border-black p-3 bg-[#dbeafe]">
                  <span className="text-xs">Active Tasks</span>
                  <div className="text-lg font-bold">{tasks.length}</div>
                </div>

                <div className="border-2 border-black p-3 bg-[#fef08a]">
                  <span className="text-xs">Completion</span>
                  <div className="text-lg font-bold">{completionRate}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
