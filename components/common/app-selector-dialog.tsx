"use client";

import { useState } from "react";
import { Building2, ChevronRight, Plus, Pencil, Trash2, UserCircle } from "lucide-react";
import { cn } from "@lib/utils";
import { toast } from "@components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { ScrollArea } from "@components/ui/scroll-area";
import EditAppDialog from "./edit-app-dialog";
import DeleteAppDialog from "./delete-app-dialog";
import { workspaces } from "@data/workspaces";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const AppSelectorDialog = ({ isOpen, onOpenChange }: Props) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCreateApp = () => {
    toast.success("created app successfully");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="items-center text-center space-y-2 mb-4">
            <Building2 className="size-10 text-muted-foreground" />
            <DialogTitle className="text-xl font-semibold">
              TECH Horizon
            </DialogTitle>
            <DialogDescription className="text-sm">
              Manage your workspaces
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Workspaces
            </p>

            <ScrollArea className="h-[185px] rounded-lg border">
              <div className="flex flex-col divide-y bg-background">
                {workspaces.map((app) => (
                  <Popover key={app.id}>
                    <PopoverTrigger asChild>
                      <button className="flex w-full items-center justify-between px-4 py-3 hover:bg-accent transition">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "size-9 flex items-center justify-center rounded-md text-white text-sm font-semibold",
                              app.bg
                            )}
                          >
                            {app.icon}
                          </div>
                          <span className="text-sm font-medium">
                            {app.name}
                          </span>
                        </div>

                        <ChevronRight className="size-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      side="right"
                      align="start"
                      className="w-44 p-1"
                    >
                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-accent"
                        onClick={() => setEditOpen(true)}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </button>

                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteOpen(true)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </button>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-3 pt-1">
              <button
                className="flex w-full items-center justify-between px-4 py-3 rounded-lg border hover:bg-accent transition group"
                onClick={() => onOpenChange(false)}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 flex items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <UserCircle className="size-5" />
                  </div>
                  <span className="text-sm font-medium">Profile</span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>

              <button
                className="flex w-full items-center justify-center gap-2 py-3 border rounded-lg hover:bg-accent transition bg-accent/20"
                onClick={handleCreateApp}
              >
                <Plus className="size-4" />
                <span className="text-sm font-medium">Create app</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditAppDialog openDialog={editOpen} setOpenDialog={setEditOpen} />
      <DeleteAppDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
};

export default AppSelectorDialog;