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
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Chapter, Subject } from "@/types/admin-api";
import { toast } from "sonner";
import ChapterDialog, { ChapterFormValues } from "@/components/admin/chapter-dialog";
import { Badge } from "@/components/ui/badge";

export default function AdminChaptersPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-chapters", search],
    queryFn: () => chaptersApi.getAllChapters(search),
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
    mutationFn: async ({ id, data }: { id?: string; data: ChapterFormValues }) => {
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
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chapters</h1>
          <p className="text-muted-foreground">
            Manage all the chapters across different subjects.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Chapter
        </Button>
      </div>

      <div className="flex items-center w-full max-w-sm space-x-2">
        <Input 
          placeholder="Search chapters..." 
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
              <TableHead>Ch. No.</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Unit Name</TableHead>
              <TableHead>Chapter Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                <TableRow key={chapter._id}>
                  <TableCell className="font-medium">{chapter.chapterNumber}</TableCell>
                  <TableCell>
                    {typeof chapter.subject === "object" ? (chapter.subject as Subject).name : chapter.subject}
                  </TableCell>
                  <TableCell>{chapter.unitName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{chapter.title}</span>
                      {chapter.subtitle && <span className="text-xs text-muted-foreground">{chapter.subtitle}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {chapter.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={chapter.isActive ? "default" : "secondary"}>
                      {chapter.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(chapter)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(chapter._id)}>
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
