"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testsApi } from "@/lib/api/admin/tests";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, ClipboardList, ListOrdered } from "lucide-react";
import { Test } from "@/types/admin-api";
import { toast } from "sonner";
import TestDialog, { TestFormValues } from "@/components/admin/test-dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminTableContainer } from "@/components/admin/ui/admin-table-container";

export default function AdminPracticeTestsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-practice-tests", search, categoryFilter, page, limit],
    queryFn: () => testsApi.getAllTests({ 
      search, 
      mode: "practice", 
      page,
      limit,
      ...(categoryFilter !== "all" && { testCategory: categoryFilter }),
      ...(topicFilter !== "all" && { topic: topicFilter })
    }),
  });

  const { data: topicsData, isLoading: isLoadingTopics } = useQuery({
    queryKey: ["admin-topics-all"],
    queryFn: () => topicsApi.getAllTopics({ limit: 1000 }),
  });
  const topicsList = topicsData?.data || [];

  const getTopicName = (topicId: any) => {
    if (!topicId) return "-";
    if (typeof topicId === "object" && topicId.title) return topicId.title;
    const t = topicsList.find((t: any) => t._id === topicId);
    return t ? t.title : "-";
  };

  const tests = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testsApi.deleteTest(id),
    onSuccess: () => {
      toast.success("Test deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-practice-tests"] });
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
      queryClient.invalidateQueries({ queryKey: ["admin-practice-tests"] });
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
      data: { ...values, mode: "practice" }
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Practice Tests"
        description="Manage practice exams and questions."
        buttonText="Create Practice Test"
        onAdd={handleOpenAdd}
        icon={<Plus />}
        colorTheme="blue"
      />

      <AdminTableContainer 
        searchPlaceholder="Search practice tests..."
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        colorTheme="blue"
        actionRight={
          <>
            <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setPage(1); }}>
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
            <Select value={topicFilter} onValueChange={(val) => { setTopicFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[160px] h-11 bg-white border-slate-200">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {!isLoadingTopics && topicsList.map((t: any) => (
                  <SelectItem key={t._id} value={t._id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      >
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] font-semibold text-slate-600 text-center">S.No.</TableHead>
              <TableHead className="font-semibold text-slate-600">Test Title</TableHead>
              <TableHead className="font-semibold text-slate-600">Category</TableHead>
              <TableHead className="font-semibold text-slate-600">Topic</TableHead>
              <TableHead className="font-semibold text-slate-600">Duration</TableHead>
              <TableHead className="font-semibold text-slate-600">Questions</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : tests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No tests found.
                </TableCell>
              </TableRow>
            ) : (
              tests.map((test: Test, index: number) => (
                <TableRow key={test._id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="text-center font-medium text-slate-500">
                    {index + 1}
                  </TableCell>
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
                  <TableCell className="text-slate-600 font-medium">
                    {getTopicName(test.topic)}
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
        <div className="flex items-center justify-between mt-6 border-t border-slate-100 pt-4 pb-2 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="text-xs border border-slate-200 rounded px-2 py-1 outline-none bg-white text-slate-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <span className="text-xs text-slate-500">
            Showing {tests.length} of {data?.totalResult || 0} tests
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50 disabled:opacity-50 font-medium text-slate-600"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-slate-700">
              Page {page} of {data?.totalPage || 1}
            </span>
            <button 
              disabled={page === (data?.totalPage || 1)}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50 disabled:opacity-50 font-medium text-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      </AdminTableContainer>

      <TestDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isPending={saveMutation.isPending}
        editingTest={editingTest}
        defaultMode="practice"
      />
    </div>
  );
}
