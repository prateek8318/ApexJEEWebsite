"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/toaster";
import { Pencil } from "lucide-react";

type Props = {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

const EditAppDialog = ({ openDialog, setOpenDialog }: Props) => {
  const [appName, setAppName] = useState("Retail Banking Consent Hub");

  const handleClose = () => setOpenDialog(false);

  const handleUpdate = () => {
    if (!appName.trim()) return;
    toast.success("App updated successfully");
    handleClose();
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-md p-6"
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">
            Edit App Name
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="appName" className="text-sm">
            App Name
          </Label>

          <Input
            id="appName"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="Enter app name"
          />
        </div>

        <DialogFooter className="mt-6 flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="warning"
            onClick={handleUpdate}
            disabled={!appName.trim()}
            className="flex items-center gap-2"
          >
            <Pencil className="size-4" />
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppDialog;