"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chaptersApi } from "@/lib/api/admin/chapters";
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
import { Chapter, Subject } from "@/types/admin-api";
import { toast } from "sonner";
import ChapterDialog, { ChapterFormValues } from "@/components/admin/chapter-dialog";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";

export default function AdminChaptersPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-chapters", search],
    queryFn: () => chaptersApi.getAllChapters({ search }),
  });

  const chapters = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => chaptersApi.deleteChapter(id),
    onSuccess: () => {
      toast.success("Chapter deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-chapters"] });
    },
    onError: () => {
      toast.error("Failed to delete chapter");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: Partial<Chapter> }) => {
      if (id) {
        return chaptersApi.updateChapter(id, data);
      } else {
        return chaptersApi.createChapter(data);
      }
    },
    onSuccess: () => {
      toast.success(editingChapter ? "Chapter updated successfully" : "Chapter created successfully");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-chapters"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this chapter?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingChapter(null);
    setDialogOpen(true);
  };

  const handleSave = (values: ChapterFormValues) => {
    const formattedValues = {
      ...values,
      tags: typeof values.tags === "string" && values.tags.trim() !== "" 
        ? values.tags.split(",").map(t => t.trim()).filter(Boolean) 
        : []
    };
    saveMutation.mutate({ 
      id: editingChapter?._id, 
      data: formattedValues as any
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Chapters"
        description="Manage all the chapters across different subjects."
        buttonText="Add New Chapter"
        onAdd={handleOpenAdd}
        icon={<Plus />}
        colorTheme="emerald"
      />

      <AdminTableContainer 
        searchPlaceholder="Search chapters by title or unit..."
        searchValue={search}
        onSearchChange={setSearch}
        colorTheme="emerald"
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px] font-semibold text-slate-600">Ch. No.</TableHead>
              <TableHead className="font-semibold text-slate-600">Subject</TableHead>
              <TableHead className="font-semibold text-slate-600">Unit Name</TableHead>
              <TableHead className="font-semibold text-slate-600">Chapter Title</TableHead>
              <TableHead className="font-semibold text-slate-600">Difficulty</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
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
            ) : chapters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No chapters found.
                </TableCell>
              </TableRow>
            ) : (
              chapters.map((chapter: Chapter) => (
                <TableRow key={chapter._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="font-semibold text-slate-700 bg-slate-50/50 w-16 text-center border-r border-slate-100">
                    {chapter.chapterNumber.toString().padStart(2, '0')}
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">
                    {typeof chapter.subject === "object" ? (chapter.subject as Subject).name : chapter.subject}
                  </TableCell>
                  <TableCell className="text-slate-600">{chapter.unitName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{chapter.title}</span>
                      {chapter.subtitle && <span className="text-xs text-slate-500">{chapter.subtitle}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent">
                      {chapter.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={chapter.isActive 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200" 
                        : "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200"}
                      variant="outline"
                    >
                      {chapter.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(chapter)} className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(chapter._id)}>
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

      <ChapterDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isPending={saveMutation.isPending}
        editingChapter={editingChapter}
      />
    </div>
  );
}
