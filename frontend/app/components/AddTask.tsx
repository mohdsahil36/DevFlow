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

export default function AddTask() {
  return (
    <div className="w-auto">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer mt-5 rounded-sm w-1/3"
          >
            <PlusCircle />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="hidden">New task</DialogTitle>
          <div className="mt-3">
            <form action="submit">
              <div className="flex flex-col gap-y-3.5">
                <div>
                  <Label htmlFor="Task Name">Title</Label>
                  <Input placeholder="Enter task title" className="mt-3" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Enter task details" className="mt-3" />
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-3">
                    <Label>Priority</Label>
                    <div>
                      <Select>
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
                          Select Date
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar mode="single" captionLayout="dropdown" />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-3 w-1/3 mt-6 place-self-end">
            <Button variant="ghost" className="cursor-pointer">
              Cancel
            </Button>
            <Button className="cursor-pointer text-white">Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
