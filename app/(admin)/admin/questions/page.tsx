"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/admin/questions";
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
import { Question, Topic, Chapter, Subject } from "@/types/admin-api";
import { toast } from "sonner";
import QuestionDialog, { QuestionFormValues } from "@/components/admin/question-dialog";
import BulkUploadDialog from "@/components/admin/bulk-upload-dialog";
import { Badge } from "@/components/ui/badge";
import { FileUp } from "lucide-react";

export default function AdminQuestionsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-questions", search],
    queryFn: () => questionsApi.getAllQuestions(search),
  });

  const questions = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => questionsApi.deleteQuestion(id),
    onSuccess: () => {
      toast.success("Question deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, formData }: { id?: string; formData: FormData }) => {
      if (id) {
        return questionsApi.updateQuestion(id, formData);
      } else {
        return questionsApi.createQuestion(formData);
      }
    },
    onSuccess: () => {
      toast.success(editingQuestion ? "Question updated successfully" : "Question created successfully");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const bulkUploadMutation = useMutation({
    mutationFn: (formData: FormData) => questionsApi.uploadQuestionsToCDN(formData),
    onSuccess: () => {
      toast.success("Questions bulk uploaded successfully");
      setBulkUploadOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload questions");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenEdit = (question: Question) => {
    setEditingQuestion(question);
    setDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setDialogOpen(true);
  };

  const handleSave = (values: QuestionFormValues, file: File | null, explanationFiles: FileList | null) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'options' || key === 'answer') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'sourceType' || key === 'sourceExam' || key === 'sourceYear' || key === 'sourceShift' || key === 'sourceInstitute') {
        formData.append(`source[${key.replace('source', '').toLowerCase()}]`, String(value));
      } else if (key !== 'questionImage' && key !== 'explanationImage') {
        formData.append(key, String(value));
      }
    });

    if (file) {
      formData.append("questionImage", file);
    }
    
    if (explanationFiles) {
      for (let i = 0; i < explanationFiles.length; i++) {
        formData.append("explanationImage", explanationFiles[i]);
      }
    }

    saveMutation.mutate({ 
      id: editingQuestion?._id, 
      formData
    });
  };

  const handleBulkUpload = (values: { subject: string; chapter: string; topic: string }, file: File) => {
    const formData = new FormData();
    formData.append("subject", values.subject);
    formData.append("chapter", values.chapter);
    formData.append("topic", values.topic);
    formData.append("wordFile", file);
    
    bulkUploadMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Questions Bank</h1>
          <p className="text-muted-foreground">
            Manage practice questions and mock test materials.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkUploadOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" /> Bulk Upload
          </Button>
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>
      </div>

      <div className="flex items-center w-full max-w-sm space-x-2">
        <Input 
          placeholder="Search questions..." 
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
              <TableHead className="w-[300px]">Question Snippet</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
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
            ) : questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question: Question) => (
                <TableRow key={question._id}>
                  <TableCell className="font-medium">
                    <div className="truncate max-w-[280px]" title={question.questionText}>
                      {question.questionText}
                    </div>
                  </TableCell>
                  <TableCell>
                    {typeof question.subject === "object" ? (question.subject as Subject).name : question.subject}
                  </TableCell>
                  <TableCell>
                    {typeof question.chapter === "object" ? (question.chapter as Chapter).title : question.chapter}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase text-xs">
                      {question.questionType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={question.difficulty === "hard" ? "destructive" : question.difficulty === "medium" ? "default" : "secondary"}>
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(question)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(question._id)}>
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

      <QuestionDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isPending={saveMutation.isPending}
        editingQuestion={editingQuestion}
      />

      <BulkUploadDialog
        isOpen={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        onSubmit={handleBulkUpload}
        isPending={bulkUploadMutation.isPending}
      />
    </div>
  );
}
