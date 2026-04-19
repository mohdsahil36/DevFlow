import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { TaskFormData } from "@/zod/taskTypes";
import { useTaskStore } from "../../store/taskStore";
import type { Task } from "@/app/types/types";

type AddTaskProps = {
  status: string;
  openModal: boolean;
  selectedData?: { success?: boolean; data: Task };
  setOpenModal: (open: boolean) => void;
};

const initialFormData = {
  title: "",
  description: "",
  priority: "low",
  dueDate: undefined,
};

export default function AddTask(props: AddTaskProps) {
  const [formData, setFormData] = useState<TaskFormData>(
    initialFormData as TaskFormData,
  );
  const editTaskData = props.selectedData;

  // Destructure from the hook
  const { addOrEditTask } = useTaskStore();
  useEffect(() => {
    if (editTaskData) {
      const taskData = editTaskData.data;
      setFormData({
        title: taskData.title || "",
        description: taskData.description || "",
        priority:
          (taskData.priority?.toLowerCase() as "low" | "medium" | "high") ||
          "low",
        dueDate: taskData.due_date ? new Date(taskData.due_date) : undefined,
        status: props.status,
        _id: taskData._id || crypto.randomUUID(),
      });
    } else {
      setFormData(initialFormData as TaskFormData);
    }
  }, [editTaskData, props.status]); // undefined
  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    const isEditMode = !!(editTaskData && editTaskData.data);

    const taskToSubmit = {
      ...formData,
      status: props.status,
      _id: isEditMode ? formData._id : crypto.randomUUID(),
    };

    try {
      const result = await addOrEditTask(taskToSubmit, isEditMode);
      if (!result?.success) {
        console.error(
          `Failed to ${isEditMode ? "update" : "add"} task:`,
          result,
        );
        return;
      }
      console.log(
        `Task ${isEditMode ? "updated" : "added"} successfully:`,
        result,
      );

      setFormData(initialFormData as TaskFormData);
      props.setOpenModal(false);
    } catch (error) {
      console.error("Error adding/updating task", error);
    }
  }

  const handleDialogClose = (open: boolean) => {
    props.setOpenModal(open);
    if (!open) {
      setFormData(initialFormData as TaskFormData);
    }
  };

  return (
    <div className="font-mono">
      <Dialog onOpenChange={handleDialogClose} open={props.openModal}>
        <DialogContent
          className="min-w-[42rem] 
          border-2 border-black 
          bg-[#f8f6f2] 
          shadow-[3px_3px_0px_#1f1f1f] 
          p-0"
        >
          <DialogTitle className="sr-only">
            {props.selectedData ? "Edit Task" : "Add Task"}
          </DialogTitle>
          {/* Header */}
          <div className="bg-[#1f1f1f] text-white px-3 py-2 text-xs">
            TASK EDITOR
          </div>

          <div className="p-6">
            <form onSubmit={submitForm}>
              <div className="flex flex-col gap-y-8">
                {/* Title */}
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    placeholder="Enter task title"
                    className="mt-2 border border-black bg-white text-sm 
                               rounded-none focus-visible:ring-0"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    placeholder="Enter task details"
                    className="mt-2 border border-black bg-white text-sm h-20 
                               rounded-none focus-visible:ring-0"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Priority + Date */}
                <div className="flex justify-between gap-6">
                  {/* Priority */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs">Priority</Label>

                    <Select
                      value={formData.priority}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger className="w-48 border border-black bg-white text-sm rounded-none">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent className="border border-black bg-white">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs">Due Date</Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="w-48 border border-black bg-white px-3 py-2 text-left text-sm
                                     shadow-[2px_2px_0px_#1f1f1f]
                                     active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                          {formData.dueDate
                            ? formData.dueDate.toDateString()
                            : "Select Date"}
                        </button>
                      </PopoverTrigger>

                      <PopoverContent className="border border-black p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dueDate}
                          onSelect={(date) => {
                            if (date) {
                              setFormData({ ...formData, dueDate: date });
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-8">
                {/* Primary */}
                <button
                  type="submit"
                  className="px-4 py-2 border-2 border-black 
                             bg-[#dbeafe] 
                             shadow-[3px_3px_0px_#1f1f1f]
                             text-xs
                             active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  {props.selectedData ? "Update Task" : "Add Task"}
                </button>

                {/* Secondary */}
                <button
                  type="button"
                  onClick={() => setFormData(initialFormData as TaskFormData)}
                  className="px-4 py-2 border-2 border-black 
                             bg-[#fef08a]
                             shadow-[2px_2px_0px_#1f1f1f]
                             text-xs
                             active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Reset
                </button>

                {/* Tertiary */}
                <button
                  type="button"
                  onClick={() => props.setOpenModal(false)}
                  className="px-4 py-2 border border-black bg-white text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
