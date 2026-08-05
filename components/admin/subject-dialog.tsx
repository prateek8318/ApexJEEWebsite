import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Subject } from "@/types/admin-api";
import { UploadCloud } from "lucide-react";

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
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema as any),
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
      setFileName(null);
      // Show existing icon if it's a valid string URL
      setPreviewUrl(typeof editingSubject.icon === 'string' && editingSubject.icon ? editingSubject.icon : null);
    } else {
      form.reset({
        name: "",
        code: "",
        colorTheme: "#2563eb",
        order: 0,
        isActive: true,
      });
      setFileName(null);
      setPreviewUrl(null);
    }
  }, [editingSubject, form, isOpen]);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = (values: SubjectFormValues) => {
    const file = form.getValues("icon");
    onSubmit(values, file instanceof FileList && file.length > 0 ? file[0] : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-y-auto bg-white">
        
        <div className="px-10 pt-10 pb-6 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {editingSubject ? "Edit Subject" : "Create Subject"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-2 text-base">
              {editingSubject
                ? "Update the configuration details for this subject."
                : "Enter the details below to add a new subject to the curriculum."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-10 py-8 space-y-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Subject Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Physics" 
                        className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Subject Code <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. PHY101" 
                        className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 uppercase text-base mt-2" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="colorTheme"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Brand Color (Hex)</FormLabel>
                    <FormControl>
                      <div className="flex gap-4 items-center mt-2">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0">
                          <Input 
                            type={"color" as any} 
                            className="absolute -inset-2 w-16 h-16 cursor-pointer border-0 p-0" 
                            {...field} 
                          />
                        </div>
                        <Input 
                          placeholder="#2563eb" 
                          className="h-12 px-4 bg-white border-slate-200 shadow-sm font-mono text-base uppercase focus-visible:ring-blue-500 w-full" 
                          {...field} 
                        />
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
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Display Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                        {...field} 
                      />
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
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Subject Icon</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full mt-2">
                      <label className={`flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-xl cursor-pointer transition-colors ${previewUrl ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}`}>
                        {previewUrl ? (
                          <div className="flex flex-col items-center gap-3 py-2">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white flex items-center justify-center p-2">
                              <img src={previewUrl} alt="Icon preview" className="max-w-full max-h-full object-contain" />
                            </div>
                            <span className="text-base font-semibold text-slate-800">{fileName || 'Current Icon'}</span>
                            <span className="text-sm text-blue-600 font-medium hover:underline">Click to replace</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-slate-400 group-hover:text-blue-500 transition-colors">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <p className="text-base font-semibold text-slate-700">Click to upload icon</p>
                            <p className="text-sm text-slate-500 mt-2">PNG, JPG or SVG (Max 2MB)</p>
                          </div>
                        )}
                        <Input
                          type={"file" as any}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            onChange(files);
                            if (files && files.length > 0) {
                              const file = files[0];
                              setFileName(file.name);
                              if (previewUrl && previewUrl.startsWith('blob:')) {
                                URL.revokeObjectURL(previewUrl);
                              }
                              setPreviewUrl(URL.createObjectURL(file));
                            }
                          }}
                          {...field}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm mt-4">
                  <div className="space-y-1.5">
                    <FormLabel className="text-slate-900 font-semibold text-lg">Active Status</FormLabel>
                    <p className="text-base text-slate-500">
                      Make this subject visible to students across the platform.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600 scale-125"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="h-12 px-6 font-semibold border-slate-200 hover:bg-slate-50 text-slate-600 text-base"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="h-12 px-8 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-base"
              >
                {isPending ? "Saving..." : "Save Subject"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
