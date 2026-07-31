"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testsApi } from "@/lib/api/admin/tests";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

interface UploadWordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  testId: string;
}

export default function UploadWordDialog({
  isOpen,
  onOpenChange,
  testId,
}: UploadWordDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (selectedFile: File) => {
      const formData = new FormData();
      formData.append("wordFile", selectedFile);
      formData.append("testId", testId);
      
      return testsApi.uploadWordQuestions(formData);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Questions uploaded successfully!");
      setFile(null);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["admin-test", testId] });
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to upload Word document"
      );
    },
  });

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a Word document first.");
      return;
    }
    uploadMutation.mutate(file);
  };

  const handleOpenChange = (open: boolean) => {
    if (!uploadMutation.isPending) {
      if (!open) setFile(null); // Reset file when closing
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Questions</DialogTitle>
          <DialogDescription>
            Upload a .docx file containing your test questions. The document will
            be parsed and the questions will be added to this test automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-600">
              Need the correct formatting?
            </div>
            <Button variant="outline" size="sm" asChild className="h-8 text-xs font-medium border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
              <a href="/templates/Bulk_Upload_Template.docx" download>
                Download Template
              </a>
            </Button>
          </div>
          <FileInput
            accept={{
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            }}
            maxFiles={1}
            maxSize={10 * 1024 * 1024} // 10MB max
            value={file ? [file] : []}
            onChange={(files) => setFile(files.length > 0 ? files[0] : null)}
            disabled={uploadMutation.isPending}
            className="h-40"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={uploadMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploadMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {uploadMutation.isPending ? (
              "Uploading & Parsing..."
            ) : (
              <>
                <UploadCloud className="w-4 h-4 mr-2" />
                Upload Questions
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
