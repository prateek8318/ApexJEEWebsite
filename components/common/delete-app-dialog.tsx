"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

const DeleteAppDialog = ({ open, onOpenChange }: Props) => {
  const handleClose = () => onOpenChange(false);

  const handleDelete = () => {
    // 👉 API later
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="items-center text-center space-y-3">
          <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <Trash2 className="size-6 text-destructive" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Delete Workspace?
          </DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to delete this workspace? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex gap-2 sm:justify-center">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex-1"
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAppDialog;
