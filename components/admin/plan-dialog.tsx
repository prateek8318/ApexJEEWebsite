"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { SubscriptionPlan } from "@/types/admin-api";
import { Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  planType: z.enum(["trial", "monthly", "quarterly", "yearly"]),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  billingCycleDays: z.coerce.number().min(1, "Billing cycle is required"),
  compareAtPrice: z.coerce.number().nullable().optional(),
  savePercent: z.coerce.number().min(0).default(0),
  isTrial: z.boolean().default(false),
  trialDays: z.coerce.number().default(0),
  badge: z.string().nullable().optional(),
  highlight: z.boolean().default(false),
  ctaLabel: z.string().default("Get Started"),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  features: z.array(
    z.object({
      label: z.string().min(1, "Feature label is required"),
      included: z.boolean().default(true),
    })
  ),
  limits: z.object({
    fullContentAccess: z.boolean().default(false),
    mockTestsPerCycle: z.coerce.number().nullable().optional(),
    smartTimetable: z.enum(["none", "limited", "full"]),
    performanceAnalytics: z.enum(["none", "basic", "full"]),
    doubtResolutionPriority: z.boolean().default(false),
    tutorProgressAccess: z.boolean().default(false),
    downloadableReports: z.boolean().default(false),
  }),
});

export type PlanFormValues = z.infer<typeof planSchema>;

interface PlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PlanFormValues) => void;
  isPending: boolean;
  editingPlan: SubscriptionPlan | null;
  isViewOnly?: boolean;
}

