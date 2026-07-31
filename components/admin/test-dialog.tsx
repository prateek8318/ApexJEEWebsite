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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Test } from "@/types/admin-api";

const testSchema = z.object({
  title: z.string().min(1, "Title is required."),
  examTag: z.string().optional(),
  mode: z.string().optional(),
  testCategory: z.string().optional(),
  instructions: z.string().optional(),
  negativeMarking: z.boolean().default(false),
  durationMins: z.coerce.number().default(180),
  scheduledAt: z.string().optional(),
  isLive: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type TestFormValues = z.infer<typeof testSchema>;

type TestDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TestFormValues) => void;
  isPending: boolean;
  editingTest?: Test | null;
};

export default function TestDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  editingTest,
}: TestDialogProps) {
  
  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema as any),
    defaultValues: {
      title: "",
      examTag: "",
      mode: "",
      testCategory: "",
      instructions: "",
      negativeMarking: false,
      durationMins: 180,
      scheduledAt: "",
      isLive: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (editingTest) {
      let instructionsText = "";
      if (typeof editingTest.instructions === "string") {
        instructionsText = editingTest.instructions;
      } else if (editingTest.instructions) {
        try {
          instructionsText = JSON.stringify(editingTest.instructions);
        } catch {
          instructionsText = "";
        }
      }

      let scheduledAtFormatted = "";
      if (editingTest.scheduledAt) {
        const date = new Date(editingTest.scheduledAt);
        // Format to YYYY-MM-DDThh:mm
        const pad = (num: number) => num.toString().padStart(2, '0');
        scheduledAtFormatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
      }

      form.reset({
        title: editingTest.title,
        examTag: editingTest.examTag || "",
        mode: editingTest.mode || "",
        testCategory: editingTest.testCategory || "",
        instructions: instructionsText,
        negativeMarking: editingTest.negativeMarking || false,
        durationMins: editingTest.durationMins || 180,
        scheduledAt: scheduledAtFormatted,
        isLive: editingTest.isLive || false,
        isActive: editingTest.isActive !== false,
      });
    } else {
      form.reset({
        title: "",
        examTag: "",
        mode: "",
        testCategory: "",
        instructions: "",
        negativeMarking: false,
        durationMins: 180,
        scheduledAt: "",
        isLive: false,
        isActive: true,
      });
    }
  }, [editingTest, form, isOpen]);

  const handleFormSubmit = (values: TestFormValues) => {
    let formattedInstructions = values.instructions;
    if (formattedInstructions) {
      try {
        // Test if it's already valid JSON
        JSON.parse(formattedInstructions);
      } catch {
        // If it's plain text, split by newline and stringify as a JSON array
        const lines = formattedInstructions.split('\n').filter(line => line.trim() !== '');
        formattedInstructions = JSON.stringify(lines);
      }
    }
    
    onSubmit({
      ...values,
      instructions: formattedInstructions
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-y-auto bg-white">
        <div className="px-10 pt-10 pb-6 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {editingTest ? "Edit Test" : "Create Test"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-2 text-base">
              {editingTest
                ? "Make changes to the test configuration here."
                : "Fill in the details below to add a new test or mock exam."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="px-10 py-8 space-y-8">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Test Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. JEE Full Mock Test 1" 
                      className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="examTag"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Exam Tag</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. JEE" 
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
                name="mode"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Mode</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="practice">Practice</SelectItem>
                        <SelectItem value="mock">Mock</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testCategory"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full">Full Syllabus</SelectItem>
                        <SelectItem value="subject">Subject</SelectItem>
                        <SelectItem value="chapter">Chapter</SelectItem>
                        <SelectItem value="topic">Topic</SelectItem>
                        <SelectItem value="pyq">PYQ</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="durationMins"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Duration (Mins)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
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
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Scheduled At (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type={"datetime-local" as any} 
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
              name="instructions"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-slate-700 font-semibold text-sm block mb-2">Instructions (JSON format or plain text)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Test instructions..." 
                      className="min-h-[120px] px-4 py-3 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500 text-base mt-2 resize-y" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm mt-4">
              <FormField
                control={form.control}
                name="negativeMarking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between pb-4 border-b border-slate-200/60">
                    <div className="space-y-1.5 pr-4">
                      <FormLabel className="text-slate-900 font-semibold text-base">Negative Marking</FormLabel>
                      <p className="text-sm text-slate-500">
                        Enable deductions for incorrect answers in this test.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600 scale-110"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isLive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between pb-4 border-b border-slate-200/60">
                    <div className="space-y-1.5 pr-4">
                      <FormLabel className="text-slate-900 font-semibold text-base">Live Test</FormLabel>
                      <p className="text-sm text-slate-500">
                        Mark this as a live scheduled test for students.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600 scale-110"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5 pr-4">
                      <FormLabel className="text-slate-900 font-semibold text-base">Active Status</FormLabel>
                      <p className="text-sm text-slate-500">
                        Make this test visible and accessible to students.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600 scale-110"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
                {isPending ? "Saving..." : "Save Test"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
