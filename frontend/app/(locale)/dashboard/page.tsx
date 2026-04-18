"use client";

import { useState, useEffect } from "react";
import { useTaskStore } from "@/store/taskStore";

type TaskData = {
  status: string;
  value: number;
};

export default function DashboardPage() {
  const [taskData, setTaskData] = useState<TaskData[]>([]);

  const { tasks } = useTaskStore();
  useEffect(() => {
    setTaskData(() => {
      return [
        {
          status: "To-Do",
          value: tasks.filter((task) => task.status === "To-Do").length,
        },
        {
          status: "In Progress",
          value: tasks.filter((task) => task.status === "In Progress").length,
        },
        {
          status: "Done",
          value: tasks.filter((task) => task.status === "Done").length,
        },
      ];
    });
  }, [tasks]);
  return (
    <div className="px-2">
      <h1 className="uppercase text-xl font-semibold">project overview</h1>
    </div>
  );
}
