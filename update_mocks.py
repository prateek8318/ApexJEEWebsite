import os

FILE_PATH = "c:/Users/abhij/CascadeProjects/iit-e-learning/app/(admin)/admin/upload/components/mocks-tab.tsx"

with open(FILE_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    'import { topicsApi } from "@/lib/api/admin/topics";',
    'import { topicsApi } from "@/lib/api/admin/topics";\nimport { testsApi } from "@/lib/api/admin/tests";'
)
content = content.replace(
    'import { Question as QuestionType, Subject, Chapter } from "@/types/admin-api";',
    'import { Question as QuestionType, Subject, Chapter, Test } from "@/types/admin-api";\nimport TestDialog, { TestFormValues } from "@/components/admin/test-dialog";'
)

# 2. States
state_insert = """  const [isActive, setIsActive] = useState(true);

  // Test Mapping States
  const [selectedTestId, setSelectedTestId] = useState("");
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");
  const [bulkFile, setBulkFile] = useState<File | null>(null);"""
content = content.replace('  const [isActive, setIsActive] = useState(true);', state_insert)

# 3. Queries and Mutations
query_insert = """  const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["admin-questions", search, "mock"],
    queryFn: () => questionsApi.getAllQuestions({ search, sourceType: "mock" }),
  });

  const { data: testsDataResponse } = useQuery({
    queryKey: ["admin-tests", "mock"],
    queryFn: () => testsApi.getAllTests({ search: "", mode: "mock", testCategory: "all", limit: 100 }),
  });
  const availableTests = testsDataResponse?.data || [];

  const createTestMutation = useMutation({
    mutationFn: (data: Partial<Test>) => testsApi.createTest(data),
    onSuccess: (res) => {
      toast.success("Mock Test created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-tests", "mock"] });
      setIsTestDialogOpen(false);
      if (res.data?._id) {
        setSelectedTestId(res.data._id);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create mock test");
    },
  });

  const addQuestionsToTestMutation = useMutation({
    mutationFn: ({ testId, qId }: { testId: string; qId: string }) => 
      testsApi.addQuestions(testId, [{ question: qId }]),
    onSuccess: () => {
      toast.success("Question mapped to test successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
    },
  });

  const bulkUploadMutation = useMutation({
    mutationFn: (formData: FormData) => testsApi.uploadWordQuestions(formData),
    onSuccess: (res: any) => {
      toast.success(res.message || "Bulk upload successful!");
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
      setBulkFile(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to bulk upload questions");
    },
  });"""
content = content.replace(
    '  const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({\n    queryKey: ["admin-questions", search, "mock"],\n    queryFn: () => questionsApi.getAllQuestions({ search, sourceType: "mock" }),\n  });',
    query_insert
)

# 4. createMutation update
create_mutation_old = """    onSuccess: (res: any) => {
      toast.success("Question created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      // Reset some fields"""
create_mutation_new = """    onSuccess: (res: any) => {
      toast.success("Question created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      
      if (selectedTestId && res.data?._id) {
        addQuestionsToTestMutation.mutate({ testId: selectedTestId, qId: res.data._id });
      }

      // Reset some fields"""
content = content.replace(create_mutation_old, create_mutation_new)

# 5. JSX Header
header_old = """        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Pencil size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Add Mock Test Question</h2>
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Download size={16} /> Bulk CSV Import
          </button>
        </div>"""
header_new = """        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Pencil size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Add Mock Test Questions</h2>
          </div>
        </div>

        {/* --- TEST MAPPING SECTION --- */}
        <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Map to Mock Test <span className="text-red-500">*</span></h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Select a Mock Test to add questions to.</p>
            </div>
            <button onClick={() => setIsTestDialogOpen(true)} className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-lg transition-colors border border-indigo-100">
              + Create New Mock Test
            </button>
          </div>
          <select value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none appearance-none bg-white font-medium text-slate-700">
            <option value="">-- Select a Mock Test --</option>
            {availableTests.map((t: any) => (
              <option key={t._id} value={t._id}>{t.title} {t.examTag ? `(${t.examTag})` : ''}</option>
            ))}
          </select>
        </div>

        {selectedTestId ? (
          <>
            {/* TABS */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-px">
              <button onClick={() => setUploadMode("single")} className={cn("px-5 py-2.5 text-sm font-bold border-b-2 transition-colors", uploadMode === "single" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}>Add Single Question</button>
              <button onClick={() => setUploadMode("bulk")} className={cn("px-5 py-2.5 text-sm font-bold border-b-2 transition-colors", uploadMode === "bulk" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}>Bulk Upload (Word doc)</button>
            </div>

            {uploadMode === "single" ? ("""
content = content.replace(header_old, header_new)

# 6. Closing JSX and Bulk Upload form
closing_old = """          <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-2">
            <button type="button" onClick={() => { setQuestionText(""); setOptionA(""); setOptionB(""); setOptionC(""); setOptionD(""); setSolution(""); }} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50">
              Clear
            </button>
            <button type="submit" disabled={createMutation.isPending} className="px-6 py-2.5 bg-[#4F46E5] text-white font-bold text-sm rounded-lg hover:bg-indigo-600 flex items-center gap-2 disabled:opacity-50">
              {createMutation.isPending ? "Saving..." : "Save Mock Test Question"}
            </button>
          </div>
        </form>
      </div>"""
closing_new = """          <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-2">
            <button type="button" onClick={() => { setQuestionText(""); setOptionA(""); setOptionB(""); setOptionC(""); setOptionD(""); setSolution(""); }} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50">
              Clear
            </button>
            <button type="submit" disabled={createMutation.isPending || addQuestionsToTestMutation.isPending} className="px-6 py-2.5 bg-[#4F46E5] text-white font-bold text-sm rounded-lg hover:bg-indigo-600 flex items-center gap-2 disabled:opacity-50">
              {createMutation.isPending || addQuestionsToTestMutation.isPending ? "Saving..." : "Save Question"}
            </button>
          </div>
        </form>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
                <div className="text-center space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">Upload Word Document</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">Upload a .docx file formatted correctly. The parser will automatically extract questions, options, answers, and metadata.</p>
                </div>
                <input 
                  type="file" 
                  accept=".docx"
                  onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                  className="max-w-xs text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button 
                  onClick={() => {
                    if (!bulkFile) return toast.error("Please select a file first");
                    const fd = new FormData();
                    fd.append("wordFile", bulkFile);
                    fd.append("testId", selectedTestId);
                    bulkUploadMutation.mutate(fd);
                  }}
                  disabled={!bulkFile || bulkUploadMutation.isPending}
                  className="px-6 py-2.5 bg-[#4F46E5] text-white font-bold text-sm rounded-lg hover:bg-indigo-600 disabled:opacity-50 mt-4"
                >
                  {bulkUploadMutation.isPending ? "Uploading..." : "Upload & Map Questions"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center border border-slate-100 rounded-xl bg-slate-50 text-slate-500 text-sm">
            Please select or create a Mock Test to start adding questions.
          </div>
        )}
      </div>

      <TestDialog 
        isOpen={isTestDialogOpen}
        onOpenChange={setIsTestDialogOpen}
        onSubmit={(values) => {
          createTestMutation.mutate({ ...values, mode: "mock" });
        }}
        isPending={createTestMutation.isPending}
      />"""
content = content.replace(closing_old, closing_new)

with open(FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print("MocksTab updated!")
