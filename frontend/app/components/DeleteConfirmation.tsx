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

export default function DeleteConfirmation() {
  return (
    <Dialog>
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
          <Button className="cursor-pointer">Delete</Button>
          <Button variant={"secondary"} className="cursor-pointer">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
