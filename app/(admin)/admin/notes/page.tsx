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
import { Plus, Edit, Trash2, FileText, Lock } from "lucide-react";
import { Note, Chapter, Subject } from "@/types/admin-api";
import { toast } from "sonner";
import NoteDialog, { NoteFormValues } from "@/components/admin/note-dialog";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";

export default function AdminNotesPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-notes", search],
    queryFn: () => notesApi.getAllNotes({ search }),
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
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Study Materials & Notes"
        description="Manage PDF notes, formula sheets, and solved examples."
        buttonText="Add Note"
        onAdd={handleOpenAdd}
        icon={<Plus />}
        colorTheme="cyan"
      />

      <AdminTableContainer 
        searchPlaceholder="Search notes by title..."
        searchValue={search}
        onSearchChange={setSearch}
        colorTheme="cyan"
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-600">Title</TableHead>
              <TableHead className="font-semibold text-slate-600">Type</TableHead>
              <TableHead className="font-semibold text-slate-600">Subject</TableHead>
              <TableHead className="font-semibold text-slate-600">Chapter</TableHead>
              <TableHead className="font-semibold text-slate-600">Access</TableHead>
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
            ) : notes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No notes found.
                </TableCell>
              </TableRow>
            ) : (
              notes.map((note: Note) => (
                <TableRow key={note._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-cyan-600" />
                      <span>{note.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200">
                      {note.type?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {typeof note.subject === "object" ? (note.subject as Subject).name : note.subject}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {typeof note.chapter === "object" ? (note.chapter as Chapter).title : note.chapter}
                  </TableCell>
                  <TableCell>
                    {note.isPremium ? (
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
                        <Lock className="w-3 h-3 mr-1" /> Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200">
                        Free
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(note)} className="text-slate-500 hover:text-cyan-600 hover:bg-cyan-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(note._id)}>
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
