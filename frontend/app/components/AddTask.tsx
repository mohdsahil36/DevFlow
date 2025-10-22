import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { TaskFormData } from "@/zod/taskTypes";

type AddTaskProps = {
  status: string;
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
  const [open, setOpen] = useState(false);

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    const newTask = {
      ...formData,
      status: props.status,
      _id: crypto.randomUUID(),
    };

    setFormData(initialFormData as TaskFormData);
    setOpen(false);

    try {
      const response = await fetch(`http://localhost:8080/kanban`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add new task:", errorData);
      } else {
        const result = await response.json();
        console.log("Task added successfully:", result);
      }
    } catch (error) {
      console.error("Error adding new task", error);
    }
  }
  return (
    <div className="w-auto">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer mt-5 rounded-sm w-1/3"
            onClick={() => setOpen(true)}
          >
            <PlusCircle />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="hidden">New task</DialogTitle>
          <div className="mt-3">
            <form action="submit" onSubmit={submitForm}>
              <div className="flex flex-col gap-y-3.5">
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
                    className="mt-3"
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
              <div className="mt-4 text-right grid grid-flow-col gap-4">
                <Button className="cursor-pointer" variant="outline">
                  Cancel
                </Button>
                <Button className="cursor-pointer text-white ">Submit</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
