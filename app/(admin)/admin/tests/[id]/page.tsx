"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testsApi } from "@/lib/api/admin/tests";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import AddTestQuestionsDialog from "@/components/admin/add-test-questions-dialog";
import UploadWordDialog from "@/components/admin/upload-word-dialog";
import { Subject, Chapter, Topic, Question } from "@/types/admin-api";

export default function TestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const { data: testData, isLoading } = useQuery({
    queryKey: ["admin-test", testId],
    queryFn: () => testsApi.getTest(testId),
    enabled: !!testId,
  });

  const test = testData?.data;

  const removeMutation = useMutation({
    mutationFn: (questionId: string) => testsApi.removeQuestion(testId, questionId),
    onSuccess: () => {
      toast.success("Question removed from test");
      queryClient.invalidateQueries({ queryKey: ["admin-test", testId] });
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove question");
    },
  });

  const addMutation = useMutation({
    mutationFn: (selectedIds: string[]) => {
      const payload = JSON.stringify(selectedIds.map((id, index) => ({
        question: id,
        order: (test?.questions?.length || 0) + index + 1
      })));
      return testsApi.addQuestions(testId, { questions: payload });
    },
    onSuccess: () => {
      toast.success("Questions added to test");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-test", testId] });
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add questions");
    },
  });

  const handleRemove = (questionId: string) => {
    if (confirm("Are you sure you want to remove this question from the test?")) {
      removeMutation.mutate(questionId);
    }
  };

  const handleAddSelected = (selectedIds: string[]) => {
    addMutation.mutate(selectedIds);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading test details...</div>;
  }

  if (!test) {
    return <div className="p-8 text-center text-destructive">Test not found.</div>;
  }

  const existingQuestionIds = test.questions?.map(q => 
    typeof q.question === "object" ? (q.question as Question)._id : q.question
  ) || [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/tests')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{test.title}</h1>
          <p className="text-muted-foreground flex gap-4">
            <span>Duration: {test.durationMins} mins</span>
            <span>Total Questions: {test.totalQuestions || 0}</span>
            <span>Total Marks: {test.totalMarks || 0}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <h2 className="text-xl font-semibold">Test Questions</h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setUploadDialogOpen(true)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200">
            Bulk Upload Questions
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Questions
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!test.questions || test.questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No questions added to this test yet.
                </TableCell>
              </TableRow>
            ) : (
              test.questions.map((item, index) => {
                const questionObj = typeof item.question === 'object' ? item.question as Question : null;
                const subjectObj = typeof item.subject === 'object' ? item.subject as Subject : null;
                const chapterObj = typeof item.chapter === 'object' ? item.chapter as Chapter : null;
                const topicObj = typeof item.topic === 'object' ? item.topic as Topic : null;

                const qId = questionObj ? questionObj._id : item.question as string;

                return (
                  <TableRow key={qId || index}>
                    <TableCell>{item.order || index + 1}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {questionObj ? (
                        <div className="flex items-center gap-2" title={questionObj.questionText}>
                          <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                          <div dangerouslySetInnerHTML={{ __html: questionObj.questionText }} className="truncate" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">ID: {item.question as string}</span>
                      )}
                    </TableCell>
                    <TableCell>{subjectObj?.name || "-"}</TableCell>
                    <TableCell>{chapterObj?.title || "-"}</TableCell>
                    <TableCell>{topicObj?.title || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10" 
                        onClick={() => handleRemove(qId)}
                        disabled={removeMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AddTestQuestionsDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddSelected={handleAddSelected}
        isPending={addMutation.isPending}
        existingQuestionIds={existingQuestionIds}
      />

      <UploadWordDialog
        isOpen={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        testId={testId}
      />
    </div>
  );
}
