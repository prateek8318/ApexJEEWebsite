"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/admin/questions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { Question, Subject, Chapter } from "@/types/admin-api";

type AddTestQuestionsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSelected: (selectedIds: string[]) => void;
  isPending: boolean;
  existingQuestionIds: string[];
};

export default function AddTestQuestionsDialog({
  isOpen,
  onOpenChange,
  onAddSelected,
  isPending,
  existingQuestionIds,
}: AddTestQuestionsDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["admin-questions-for-test", search],
    queryFn: () => questionsApi.getAllQuestions({ search }),
    enabled: isOpen,
  });

  const questions = data?.data || [];
  
  // Filter out questions that are already in the test
  const availableQuestions = questions.filter(
    (q) => !existingQuestionIds.includes(q._id)
  );

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === availableQuestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(availableQuestions.map((q) => q._id)));
    }
  };

  const handleAdd = () => {
    onAddSelected(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setSelectedIds(new Set());
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Questions to Test</DialogTitle>
          <DialogDescription>
            Search and select questions from the question bank to add to this test.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <Input
            placeholder="Search by question text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button size="icon" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={availableQuestions.length > 0 && selectedIds.size === availableQuestions.length}
                    onCheckedChange={toggleSelectAll}
                    disabled={availableQuestions.length === 0}
                  />
                </TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading questions...
                  </TableCell>
                </TableRow>
              ) : availableQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No available questions found.
                  </TableCell>
                </TableRow>
              ) : (
                availableQuestions.map((question: Question) => (
                  <TableRow key={question._id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedIds.has(question._id)}
                        onCheckedChange={() => toggleSelection(question._id)}
                      />
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate" title={question.questionText}>
                      <div dangerouslySetInnerHTML={{ __html: question.questionText }} />
                    </TableCell>
                    <TableCell>
                      {typeof question.subject === "object" ? (question.subject as Subject).name : question.subject}
                    </TableCell>
                    <TableCell>
                      {typeof question.chapter === "object" ? (question.chapter as Chapter).title : question.chapter}
                    </TableCell>
                    <TableCell>{question.marks}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            {selectedIds.size} question(s) selected
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAdd} 
              disabled={selectedIds.size === 0 || isPending}
            >
              {isPending ? "Adding..." : "Add Selected"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
