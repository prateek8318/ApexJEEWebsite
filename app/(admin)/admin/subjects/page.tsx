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
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Subject } from "@/types/admin-api";
import { toast } from "sonner";
import SubjectDialog, { SubjectFormValues } from "@/components/admin/subject-dialog";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">
            Manage all the subjects available on the platform.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Subject
        </Button>
      </div>

      <div className="flex items-center w-full max-w-sm space-x-2">
        <Input 
          placeholder="Search subjects..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button size="icon" variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No subjects found.
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((subject: Subject) => (
                <TableRow key={subject._id}>
                  <TableCell>
                    {subject.icon ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                        <img 
                          src={subject.icon.startsWith('http') ? subject.icon : `${process.env.NEXT_PUBLIC_URL || ''}${subject.icon}`} 
                          alt={subject.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">N/A</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {subject.name}
                      {subject.colorTheme && (
                        <div 
                          className="w-3 h-3 rounded-full border border-border" 
                          style={{ backgroundColor: subject.colorTheme }}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>
                    <Badge variant={subject.isActive ? "default" : "secondary"}>
                      {subject.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{subject.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(subject)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(subject._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
