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
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Topic, Chapter, Subject } from "@/types/admin-api";
import { toast } from "sonner";
import TopicDialog, { TopicFormValues } from "@/components/admin/topic-dialog";
import { Badge } from "@/components/ui/badge";

export default function AdminTopicsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-topics", search],
    queryFn: () => topicsApi.getAllTopics(search),
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
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
          <p className="text-muted-foreground">
            Manage all the topics within chapters.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Topic
        </Button>
      </div>

      <div className="flex items-center w-full max-w-sm space-x-2">
        <Input 
          placeholder="Search topics..." 
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
              <TableHead>Topic Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Chapter</TableHead>
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
            ) : topics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No topics found.
                </TableCell>
              </TableRow>
            ) : (
              topics.map((topic: Topic) => (
                <TableRow key={topic._id}>
                  <TableCell className="font-medium">{topic.title}</TableCell>
                  <TableCell>
                    {typeof topic.subject === "object" ? (topic.subject as Subject).name : topic.subject}
                  </TableCell>
                  <TableCell>
                    {typeof topic.chapter === "object" ? `Ch ${(topic.chapter as Chapter).chapterNumber}: ${(topic.chapter as Chapter).title}` : topic.chapter}
                  </TableCell>
                  <TableCell>
                    <Badge variant={topic.isActive ? "default" : "secondary"}>
                      {topic.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{topic.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(topic)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(topic._id)}>
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
