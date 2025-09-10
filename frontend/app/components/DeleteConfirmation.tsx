"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteConfirmation(props: {
  taskId: string;
  onTaskDelete: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleDelete = () => {
    props.onTaskDelete(props.taskId);
    setIsOpen(false);
  };
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger>
        <Trash2 className="size-4 cursor-pointer hover:text-red-400" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <Button className="cursor-pointer" onClick={() => handleDelete()}>
            Delete
          </Button>
          <Button
            variant={"secondary"}
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
