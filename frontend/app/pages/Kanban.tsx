"use client";

import { useState, useEffect, useCallback } from "react";
import useDataFetch from "../hooks/useDataFetch";
import { Task, Column } from "../types/types";
import AddTask from "../components/AddTask";
import { DragEndEvent } from "@dnd-kit/core";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import { Edit, GripVertical, Trash2 } from "lucide-react";

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
function DraggableTask({ task, index }: { task: Task; index: number }) {
  const [taskIdData, setTaskIdData] = useState<Task | null>(null);
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
    const response = await fetch(`http://localhost:8080/kanban/${taskId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setTaskIdData(data);
  }

  async function deleteHandler(taskId: string) {
    try {
      const response = await fetch(`http://localhost:8080/kanban/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

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
        style={{ userSelect: "none" }}
      >
        <GripVertical className="text-gray-400" />
        <span className="font-semibold text-gray-800">{task.title}</span>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          <div className="flex justify-between mt-2 text-xs text-gray-500 mb-3">
            <p>Priority: {task.priority}</p>
            <p>Due: {task.due_date}</p>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <button type="button" onClick={() => editHandler(task._id)}>
            <Edit className="size-4 cursor-pointer hover:text-blue-400" />
          </button>
          <button type="button" onClick={() => deleteHandler(task._id)}>
            <Trash2 className="size-4 cursor-pointer hover:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [columnData, setColumnData] = useState<Column[]>(columns);
  const { data: fetchedData } = useDataFetch("/kanban");

  useEffect(() => {
    if (fetchedData && Array.isArray(fetchedData)) {
      setColumnData((prevColumns) =>
        prevColumns.map((column) => {
          const tasksForColumn: Task[] = fetchedData.filter((item) => {
            const taskStatus = item.status || "To Do";
            const columnStatus = column.status;

            return (
              taskStatus.toLowerCase().trim() ===
              columnStatus.toLowerCase().trim()
            );
          });

          return { ...column, tasks: tasksForColumn };
        })
      );
    }
  }, [fetchedData]);

  //function for the drag over event
  const handleDragEvent = useCallback(async (event: DragEndEvent) => {
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
      const response = await fetch(
        `http://localhost:8080/tasks/${taskId}/status?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to update task status in backend");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  }, []);

  return (
    <div className="p-12">
      <h1 className="text-2xl font-semibold mb-6">Kanban Workspace</h1>

      <DndContext onDragEnd={handleDragEvent}>
        <div className="flex gap-4 mt-6">
          {columnData.map((item, itemindex) => (
            <DroppableColumn key={itemindex} id={item.status} className="w-1/3">
              <h2 className="font-semibold mb-3 p-2 rounded">
                {item.status} ({item.tasks.length})
              </h2>
              <div className="space-y-4">
                {item.tasks.length > 0 ? (
                  item.tasks.map((task, index) => (
                    <DraggableTask key={task._id} task={task} index={index} />
                  ))
                ) : (
                  <p className="text-sm text-gray-200 italic">No tasks</p>
                )}
              </div>

              <AddTask status={item.status} />
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
