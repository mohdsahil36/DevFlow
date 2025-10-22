import { create } from "zustand";
import { Task } from "@/app/types/types";
import { TaskFormData } from "@/zod/taskTypes";

type SaveTaskResponse = {
  success: boolean;
  data?: Task;
  receivedData?: Task;
  message?: string;
  error?: string;
};

type KanbanStore = {
  tasks: Task[];
  fetchTasks: (route?: string) => Promise<void>;
  editTask: (taskId: string) => Promise<Response>;
  updateTaskStatus: (taskId: string, newStatus: string) => Promise<Response>;
  addOrEditTask: (
    taskData: TaskFormData,
    isEditMode: boolean
  ) => Promise<SaveTaskResponse>;
  deleteTasks: (taskId: string) => Promise<Response>;
};

export const useTaskStore = create<KanbanStore>((set) => ({
  tasks: [],
  fetchTasks: async (route?: string) => {
    let shouldFetch = false;
    let fetchRoute = "";

    if (route) {
      shouldFetch = true;
      fetchRoute = route.startsWith("/") ? route : `/${route}`;
    }

    if (shouldFetch) {
      try {
        const response = await fetch(`http://localhost:8080${fetchRoute}`);


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        if (!jsonResponse.success) {
          throw new Error("API returned unsuccessful response");
        }

        if (jsonResponse.data && Array.isArray(jsonResponse.data)) {
          set({ tasks: jsonResponse.data });
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        throw new Error("Data was not fetched!");
      }
    }
  },
  editTask: async (taskId: string) => {
    const response = await fetch(`http://localhost:8080/kanban/${taskId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response;
  },

  addOrEditTask: async (taskData: TaskFormData, isEditMode: boolean) => {
    try {
      const url = isEditMode
        ? `http://localhost:8080/kanban/${taskData._id}`
        : `http://localhost:8080/kanban`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      // Safely parse JSON (backend returns success + data/receivedData)
      const json = await response.json();

      if (!response.ok || !json?.success) {
        throw new Error(json?.error || `Request failed with ${response.status}`);
      }

      const createdOrUpdated = isEditMode ? json.data : (json.data || json.receivedData);

      if (!createdOrUpdated) {
        throw new Error("Invalid response payload: missing task data");
      }

      // Optimistically update client state
      set((state) => {
        if (isEditMode) {
          return {
            tasks: state.tasks.map((t) => (String(t._id) === String(createdOrUpdated._id) ? createdOrUpdated : t)),
          };
        }
        return { tasks: [...state.tasks, createdOrUpdated] };
      });

      return json;
    } catch (err) {
      console.error("Failed to add/edit task:", err);
      throw err;
    }
  },
  

  updateTaskStatus: async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/tasks/${taskId}/status?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response;
    } catch (err) {
      console.error("Unable to update the task", err);
      throw err;
    }
  },

  deleteTasks: async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/kanban/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => String(task._id) !== String(taskId)
          ),
        }));
      }

      return response;
    } catch (err) {
      console.error("Failed to delete task:", err);
      throw err;
    }
  },
}));
