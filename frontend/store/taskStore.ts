import { create } from "zustand";
import { Task } from "@/app/types/types";

type KanbanStore = {
  tasks: Task[];
  deleteTasks: (taskId: string) => Promise<Response>;
};

export const useTaskStore = create<KanbanStore>((set) => ({
  tasks: [],
  deleteTasks: async (taskId: string) => {
    const response = await fetch(`http://localhost:8080/kanban/${taskId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      set((state) => ({
        tasks: state.tasks.filter((task) => String(task._id) !== taskId),
      }));
    }
    return response;
  },
}));
