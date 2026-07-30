"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Subject } from "@/types/admin-api";
import { FileInput } from "@/components/ui/file-input";

const subjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  code: z.string().min(2, "Code must be at least 2 characters."),
  colorTheme: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  icon: z.any().optional(), // For file upload
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;

type SubjectDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SubjectFormValues, file: File | null) => void;
  isPending: boolean;
  editingSubject?: Subject | null;
};

export default function SubjectDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  editingSubject,
}: SubjectDialogProps) {
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      code: "",
      colorTheme: "#2563eb",
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (editingSubject) {
      form.reset({
        name: editingSubject.name,
        code: editingSubject.code,
        colorTheme: editingSubject.colorTheme || "#2563eb",
        order: editingSubject.order || 0,
        isActive: editingSubject.isActive !== false,
      });
    } else {
      form.reset({
        name: "",
        code: "",
        colorTheme: "#2563eb",
        order: 0,
        isActive: true,
      });
    }
  }, [editingSubject, form, isOpen]);

  const handleSubmit = (values: SubjectFormValues) => {
    const file = form.getValues("icon");
    onSubmit(values, file instanceof FileList && file.length > 0 ? file[0] : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingSubject ? "Edit Subject" : "Add Subject"}</DialogTitle>
          <DialogDescription>
            {editingSubject
              ? "Make changes to the subject details here."
              : "Fill in the details to create a new subject."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Physics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Code <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. physics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="colorTheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Theme (Hex)</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="color" className="w-12 p-1" {...field} />
                        <Input placeholder="#2563eb" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="icon"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Subject Icon</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    {editingSubject?.icon && !value && (
                      <span className="text-primary block mb-2">Current icon will be kept if no new file is selected.</span>
                    )}
                    Upload a square PNG/SVG icon for best results.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Active Status
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Is this subject visible to students?
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Subject"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
