"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { approvalApi } from "@/lib/api/admin/approvals";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { Admin } from "@/types/admin-api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";
import RejectDialog from "@/components/admin/reject-dialog";

export default function AdminApprovalsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-approvals", search, statusFilter],
    queryFn: () => approvalApi.getPendingAdmins({ 
      search, 
      ...(statusFilter !== "all" && { approvalStatus: statusFilter })
    }),
  });

  const admins = data?.data?.data || [];

  const approveMutation = useMutation({
    mutationFn: (id: string) => approvalApi.approveAdmin(id),
    onSuccess: () => {
      toast.success("Admin approved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-approvals"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to approve admin");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      approvalApi.rejectAdmin(id, reason),
    onSuccess: () => {
      toast.success("Admin rejected successfully");
      setRejectDialogOpen(false);
      setSelectedAdmin(null);
      queryClient.invalidateQueries({ queryKey: ["admin-approvals"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reject admin");
    },
  });

  const handleApprove = (admin: Admin) => {
    if (confirm(`Are you sure you want to approve ${admin.name} as an Admin?`)) {
      approveMutation.mutate(admin._id);
    }
  };

  const handleOpenReject = (admin: Admin) => {
    setSelectedAdmin(admin);
    setRejectDialogOpen(true);
  };

  const handleReject = (reason: string) => {
    if (selectedAdmin) {
      rejectMutation.mutate({ id: selectedAdmin._id, reason });
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-rose-100 text-rose-700 border-rose-200" variant="outline">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200" variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Admin Approvals"
        description="Review and manage new administrator signups and access requests."
        icon={<ShieldCheck />}
        colorTheme="violet"
      />

      <AdminTableContainer 
        searchPlaceholder="Search admins by name, email, or mobile..."
        searchValue={search}
        onSearchChange={setSearch}
        colorTheme="violet"
        actionRight={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-11 bg-white border-slate-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-600">Admin Details</TableHead>
              <TableHead className="font-semibold text-slate-600">Contact</TableHead>
              <TableHead className="font-semibold text-slate-600">Signup Date</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  No {statusFilter !== 'all' ? statusFilter : ''} admin requests found.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin: Admin) => (
                <TableRow key={admin._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="font-semibold text-slate-800">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2">
                        {admin.name}
                      </span>
                      {admin.rejectionReason && (
                        <span className="text-xs text-rose-500 font-normal truncate max-w-[200px]" title={admin.rejectionReason}>
                          Reason: {admin.rejectionReason}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-slate-800 text-sm">{admin.email}</span>
                      <span className="text-xs text-slate-400">{admin.mobile}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-600 text-sm">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(admin.approvalStatus)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      {admin.approvalStatus === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleApprove(admin)} 
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleOpenReject(admin)} 
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                            disabled={rejectMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      {admin.approvalStatus === 'rejected' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleApprove(admin)} 
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Approve Instead
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminTableContainer>

      <RejectDialog 
        isOpen={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onSubmit={handleReject}
        isPending={rejectMutation.isPending}
        adminName={selectedAdmin?.name || ""}
      />
    </div>
  );
}
