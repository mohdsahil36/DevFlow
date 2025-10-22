"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, Column } from "../types/types";
import AddTask from "../components/AddTask";
import {
  DragEndEvent,
  DndContext,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { Edit, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { useTaskStore } from "@/store/taskStore";

const columns: Column[] = [
  { status: "To Do", tasks: [] },
  { status: "In Progress", tasks: [] },
  { status: "Done", tasks: [] },
];
// Droppable column component
function DroppableColumn({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
}) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}

// Draggable task component
function DraggableTask({
  task,
  setSelectedData,
  setOpenModal,
  setActiveStatus,
  onTaskDelete,
  editTask,
}: {
  task: Task;
  setSelectedData: (
    data: { success?: boolean; data: Task } | undefined
  ) => void;
  setOpenModal: (open: boolean) => void;
  setActiveStatus: (status: string) => void;
  onTaskDelete: (id: string) => void;
  editTask: (taskId: string) => Promise<Response>;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: {
      task,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  async function editHandler(taskId: string) {
    const response = await editTask(taskId);
    const json = await response.json(); // { success, data }
    setSelectedData(json);
    setActiveStatus(json?.data?.status || "To Do");
    setOpenModal(true);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 bg-gray-50 rounded shadow-md text-left"
    >
      {/* Only this div is draggable */}
      <div
        {...listeners}
        {...attributes}
        className="flex items-center gap-2 cursor-grab active:cursor-grabbing mb-2"
        style={{ userSelect: "none", touchAction: "none" }}
      >
        <GripVertical className="text-gray-400" />
        <span className="font-semibold text-gray-800">{task.title}</span>
      </div>

      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        <div className="flex flex-row gap-2">
          <button type="button" onClick={() => editHandler(task._id)}>
            <Edit className="size-4 cursor-pointer hover:text-blue-400" />
          </button>

          <DeleteConfirmation taskId={task._id} onTaskDelete={onTaskDelete} />
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500 mb-3">
        <p>Priority: {task.priority}</p>
        <p>
          Due:{" "}
          {new Date(task.due_date).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [columnData, setColumnData] = useState<Column[]>(columns);
  const [activeStatus, setActiveStatus] = useState<string>("To Do");
  const [selectedData, setSelectedData] = useState<
    { success?: boolean; data: Task } | undefined
  >(undefined);
  const [openModal, setOpenModal] = useState(false);
  const { tasks, deleteTasks, fetchTasks, updateTaskStatus, editTask } =
    useTaskStore();

  useEffect(() => {
    fetchTasks("kanban");
  }, [fetchTasks]);

  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      setColumnData(
        columns.map((column) => ({
          ...column,
          tasks: tasks.filter(
            (item) =>
              (item.status || "To Do").toLowerCase().trim() ===
              column.status.toLowerCase().trim()
          ),
        }))
      );
    }
  }, [tasks]);

  const deleteHandler = useCallback(
    async (taskId: string) => {
      try {
        const response = await deleteTasks(taskId);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to delete task!", errorData);
        } else {
          const result = await response.json();
          console.log("Task deleted successfully!", result);
        }
      } catch (error) {
        console.error("Error deleting task!", error);
      }
    },
    [deleteTasks]
  );

  //function for the drag over event
  const handleDragEvent = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return; // if the hover event is not over i.e. we are not over something droppable

      const taskId = active.id as string; // id of the task being dragged
      const newStatus = over.id as Task["status"]; // status of the task being dragged

      // Find the task and move it to the new column
      setColumnData((prevData) => {
        // Find the task in the current data
        let taskToMove: Task | null = null;
        let sourceColumnIndex = -1;

        // Find the task and its current column
        for (let i = 0; i < prevData.length; i++) {
          const taskIndex = prevData[i].tasks.findIndex(
            (task) => task._id === taskId
          );
          if (taskIndex !== -1) {
            taskToMove = prevData[i].tasks[taskIndex];
            sourceColumnIndex = i;
            break;
          }
        }

        if (!taskToMove) return prevData;

        if (taskToMove.status === newStatus) {
          return prevData;
        }

        // Create new task with updated status
        const updatedTask = { ...taskToMove, status: newStatus };

        return prevData.map((column, columnIndex) => {
          if (columnIndex === sourceColumnIndex) {
            // Remove task from source column
            return {
              ...column,
              tasks: column.tasks.filter((task) => task._id !== taskId),
            };
          } else if (column.status === newStatus) {
            // Add task to target column
            return {
              ...column,
              tasks: [...column.tasks, updatedTask],
            };
          }
          return column;
        });
      });

      // Update the task status in the backend
      try {
        const response = await updateTaskStatus(taskId, newStatus);
        if (!response.ok) {
          console.error("Failed to update task status in backend");
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    },
    [updateTaskStatus]
  );

  // sensor for dnd for mobile screens
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 2000, //prevent accidental scrolls
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <div className="px-4 py-8 md:p-12">
      <h1 className="text-2xl font-semibold mb-6">Kanban Workspace</h1>

      <DndContext onDragEnd={handleDragEvent} sensors={sensors}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {columnData.map((item, itemindex) => (
            <DroppableColumn key={itemindex} id={item.status} className="">
              <h2 className="font-semibold mb-3 p-2 rounded">
                {item.status} ({item.tasks.length})
              </h2>
              <div className="space-y-4">
                {item.tasks.length > 0 ? (
                  item.tasks.map((task) => (
                    <DraggableTask
                      key={task._id}
                      task={task}
                      setSelectedData={setSelectedData}
                      setOpenModal={setOpenModal}
                      setActiveStatus={setActiveStatus}
                      onTaskDelete={deleteHandler}
                      editTask={editTask}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-200 italic">No tasks</p>
                )}
              </div>
              <Button
                variant="outline"
                className="mt-5 cursor-pointer"
                onClick={() => {
                  setSelectedData(undefined);
                  setActiveStatus(item.status);
                  setOpenModal(true);
                }}
              >
                + Add Task
              </Button>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
      <AddTask
        status={activeStatus}
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedData={selectedData}
      />
    </div>
  );
}
