"use client";

import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, ClipboardList, ListOrdered } from "lucide-react";
import { Test } from "@/types/admin-api";
import { toast } from "sonner";
import TestDialog, { TestFormValues } from "@/components/admin/test-dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";

export default function AdminTestsPage() {
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tests", search, modeFilter, categoryFilter],
    queryFn: () => testsApi.getAllTests({ 
      search, 
      ...(modeFilter !== "all" && { mode: modeFilter }), 
      ...(categoryFilter !== "all" && { testCategory: categoryFilter }) 
    }),
  });

  const tests = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testsApi.deleteTest(id),
    onSuccess: () => {
      toast.success("Test deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
    },
    onError: () => {
      toast.error("Failed to delete test");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: Partial<Test> }) => {
      if (id) {
        return testsApi.updateTest(id, data);
      } else {
        return testsApi.createTest(data);
      }
    },
    onSuccess: () => {
      toast.success(editingTest ? "Test updated successfully" : "Test created successfully");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this test?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenEdit = (test: Test) => {
    setEditingTest(test);
    setDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingTest(null);
    setDialogOpen(true);
  };

  const handleSave = (values: TestFormValues) => {
    saveMutation.mutate({ 
      id: editingTest?._id, 
      data: values
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Tests"
        description="Manage mock tests and practice exams."
        buttonText="Create Test"
        onAdd={handleOpenAdd}
        icon={<Plus />}
        colorTheme="blue"
      />

      <AdminTableContainer 
        searchPlaceholder="Search tests..."
        searchValue={search}
        onSearchChange={setSearch}
        colorTheme="blue"
        actionRight={
          <>
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-[140px] h-11 bg-white border-slate-200">
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="mock">Mock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] h-11 bg-white border-slate-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="full">Full Syllabus</SelectItem>
                <SelectItem value="subject">Subject</SelectItem>
                <SelectItem value="chapter">Chapter</SelectItem>
                <SelectItem value="topic">Topic</SelectItem>
                <SelectItem value="pyq">PYQ</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-600">Test Title</TableHead>
              <TableHead className="font-semibold text-slate-600">Category</TableHead>
              <TableHead className="font-semibold text-slate-600">Duration</TableHead>
              <TableHead className="font-semibold text-slate-600">Questions</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
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
            ) : tests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No tests found.
                </TableCell>
              </TableRow>
            ) : (
              tests.map((test: Test) => (
                <TableRow key={test._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <ClipboardList className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{test.title}</span>
                          {test.mode && (
                            <Badge variant="secondary" className="capitalize text-[10px] h-5 px-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                              {test.mode}
                            </Badge>
                          )}
                        </div>
                        {test.examTag && (
                          <span className="text-xs text-slate-500 mt-0.5">
                            {test.examTag} {test.isLive && "(Live)"}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-slate-600 font-medium">
                    {test.testCategory || "-"}
                  </TableCell>
                  <TableCell className="text-slate-500">{test.durationMins} mins</TableCell>
                  <TableCell className="text-slate-500">
                    <span className="font-semibold text-slate-700">{test.totalQuestions || 0}</span> ({test.totalMarks || 0} marks)
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={test.isActive 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200" 
                        : "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200"}
                      variant="outline"
                    >
                      {test.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/tests/${test._id}`}>
                        <Button variant="ghost" size="icon" title="Manage Questions" className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(test)} className="text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(test._id)}>
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

      <TestDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isPending={saveMutation.isPending}
        editingTest={editingTest}
      />
    </div>
  );
}
