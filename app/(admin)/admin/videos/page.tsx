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
import { Plus, Edit, Trash2, Youtube } from "lucide-react";
import { Video, Chapter, Subject, VideoCategory } from "@/types/admin-api";
import { toast } from "sonner";
import VideoDialog, { VideoFormValues } from "@/components/admin/video-dialog";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";

export default function AdminVideosPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-videos", search],
    queryFn: () => videosApi.getAllVideos({ search }),
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
      if ((key === 'topic' || key === 'videoCategory') && value === 'none') {
        // Do not append topic if 'none'
      } else if (key !== 'thumbnailUrl' && key !== 'noteUrl') {
        formData.append(key, String(value));
      }
    });

    if (file) {
      formData.append("noteUrl", file);
    }

    saveMutation.mutate({ 
      id: editingVideo?._id, 
      formData
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Videos"
        description="Manage video lectures and YouTube links."
        buttonText="Add Video"
        onAdd={handleOpenAdd}
        icon={<Plus />}
        colorTheme="rose"
      />

      <AdminTableContainer 
        searchPlaceholder="Search videos by title..."
        searchValue={search}
        onSearchChange={setSearch}
        colorTheme="rose"
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-600">Video Title</TableHead>
              <TableHead className="font-semibold text-slate-600">Subject</TableHead>
              <TableHead className="font-semibold text-slate-600">Chapter</TableHead>
              <TableHead className="font-semibold text-slate-600">Category</TableHead>
              <TableHead className="font-semibold text-slate-600">Duration</TableHead>
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
            ) : videos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No videos found.
                </TableCell>
              </TableRow>
            ) : (
              videos.map((video: Video) => (
                <TableRow key={video._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="bg-rose-100 p-2 rounded-lg">
                        <Youtube className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{video.title}</span>
                        <a href={video.youtubeUrl} target="_blank" rel="noreferrer" className="text-xs text-rose-600 hover:underline">
                          Watch on YouTube
                        </a>
                        {video.noteUrl && (
                          <a href={video.noteUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                            View Notes
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {typeof video.subject === "object" ? (video.subject as Subject).name : video.subject}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {typeof video.chapter === "object" ? (video.chapter as Chapter).title : video.chapter}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {video.videoCategory
                      ? typeof video.videoCategory === "object"
                        ? (video.videoCategory as VideoCategory).title
                        : video.videoCategory
                      : "-"}
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium">{video.durationMinutes} mins</TableCell>
                  <TableCell>
                    <Badge 
                      className={video.isActive 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200" 
                        : "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200"}
                      variant="outline"
                    >
                      {video.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(video)} className="text-slate-500 hover:text-rose-600 hover:bg-rose-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(video._id)}>
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
