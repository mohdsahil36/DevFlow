import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { TaskFormData } from "@/zod/taskTypes";
import { DialogClose } from "@radix-ui/react-dialog";

type AddTaskProps = {
  status: string;
  openModal: boolean;
  selectedData?: any;
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
    initialFormData as TaskFormData
  );
  const editTaskData = props.selectedData;

  useEffect(() => {
    if (editTaskData && editTaskData.data) {
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
  }, [editTaskData, props.status]);

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    const newTask = {
      ...formData,
      status: props.status,
      _id: crypto.randomUUID(),
    };

    setFormData(initialFormData as TaskFormData);
    props.setOpenModal(false);

    const isEditMode = editTaskData && editTaskData.data;

    try {
      let url, method;

      if (isEditMode) {
        url = `http://localhost:8080/kanban/${formData._id}`;
        method = "PUT";
      } else {
        url = `http://localhost:8080/kanban`;
        method = "POST";
      }
      const response = await fetch(`${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `Failed to ${isEditMode ? "update" : "add"} task:`,
          errorData
        );
      } else {
        const result = await response.json();
        console.log(
          `Task ${isEditMode ? "updated" : "added"} successfully:`,
          result
        );
      }
    } catch (error) {
      console.error("Error adding new task", error);
    }
  }

  const handleDialogClose = (open: boolean) => {
    props.setOpenModal(open);
    if (!open) {
      setFormData(initialFormData as TaskFormData);
    }
  };
  return (
    <div className="w-auto">
      <Dialog onOpenChange={handleDialogClose} open={props.openModal}>
        <DialogContent className="min-w-[40rem]">
          <DialogTitle className="hidden">New task</DialogTitle>
          <div className="mt-3 p-7">
            <form onSubmit={submitForm}>
              <div className="flex flex-col gap-y-6">
                <div>
                  <Label htmlFor="Task Name">Title</Label>
                  <Input
                    placeholder="Enter task title"
                    className="mt-3"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter task details"
                    className="mt-3 h-12"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-3">
                    <Label>Priority</Label>
                    <div>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="date" className="px-1">
                      Due Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-48 justify-between font-normal"
                        >
                          {formData.dueDate
                            ? formData.dueDate.toDateString()
                            : "Select Date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
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
              <div className="flex justify-end gap-4 mt-8">
                <Button className="cursor-pointer text-white" type="submit">
                  {props.selectedData ? "Update Task" : "Add Task"}
                </Button>
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setFormData(initialFormData as TaskFormData)}
                >
                  Reset
                </Button>
                <DialogClose
                  className="inline-flex cursor-pointer px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  type="button"
                  onClick={() => props.setOpenModal(false)}
                >
                  Cancel
                </DialogClose>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
