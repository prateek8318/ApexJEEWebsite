"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/admin/subjects";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Subject } from "@/types/admin-api";
import { toast } from "sonner";
import SubjectDialog, { SubjectFormValues } from "@/components/admin/subject-dialog";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";

export default function AdminSubjectsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-subjects", search],
    queryFn: () => subjectsApi.getAllSubjects(search),
  });

  const subjects = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => subjectsApi.deleteSubject(id),
    onSuccess: () => {
      toast.success("Subject deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
    },
    onError: () => {
      toast.error("Failed to delete subject");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, formData }: { id?: string; formData: FormData }) => {
      if (id) {
        return subjectsApi.updateSubject(id, formData);
      } else {
        return subjectsApi.createSubject(formData);
      }
    },
    onSuccess: () => {
      toast.success(editingSubject ? "Subject updated successfully" : "Subject created successfully");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setDialogOpen(true);
  };

  const handleSave = (values: SubjectFormValues, file: File | null) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("code", values.code);
    formData.append("colorTheme", values.colorTheme || "");
    formData.append("order", String(values.order));
    formData.append("isActive", String(values.isActive));
    if (file) {
      formData.append("icon", file);
    }

    saveMutation.mutate({ 
      id: editingSubject?._id, 
      formData 
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Subjects"
        description="Manage all the subjects available on the platform. Add, edit, or remove subjects below."
        buttonText="Add New Subject"
        onAdd={handleOpenAdd}
        icon={<Plus />}
        colorTheme="indigo"
      />

      <AdminTableContainer 
        searchPlaceholder="Search subjects by name or code..."
        searchValue={search}
        onSearchChange={setSearch}
        colorTheme="indigo"
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] font-semibold text-slate-600 text-center">S.No.</TableHead>
              <TableHead className="w-[100px] font-semibold text-slate-600">Icon</TableHead>
              <TableHead className="font-semibold text-slate-600">Name</TableHead>
              <TableHead className="font-semibold text-slate-600">Code</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="font-semibold text-slate-600">Order</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No subjects found.
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((subject: Subject, index: number) => (
                <TableRow key={subject._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="text-center font-medium text-slate-500">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {subject.icon ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                        <img 
                          src={subject.icon.startsWith('http') ? subject.icon : `${process.env.NEXT_PUBLIC_URL || ''}${subject.icon}`} 
                          alt={subject.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                        <span className="text-xs text-slate-400 font-medium">N/A</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      {subject.name}
                      {subject.colorTheme && (
                        <div 
                          className="w-3 h-3 rounded-full border border-slate-200 shadow-sm" 
                          style={{ backgroundColor: subject.colorTheme }}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{subject.code}</TableCell>
                  <TableCell>
                    <Badge 
                      className={subject.isActive 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200" 
                        : "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200"}
                      variant="outline"
                    >
                      {subject.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium">{subject.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(subject)} className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(subject._id)}>
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

      <SubjectDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isPending={saveMutation.isPending}
        editingSubject={editingSubject}
      />
    </div>
  );
}
