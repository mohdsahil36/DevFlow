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
import DeleteConfirmation from "../components/DeleteConfirmation";
import { useTaskStore } from "@/store/taskStore";

const columns: Column[] = [
  { status: "To Do", tasks: [] },
  { status: "In Progress", tasks: [] },
  { status: "Done", tasks: [] },
];

type DroppableColumnProps = {
  children: React.ReactNode;
  id: string;
  className?: string;
};

function DroppableColumn({ children, id, className }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}

type EditTaskResponse = { success?: boolean; data: Task };

type DraggableTaskProps = {
  task: Task;
  setSelectedData: React.Dispatch<
    React.SetStateAction<EditTaskResponse | undefined>
  >;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveStatus: React.Dispatch<React.SetStateAction<string>>;
  onTaskDelete: (taskId: string) => Promise<void>;
  editTask: (taskId: string) => Promise<Response>;
};

function DraggableTask({
  task,
  setSelectedData,
  setOpenModal,
  setActiveStatus,
  onTaskDelete,
  editTask,
}: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: { task },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  async function editHandler(taskId: string) {
    const res = await editTask(taskId);
    const json = await res.json();
    setSelectedData(json);
    setActiveStatus(json?.data?.status || "To Do");
    setOpenModal(true);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 border border-black bg-white 
                 shadow-[2px_2px_0px_#1f1f1f]"
    >
      {/* Priority strip */}
      <div
        className={`h-[3px] mb-2 
          ${task.priority === "low" && "bg-green-400"}
          ${task.priority === "medium" && "bg-yellow-400"}
          ${task.priority === "high" && "bg-red-400"}
        `}
      />

      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="flex items-center gap-2 cursor-grab active:cursor-grabbing mb-2"
        style={{ userSelect: "none", touchAction: "none" }}
      >
        <GripVertical className="size-4 text-gray-600" />
        <span className="text-sm font-semibold">{task.title}</span>
      </div>

      <div className="flex justify-between items-start">
        <p className="text-xs text-gray-600">{task.description}</p>

        <div className="flex gap-2">
          <button onClick={() => editHandler(task._id)}>
            <Edit className="size-4 hover:scale-110 transition" />
          </button>
          <DeleteConfirmation taskId={task._id} onTaskDelete={onTaskDelete} />
        </div>
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <p>{task.priority}</p>
        <p>{new Date(task.due_date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [columnData, setColumnData] = useState(columns);
  const [activeStatus, setActiveStatus] = useState("To Do");
  const [selectedData, setSelectedData] = useState<EditTaskResponse>();
  const [openModal, setOpenModal] = useState(false);

  const { tasks, deleteTasks, fetchTasks, updateTaskStatus, editTask } =
    useTaskStore();

  useEffect(() => {
    fetchTasks("kanban");
  }, [fetchTasks]);

  useEffect(() => {
    if (tasks) {
      setColumnData(
        columns.map((col) => ({
          ...col,
          tasks: tasks.filter(
            (t) =>
              (t.status || "To Do").toLowerCase() === col.status.toLowerCase(),
          ),
        })),
      );
    }
  }, [tasks]);

  const deleteHandler = useCallback(
    async (taskId: string) => {
      await deleteTasks(taskId);
    },
    [deleteTasks],
  );

  const handleDragEvent = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const newStatus = over.id as Task["status"];

      setColumnData((prev) => {
        let taskToMove: Task | null = null;
        let sourceIndex = -1;

        for (let i = 0; i < prev.length; i++) {
          const idx = prev[i].tasks.findIndex((t) => t._id === taskId);
          if (idx !== -1) {
            taskToMove = prev[i].tasks[idx];
            sourceIndex = i;
            break;
          }
        }

        if (!taskToMove || taskToMove.status === newStatus) return prev;

        const updatedTask = { ...taskToMove, status: newStatus };

        return prev.map((col, i) => {
          if (i === sourceIndex) {
            return {
              ...col,
              tasks: col.tasks.filter((t) => t._id !== taskId),
            };
          } else if (col.status === newStatus) {
            return {
              ...col,
              tasks: [...col.tasks, updatedTask],
            };
          }
          return col;
        });
      });

      await updateTaskStatus(taskId, newStatus);
    },
    [updateTaskStatus],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  return (
    <div className="md:px-6 font-mono space-y-6">
      {/* Header */}
      <div
        className="border-2 border-black bg-[#f8f6f2] 
                      shadow-[3px_3px_0px_#1f1f1f] max-w-6xl p-4"
      >
        <div className="bg-[#1f1f1f] text-white text-xs px-2 py-1 inline-block mb-2">
          KANBAN
        </div>
        <h1 className="text-lg font-bold">Kanban Workspace</h1>
      </div>

      <DndContext onDragEnd={handleDragEvent} sensors={sensors}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columnData.map((item, idx) => (
            <DroppableColumn
              key={idx}
              id={item.status}
              className={`p-4 border border-black 
                ${item.status === "To Do" && "bg-[#fee2e2]"}
                ${item.status === "In Progress" && "bg-[#e0f2fe]"}
                ${item.status === "Done" && "bg-[#dcfce7]"}
              `}
            >
              <h2 className="text-sm font-bold mb-4 border-b border-black pb-2">
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
                  <p className="text-xs text-gray-500 italic">No tasks</p>
                )}
              </div>

              {/* Add Button */}
              <button
                className="mt-5 w-full border border-black bg-white text-xs py-2
                           shadow-[2px_2px_0px_#1f1f1f]
                           active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                onClick={() => {
                  setSelectedData(undefined);
                  setActiveStatus(item.status);
                  setOpenModal(true);
                }}
              >
                + Add Task
              </button>
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
