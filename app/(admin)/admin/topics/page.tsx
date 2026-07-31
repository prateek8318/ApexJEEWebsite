"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { topicsApi } from "@/lib/api/admin/topics";
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
import { Topic, Chapter, Subject } from "@/types/admin-api";
import { toast } from "sonner";
import TopicDialog, { TopicFormValues } from "@/components/admin/topic-dialog";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";

export default function AdminTopicsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-topics", search],
    queryFn: () => topicsApi.getAllTopics({ search }),
  });

  const topics = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => topicsApi.deleteTopic(id),
    onSuccess: () => {
      toast.success("Topic deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
    },
    onError: () => {
      toast.error("Failed to delete topic");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: TopicFormValues }) => {
      if (id) {
        return topicsApi.updateTopic(id, data);
      } else {
        return topicsApi.createTopic(data);
      }
    },
    onSuccess: () => {
      toast.success(editingTopic ? "Topic updated successfully" : "Topic created successfully");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this topic?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingTopic(null);
    setDialogOpen(true);
  };

  const handleSave = (values: TopicFormValues) => {
    saveMutation.mutate({ 
      id: editingTopic?._id, 
      data: values
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Topics"
        description="Manage all the topics within chapters."
        buttonText="Add New Topic"
        onAdd={handleOpenAdd}
        icon={<Plus />}
        colorTheme="amber"
      />

      <AdminTableContainer 
        searchPlaceholder="Search topics by title..."
        searchValue={search}
        onSearchChange={setSearch}
        colorTheme="amber"
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-600">Topic Title</TableHead>
              <TableHead className="font-semibold text-slate-600">Subject</TableHead>
              <TableHead className="font-semibold text-slate-600">Chapter</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="font-semibold text-slate-600">Order</TableHead>
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
            ) : topics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No topics found.
                </TableCell>
              </TableRow>
            ) : (
              topics.map((topic: Topic) => (
                <TableRow key={topic._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="font-semibold text-slate-800">{topic.title}</TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {typeof topic.subject === "object" ? (topic.subject as Subject).name : topic.subject}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {typeof topic.chapter === "object" ? `Ch ${(topic.chapter as Chapter).chapterNumber}: ${(topic.chapter as Chapter).title}` : topic.chapter}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={topic.isActive 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200" 
                        : "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200"}
                      variant="outline"
                    >
                      {topic.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium">{topic.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(topic)} className="text-slate-500 hover:text-amber-600 hover:bg-amber-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(topic._id)}>
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

      <TopicDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isPending={saveMutation.isPending}
        editingTopic={editingTopic}
      />
    </div>
  );
}
