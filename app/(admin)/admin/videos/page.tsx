"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { videosApi } from "@/lib/api/admin/videos";
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
import { Plus, Search, Edit, Trash2, Youtube } from "lucide-react";
import { Video, Chapter, Subject } from "@/types/admin-api";
import { toast } from "sonner";
import VideoDialog, { VideoFormValues } from "@/components/admin/video-dialog";
import { Badge } from "@/components/ui/badge";

export default function AdminVideosPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-videos", search],
    queryFn: () => videosApi.getAllVideos(search),
  });

  const videos = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => videosApi.deleteVideo(id),
    onSuccess: () => {
      toast.success("Video deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: () => {
      toast.error("Failed to delete video");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, formData }: { id?: string; formData: FormData }) => {
      if (id) {
        return videosApi.updateVideo(id, formData);
      } else {
        return videosApi.createVideo(formData);
      }
    },
    onSuccess: () => {
      toast.success(editingVideo ? "Video updated successfully" : "Video created successfully");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenEdit = (video: Video) => {
    setEditingVideo(video);
    setDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingVideo(null);
    setDialogOpen(true);
  };

  const handleSave = (values: VideoFormValues, file: File | null) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'topic' && value === 'none') {
        // Do not append topic if 'none'
      } else if (key !== 'thumbnailUrl') {
        formData.append(key, String(value));
      }
    });

    if (file) {
      formData.append("thumbnail", file);
    }

    saveMutation.mutate({ 
      id: editingVideo?._id, 
      formData
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
          <p className="text-muted-foreground">
            Manage video lectures and YouTube links.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Video
        </Button>
      </div>

      <div className="flex items-center w-full max-w-sm space-x-2">
        <Input 
          placeholder="Search videos..." 
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
              <TableHead>Video Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
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
            ) : videos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No videos found.
                </TableCell>
              </TableRow>
            ) : (
              videos.map((video: Video) => (
                <TableRow key={video._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-500" />
                      <div className="flex flex-col">
                        <span>{video.title}</span>
                        <a href={video.youtubeUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                          Link
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {typeof video.subject === "object" ? (video.subject as Subject).name : video.subject}
                  </TableCell>
                  <TableCell>
                    {typeof video.chapter === "object" ? (video.chapter as Chapter).title : video.chapter}
                  </TableCell>
                  <TableCell>{video.durationMinutes} mins</TableCell>
                  <TableCell>
                    <Badge variant={video.isActive ? "default" : "secondary"}>
                      {video.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(video)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(video._id)}>
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

      <VideoDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isPending={saveMutation.isPending}
        editingVideo={editingVideo}
      />
    </div>
  );
}
