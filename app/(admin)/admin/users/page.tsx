"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userApi } from "@/lib/api/admin/users";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, RefreshCw } from "lucide-react";
import { User } from "@/types/admin-api";
import { toast } from "sonner";
import UserDialog, { UserFormValues } from "@/components/admin/user-dialog";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [examTargetFilter, setExamTargetFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, statusFilter, examTargetFilter, page, limit],
    queryFn: () => userApi.getAllUsers({ 
      search, 
      page,
      limit,
      ...(statusFilter !== "all" && { status: statusFilter }),
      ...(examTargetFilter !== "all" && { examTarget: examTargetFilter })
    }),
  });

  const users = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      setDeleteUserId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to delete user");
      setDeleteUserId(null);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => userApi.restoreUser(id),
    onSuccess: () => {
      toast.success("User restored successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to restore user");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: any }) => {
      if (id) {
        return userApi.updateUser(id, data);
      } else {
        return userApi.createUser(data);
      }
    },
    onSuccess: () => {
      toast.success(editingUser ? "User updated successfully" : "User created successfully");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const handleDelete = (id: string) => {
    setDeleteUserId(id);
  };

  const confirmDelete = () => {
    if (deleteUserId) {
      deleteMutation.mutate(deleteUserId);
    }
  };

  const handleRestore = (id: string) => {
    if (confirm("Are you sure you want to restore this user?")) {
      restoreMutation.mutate(id);
    }
  };

  const handleOpenView = (user: User) => {
    setEditingUser(user);
    setIsViewOnly(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsViewOnly(false);
    setDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsViewOnly(false);
    setDialogOpen(true);
  };

  const handleSave = (values: UserFormValues) => {
    saveMutation.mutate({ 
      id: editingUser?._id, 
      data: values 
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="User Master"
        description="Manage students, their profiles, targets, and platform access."
        buttonText="Add New User"
        onAdd={handleOpenAdd}
        icon={<Plus />}
        colorTheme="indigo"
      />

      <AdminTableContainer 
        searchPlaceholder="Search users by name, email, or phone..."
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        colorTheme="indigo"
        actionRight={
          <>
            <Select value={examTargetFilter} onValueChange={(val) => { setExamTargetFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[160px] h-11 bg-white border-slate-200">
                <SelectValue placeholder="All Targets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Targets</SelectItem>
                <SelectItem value="jee_main">JEE Main</SelectItem>
                <SelectItem value="jee_advanced">JEE Advanced</SelectItem>
                <SelectItem value="neet">NEET</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[140px] h-11 bg-white border-slate-200">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] font-semibold text-slate-600 text-center">S.No.</TableHead>
              <TableHead className="font-semibold text-slate-600">Student Info</TableHead>
              <TableHead className="font-semibold text-slate-600">Exam Target</TableHead>
              <TableHead className="font-semibold text-slate-600">Contact</TableHead>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: User, index: number) => (
                <TableRow key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="text-center font-medium text-slate-500">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2">
                        {user.name}
                        {user.isDeleted && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                            Deleted
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-slate-600 font-medium uppercase text-xs">
                        {user.examTarget?.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-400">
                        Target Year: {user.targetYear || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-slate-800 text-sm">{user.email}</span>
                      <span className="text-xs text-slate-400">{user.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={user.status === "online" 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200" 
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"}
                      variant="outline"
                    >
                      {user.status === "online" ? "Online" : "Offline"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenView(user)} className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(user)} className="text-slate-500 hover:text-amber-600 hover:bg-amber-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.isDeleted ? (
                        <Button variant="ghost" size="icon" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => handleRestore(user._id)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(user._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-6 border-t border-slate-100 pt-4 pb-2 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="text-xs border border-slate-200 rounded px-2 py-1 outline-none bg-white text-slate-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <span className="text-xs text-slate-500">
            Showing {users.length} of {data?.totalResult || 0} users
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50 disabled:opacity-50 font-medium text-slate-600"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-slate-700">
              Page {page} of {data?.totalPage || 1}
            </span>
            <button 
              disabled={page === (data?.totalPage || 1)}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50 disabled:opacity-50 font-medium text-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      </AdminTableContainer>

      <UserDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isPending={saveMutation.isPending}
        editingUser={editingUser}
        isViewOnly={isViewOnly}
      />

      <AlertDialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the user account. They will no longer be able to log in or access their courses. You can restore them later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); confirmDelete(); }} 
              disabled={deleteMutation.isPending}
              className="bg-rose-500 hover:bg-rose-600 focus:ring-rose-500"
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, delete user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
