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
import { Plus, Edit, Trash2, FileUp } from "lucide-react";
import { Question, Chapter, Subject } from "@/types/admin-api";
import { toast } from "sonner";
import QuestionDialog, { QuestionFormValues } from "@/components/admin/question-dialog";
import BulkUploadDialog from "@/components/admin/bulk-upload-dialog";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";

export default function AdminQuestionsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-questions", search],
    queryFn: () => questionsApi.getAllQuestions({ search }),
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

  const extraButtons = (
    <Button variant="outline" onClick={() => setBulkUploadOpen(true)} className="border-slate-300 text-slate-700 hover:bg-slate-100 h-10 px-4">
      <FileUp className="mr-2 h-4 w-4" /> Bulk Upload
    </Button>
  );

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Questions Bank"
        description="Manage practice questions and mock test materials."
        buttonText="Add Question"
        onAdd={handleOpenAdd}
        icon={<Plus />}
        colorTheme="violet"
        extraButtons={extraButtons}
      />

      <AdminTableContainer 
        searchPlaceholder="Search questions by text..."
        searchValue={search}
        onSearchChange={setSearch}
        colorTheme="violet"
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[350px] font-semibold text-slate-600">Question Snippet</TableHead>
              <TableHead className="font-semibold text-slate-600">Subject</TableHead>
              <TableHead className="font-semibold text-slate-600">Chapter</TableHead>
              <TableHead className="font-semibold text-slate-600">Type</TableHead>
              <TableHead className="font-semibold text-slate-600">Difficulty</TableHead>
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
            ) : questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question: Question) => (
                <TableRow key={question._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="font-medium text-slate-800">
                    <div className="truncate max-w-[320px]" title={question.questionText}>
                      {question.questionText}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {typeof question.subject === "object" ? (question.subject as Subject).name : question.subject}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {typeof question.chapter === "object" ? (question.chapter as Chapter).title : question.chapter}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="uppercase text-[10px] tracking-wider bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200">
                      {question.questionType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        question.difficulty === "hard" 
                          ? "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200" 
                          : question.difficulty === "medium" 
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200" 
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
                      }
                      variant="outline"
                    >
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(question)} className="text-slate-500 hover:text-violet-600 hover:bg-violet-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(question._id)}>
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
