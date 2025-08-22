"use client";

import { useState, useEffect } from "react";
import useDataFetch from "../hooks/useDataFetch";
import { Task, Column } from "../types/types";

export default function KanbanBoard() {
  const columns: Column[] = [
    { status: "To Do", tasks: [] },
    { status: "In Progress", tasks: [] },
    { status: "Done", tasks: [] },
  ];

  const [columnData, setColumnData] = useState<Column[]>(columns);
  const { data: fetchedData } = useDataFetch();

  useEffect(() => {
    if (fetchedData && Array.isArray(fetchedData)) {
      setColumnData((prevColumns) =>
        prevColumns.map((column) => {
          const tasksForColumn: Task[] = fetchedData.filter((item) => {
            const taskStatus = item.status?.toLowerCase().trim();
            const columnStatus = column.status.toLowerCase().trim();

            return taskStatus === columnStatus;
          });

          return { ...column, tasks: tasksForColumn };
        })
      );
    }
  }, [fetchedData]);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-semibold text-center mb-6">Kanban Board</h1>

      {/* Show data summary */}
      {fetchedData && (
        <div className="text-center mb-4 text-gray-600">
          Total tasks loaded: {fetchedData.length}
        </div>
      )}

      <div className="flex gap-4 mt-6">
        {columnData.map((item, itemindex) => (
          <div
            key={itemindex}
            className="w-1/3 bg-blue-400 p-4 rounded-lg shadow-md text-center"
          >
            <h2 className="font-bold mb-3 bg-red-600 p-2 rounded">
              {item.status} ({item.tasks.length})
            </h2>
            <div className="space-y-2">
              {item.tasks.length > 0 ? (
                item.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white rounded shadow-sm text-left"
                  >
                    <h3 className="font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <p>Priority: {task.priority}</p>
                      <p>Due: {task.due_date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-200 italic">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
