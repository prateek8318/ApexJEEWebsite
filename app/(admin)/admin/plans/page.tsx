"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { plansApi } from "@/lib/api/admin/plans";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { SubscriptionPlan } from "@/types/admin-api";
import { toast } from "sonner";
import PlanDialog, { PlanFormValues } from "@/components/admin/plan-dialog";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";

export default function AdminPlansPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-plans", search],
    queryFn: () => plansApi.getAllPlans(search),
  });

  const plans = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => plansApi.deletePlan(id),
    onSuccess: () => {
      toast.success("Subscription plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
    },
    onError: () => {
      toast.error("Failed to delete subscription plan");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: any }) => {
      if (id) {
        return plansApi.updatePlan(id, data);
      } else {
        return plansApi.createPlan(data);
      }
    },
    onSuccess: () => {
      toast.success(editingPlan ? "Subscription plan updated successfully" : "Subscription plan created successfully");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this subscription plan?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenView = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsViewOnly(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsViewOnly(false);
    setDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setIsViewOnly(false);
    setDialogOpen(true);
  };

  const handleSave = (values: PlanFormValues) => {
    saveMutation.mutate({ 
      id: editingPlan?._id, 
      data: values 
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Subscription Plans"
        description="Manage subscription tiers, pricing, features, and usage limits."
        buttonText="Add New Plan"
        onAdd={handleOpenAdd}
        icon={<Plus />}
        colorTheme="emerald"
      />

      <AdminTableContainer 
        searchPlaceholder="Search plans by name or code..."
        searchValue={search}
        onSearchChange={setSearch}
        colorTheme="emerald"
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px] font-semibold text-slate-600">Order</TableHead>
              <TableHead className="font-semibold text-slate-600">Name</TableHead>
              <TableHead className="font-semibold text-slate-600">Type & Billing</TableHead>
              <TableHead className="font-semibold text-slate-600">Price</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No subscription plans found.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan: SubscriptionPlan) => (
                <TableRow key={plan._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="font-medium text-slate-500">
                    {plan.order}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2">
                        {plan.name}
                        {plan.badge && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                            {plan.badge}
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">{plan.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-slate-600 font-medium capitalize">{plan.planType}</span>
                      <span className="text-xs text-slate-400">
                        {plan.billingCycleDays} days cycle
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-bold">₹{plan.price}</span>
                      {plan.compareAtPrice && (
                        <span className="text-xs text-slate-400 line-through">₹{plan.compareAtPrice}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={plan.isActive 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200" 
                        : "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200"}
                      variant="outline"
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenView(plan)} className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(plan)} className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(plan._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminTableContainer>

      <PlanDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isPending={saveMutation.isPending}
        editingPlan={editingPlan}
        isViewOnly={isViewOnly}
      />
    </div>
  );
}
