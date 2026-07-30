"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi } from "@/lib/api/admin/notes";
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
import { Plus, Search, Edit, Trash2, FileText, Lock } from "lucide-react";
import { Note, Chapter, Subject } from "@/types/admin-api";
import { toast } from "sonner";
import NoteDialog, { NoteFormValues } from "@/components/admin/note-dialog";
import { Badge } from "@/components/ui/badge";

export default function AdminNotesPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-notes", search],
    queryFn: () => notesApi.getAllNotes(search),
  });

  const notes = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notesApi.deleteNote(id),
    onSuccess: () => {
      toast.success("Note deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-notes"] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, formData }: { id?: string; formData: FormData }) => {
      if (id) {
        return notesApi.updateNote(id, formData);
      } else {
        return notesApi.createNote(formData);
      }
    },
    onSuccess: () => {
      toast.success(editingNote ? "Note updated successfully" : "Note created successfully");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-notes"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingNote(null);
    setDialogOpen(true);
  };

  const handleSave = (values: NoteFormValues, file: File | null) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'topic' && value === 'none') {
        // Do not append topic if 'none'
      } else if (key === 'tags') {
        formData.append(key, JSON.stringify(value));
      } else if (key !== 'fileUrl') {
        formData.append(key, String(value));
      }
    });

    if (file) {
      formData.append("fileUrl", file); // Must match backend multer field name
    }

    saveMutation.mutate({ 
      id: editingNote?._id, 
      formData
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Materials & Notes</h1>
          <p className="text-muted-foreground">
            Manage PDF notes, formula sheets, and solved examples.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      <div className="flex items-center w-full max-w-sm space-x-2">
        <Input 
          placeholder="Search notes..." 
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
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Access</TableHead>
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
            ) : notes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No notes found.
                </TableCell>
              </TableRow>
            ) : (
              notes.map((note: Note) => (
                <TableRow key={note._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>{note.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {note.type?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {typeof note.subject === "object" ? (note.subject as Subject).name : note.subject}
                  </TableCell>
                  <TableCell>
                    {typeof note.chapter === "object" ? (note.chapter as Chapter).title : note.chapter}
                  </TableCell>
                  <TableCell>
                    {note.isPremium ? (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                        <Lock className="w-3 h-3 mr-1" /> Premium
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        Free
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(note)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(note._id)}>
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

      <NoteDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isPending={saveMutation.isPending}
        editingNote={editingNote}
      />
    </div>
  );
}