export default function PlanDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  editingPlan,
  isViewOnly = false,
}: PlanDialogProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema) as any,
    defaultValues: {
      name: "",
      code: "",
      planType: "monthly",
      price: 0,
      billingCycleDays: 30,
      compareAtPrice: null,
      savePercent: 0,
      isTrial: false,
      trialDays: 0,
      badge: "",
      highlight: false,
      ctaLabel: "Get Started",
      order: 0,
      isActive: true,
      features: [],
      limits: {
        fullContentAccess: false,
        mockTestsPerCycle: null,
        smartTimetable: "none",
        performanceAnalytics: "none",
        doubtResolutionPriority: false,
        tutorProgressAccess: false,
        downloadableReports: false,
      },
    },
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: "features",
  });

  useEffect(() => {
    if (editingPlan) {
      reset({
        ...editingPlan,
        badge: editingPlan.badge || "",
        compareAtPrice: editingPlan.compareAtPrice || null,
        limits: {
          ...editingPlan.limits,
          mockTestsPerCycle: editingPlan.limits?.mockTestsPerCycle || null,
        }
      });
    } else {
      reset({
        name: "",
        code: "",
        planType: "monthly",
        price: 0,
        billingCycleDays: 30,
        compareAtPrice: null,
        savePercent: 0,
        isTrial: false,
        trialDays: 0,
        badge: "",
        highlight: false,
        ctaLabel: "Get Started",
        order: 0,
        isActive: true,
        features: [],
        limits: {
          fullContentAccess: false,
          mockTestsPerCycle: null,
          smartTimetable: "none",
          performanceAnalytics: "none",
          doubtResolutionPriority: false,
          tutorProgressAccess: false,
          downloadableReports: false,
        },
      });
    }
    setActiveTab("basic");
  }, [editingPlan, isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl text-slate-800">
            {isViewOnly ? "View Subscription Plan" : (editingPlan ? "Edit Subscription Plan" : "Add New Plan")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => onSubmit(data as PlanFormValues))} className="flex flex-col h-[70vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-2 border-b border-slate-100">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="limits">Usage Limits</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="flex-1 px-6 py-4">
              <TabsContent value="basic" className="space-y-4 m-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name <span className="text-rose-500">*</span></Label>
                    <Input {...register("name")} placeholder="e.g. Monthly Pro" disabled={isViewOnly} className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default" />
                    {errors.name && <span className="text-xs text-rose-500">{errors.name.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label>Code (Unique) <span className="text-rose-500">*</span></Label>
                    <Input {...register("code")} placeholder="e.g. monthly_pro" disabled={isViewOnly} className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default" />
                    {errors.code && <span className="text-xs text-rose-500">{errors.code.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Plan Type <span className="text-rose-500">*</span></Label>
                    <Select 
                      value={watch("planType")} 
                      onValueChange={(val: any) => setValue("planType", val)}
                      disabled={isViewOnly}
                    >
                      <SelectTrigger className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="trial">Trial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price (₹) <span className="text-rose-500">*</span></Label>
                    <Input type="number" {...register("price")} disabled={isViewOnly} className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default" />
                    {errors.price && <span className="text-xs text-rose-500">{errors.price.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Billing Cycle (Days) <span className="text-rose-500">*</span></Label>
                    <Input type="number" {...register("billingCycleDays")} disabled={isViewOnly} className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default" />
                    {errors.billingCycleDays && <span className="text-xs text-rose-500">{errors.billingCycleDays.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label>Compare At Price</Label>
                    <Input type="number" {...register("compareAtPrice")} placeholder="Optional" disabled={isViewOnly} className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default" />
                  </div>
                  <div className="space-y-2">
                    <Label>Save Percent (%)</Label>
                    <Input type="number" {...register("savePercent")} disabled={isViewOnly} className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Badge Text</Label>
                    <Input {...register("badge")} placeholder="e.g. MOST POPULAR" disabled={isViewOnly} className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default" />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Label</Label>
                    <Input {...register("ctaLabel")} placeholder="e.g. Get Started" disabled={isViewOnly} className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Order</Label>
                    <Input type="number" {...register("order")} disabled={isViewOnly} className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default" />
                  </div>
                </div>

                <div className="flex gap-6 py-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={watch("isActive")}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                      disabled={isViewOnly}
                    />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={watch("highlight")}
                      onCheckedChange={(checked) => setValue("highlight", checked)}
                      disabled={isViewOnly}
                    />
                    <Label>Highlight Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={watch("isTrial")}
                      onCheckedChange={(checked) => setValue("isTrial", checked)}
                      disabled={isViewOnly}
                    />
                    <Label>Is Trial?</Label>
                  </div>
                </div>
                
                {watch("isTrial") && (
                  <div className="space-y-2">
                    <Label>Trial Days</Label>
                    <Input type="number" {...register("trialDays")} disabled={isViewOnly} className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="features" className="space-y-4 m-0">
                <div className="flex items-center justify-between">
                  <Label>Plan Features</Label>
                  {!isViewOnly && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => appendFeature({ label: "", included: true })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Feature
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {featureFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <Input
                        {...register(`features.${index}.label`)}
                        placeholder="Feature label..."
                        className="flex-1 bg-white disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default"
                        disabled={isViewOnly}
                      />
                      <div className="flex items-center space-x-2 px-2">
                        <Switch
                          checked={watch(`features.${index}.included`)}
                          onCheckedChange={(c) => setValue(`features.${index}.included`, c)}
                          disabled={isViewOnly}
                        />
                        <span className="text-sm">Included</span>
                      </div>
                      {!isViewOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeature(index)}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {featureFields.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                      No features added yet. Click "Add Feature" to begin.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="limits" className="space-y-6 m-0">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <Label className="font-semibold text-slate-800">Mock Tests Per Cycle</Label>
                    <Input 
                      type="number" 
                      placeholder="Leave empty for unlimited"
                      onChange={(e) => {
                        const val = e.target.value;
                        setValue("limits.mockTestsPerCycle", val ? parseInt(val) : null);
                      }}
                      value={watch("limits.mockTestsPerCycle") === null ? "" : watch("limits.mockTestsPerCycle") as number}
                      disabled={isViewOnly}
                      className="disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default"
                    />
                    <p className="text-xs text-slate-500">Number of mock tests user can take.</p>
                  </div>

                  <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <Label className="font-semibold text-slate-800">Smart Timetable Access</Label>
                    <Select 
                      value={watch("limits.smartTimetable")} 
                      onValueChange={(val: any) => setValue("limits.smartTimetable", val)}
                      disabled={isViewOnly}
                    >
                      <SelectTrigger className="bg-white disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default">
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="limited">Limited</SelectItem>
                        <SelectItem value="full">Full Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <Label className="font-semibold text-slate-800">Performance Analytics</Label>
                    <Select 
                      value={watch("limits.performanceAnalytics")} 
                      onValueChange={(val: any) => setValue("limits.performanceAnalytics", val)}
                      disabled={isViewOnly}
                    >
                      <SelectTrigger className="bg-white disabled:opacity-100 disabled:text-indigo-700 disabled:bg-indigo-50/30 disabled:font-semibold disabled:cursor-default">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="full">Full Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <Label>Full Content Access</Label>
                      <Switch
                        checked={watch("limits.fullContentAccess")}
                        onCheckedChange={(c) => setValue("limits.fullContentAccess", c)}
                        disabled={isViewOnly}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Doubt Resolution Priority</Label>
                      <Switch
                        checked={watch("limits.doubtResolutionPriority")}
                        onCheckedChange={(c) => setValue("limits.doubtResolutionPriority", c)}
                        disabled={isViewOnly}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Tutor Progress Access</Label>
                      <Switch
                        checked={watch("limits.tutorProgressAccess")}
                        onCheckedChange={(c) => setValue("limits.tutorProgressAccess", c)}
                        disabled={isViewOnly}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Downloadable Reports</Label>
                      <Switch
                        checked={watch("limits.downloadableReports")}
                        onCheckedChange={(c) => setValue("limits.downloadableReports", c)}
                        disabled={isViewOnly}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>

            <div className="px-6 py-4 border-t border-slate-100 bg-white">
              <div className="flex justify-between items-center">
                <div className="text-xs text-rose-500">
                  {(!isViewOnly && Object.keys(errors).length > 0) && "Please fix validation errors before saving."}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    {isViewOnly ? "Close" : "Cancel"}
                  </Button>
                  {!isViewOnly && (
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Saving..." : "Save Plan"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}
