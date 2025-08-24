"use client";

import { useState, useEffect } from "react";
import useDataFetch from "../hooks/useDataFetch";
import { Task, Column } from "../types/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DragEndEvent } from "@dnd-kit/core";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 bg-gray-50 rounded shadow-md text-left cursor-grab active:cursor-grabbing`}
    >
      <h3 className="font-semibold text-gray-800">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <p>Priority: {task.priority}</p>
        <p>Due: {task.due_date}</p>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [columnData, setColumnData] = useState<Column[]>(columns);
  const { data: fetchedData } = useDataFetch();

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
  function handleDragEvent(event: DragEndEvent) {
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
  }

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
              <div className="text-center">
                <Button
                  variant="outline"
                  className="cursor-pointer mt-5 rounded-sm w-1/3"
                >
                  <PlusCircle />
                  Add Task
                </Button>
              </div>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
