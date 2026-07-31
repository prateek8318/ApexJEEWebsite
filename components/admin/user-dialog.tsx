"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User } from "@/types/admin-api";
import { ScrollArea } from "@/components/ui/scroll-area";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().optional(),
  examTarget: z.enum(["jee_main", "jee_advanced", "neet"]),
  targetYear: z.coerce.number().optional(),
  examDate: z.string().optional(),
  prepStartDate: z.string().optional(),
  prepEndDate: z.string().optional(),
  status: z.enum(["online", "offline"]).default("offline"),
  isEmailVerified: z.boolean().default(true),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => void;
  isPending: boolean;
  editingUser: User | null;
  isViewOnly?: boolean;
}

export default function UserDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  editingUser,
  isViewOnly = false,
}: UserDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      examTarget: "jee_advanced",
      targetYear: new Date().getFullYear() + 1,
      examDate: "",
      prepStartDate: "",
      prepEndDate: "",
      status: "offline",
      isEmailVerified: true,
    },
  });

  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        examTarget: editingUser.examTarget || "jee_advanced",
        targetYear: editingUser.targetYear || new Date().getFullYear() + 1,
        examDate: editingUser.examDate ? new Date(editingUser.examDate).toISOString().split('T')[0] : "",
        prepStartDate: editingUser.prepStartDate ? new Date(editingUser.prepStartDate).toISOString().split('T')[0] : "",
        prepEndDate: editingUser.prepEndDate ? new Date(editingUser.prepEndDate).toISOString().split('T')[0] : "",
        status: editingUser.status || "offline",
        isEmailVerified: editingUser.isEmailVerified ?? true,
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        password: "",
        examTarget: "jee_advanced",
        targetYear: new Date().getFullYear() + 1,
        examDate: "",
        prepStartDate: "",
        prepEndDate: "",
        status: "offline",
        isEmailVerified: true,
      });
    }
  }, [editingUser, isOpen, reset]);

  // Make password required only on creation
  const handleFormSubmit = (data: UserFormValues) => {
    if (!editingUser && !data.password) {
      // Manual trigger for password if creating
      if (!data.password) {
         // handle error manually or refine zod schema (using superRefine)
      }
    }
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl text-slate-800">
            {isViewOnly ? "View User" : (editingUser ? "Edit User" : "Add New User")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => handleFormSubmit(data as UserFormValues))} className="flex flex-col max-h-[75vh]" autoComplete="off">
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4 m-0 p-1">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name <span className="text-rose-500">*</span></Label>
                  <Input {...register("name")} disabled={isViewOnly} autoComplete="off" data-lpignore="true" />
                  {errors.name && <span className="text-xs text-rose-500">{errors.name.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Email <span className="text-rose-500">*</span></Label>
                  <Input type="email" {...register("email")} disabled={isViewOnly} autoComplete="new-email" data-lpignore="true" />
                  {errors.email && <span className="text-xs text-rose-500">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone <span className="text-rose-500">*</span></Label>
                  <Input {...register("phone")} disabled={isViewOnly} autoComplete="new-phone" data-lpignore="true" />
                  {errors.phone && <span className="text-xs text-rose-500">{errors.phone.message}</span>}
                </div>
                {!editingUser && (
                  <div className="space-y-2">
                    <Label>Password <span className="text-rose-500">*</span></Label>
                    <Input type="password" {...register("password")} disabled={isViewOnly} required={!editingUser} autoComplete="new-password" data-lpignore="true" />
                    {errors.password && <span className="text-xs text-rose-500">{errors.password.message}</span>}
                  </div>
                )}
              </div>

              {/* Prep Info */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Exam Target <span className="text-rose-500">*</span></Label>
                  <Select 
                    value={watch("examTarget")} 
                    onValueChange={(val: any) => setValue("examTarget", val)}
                    disabled={isViewOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jee_main">JEE Main</SelectItem>
                      <SelectItem value="jee_advanced">JEE Advanced</SelectItem>
                      <SelectItem value="neet">NEET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Year</Label>
                  <Input type="number" {...register("targetYear")} disabled={isViewOnly} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prep Start Date</Label>
                  <Input type={"date" as any} {...register("prepStartDate")} disabled={isViewOnly} />
                </div>
                <div className="space-y-2">
                  <Label>Prep End Date</Label>
                  <Input type={"date" as any} {...register("prepEndDate")} disabled={isViewOnly} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={watch("status")} 
                    onValueChange={(val: any) => setValue("status", val)}
                    disabled={isViewOnly}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Email Verification</Label>
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      checked={watch("isEmailVerified")}
                      onCheckedChange={(checked) => setValue("isEmailVerified", checked)}
                      disabled={isViewOnly}
                    />
                    <span className="text-sm font-medium text-slate-700">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
            <div className="text-xs text-rose-500">
              {(!isViewOnly && Object.keys(errors).length > 0) && "Please fix validation errors before saving."}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {isViewOnly ? "Close" : "Cancel"}
              </Button>
              {!isViewOnly && (
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save User"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
