import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  ListFilter,
  MoreHorizontal,
  ClipboardList,
  Clock,
  Users,
  Pencil,
  Trash2,
  Eye,
  BarChart2,
  CheckCircle2,
  CircleDashed,
  Archive,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  getTeacherExamsApi,
  deleteExamApi,
  updateExamApi,
} from "../../api/exam";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

// Modals
import { TestPreviewModal } from "../../components/Instructor/TestPreviewModal";
import { CreateEditTestModal } from "../../components/Instructor/CreateEditTestModal";

const STATUS_META: Record<string, { label: string; icon: any; color: string }> =
  {
    published: {
      label: "Published",
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    draft: {
      label: "Draft",
      icon: CircleDashed,
      color: "text-muted-foreground",
    },
    closed: { label: "Closed", icon: Archive, color: "text-amber-500" },
  };

export function InstructorTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();

  // Modal States
  const [previewTest, setPreviewTest] = useState<any>(null);
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [testToEdit, setTestToEdit] = useState<any>(null);

  // 1. Fetch Exams
  const loadExams = async () => {
    try {
      setIsLoading(true);
      const response = await getTeacherExamsApi();
      // Safely extract the array based on your ExamsListResponse type
      const examsArray = Array.isArray(response)
        ? response
        : (response as any).exams || (response as any).data || [];
      setTests(examsArray);
    } catch (error) {
      toast.error("Failed to load exams.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  // Handle Save/Edit Modal
  const handleSaveTest = async (testData: any) => {
    try {
      if (testToEdit) {
        await updateExamApi(testData._id, testData);
        toast.success("Exam updated successfully!");
      }
      loadExams(); // Refresh list after edit
      setIsCreateEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update exam.");
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      try {
        await deleteExamApi(id);
        setTests(tests.filter((t) => t._id !== id));
        toast.success("Exam deleted.");
      } catch (error) {
        toast.error("Failed to delete exam.");
      }
    }
  };

  // Client-side filtering & status mapping
  const filtered = tests.filter((t) => {
    const calculatedStatus = t.isActive ? "published" : "closed";

    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.courseCode || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || calculatedStatus === filter;

    return matchesSearch && matchesFilter;
  });

  const categories = [
    { id: "all", label: "All Tests" },
    { id: "published", label: "Published" },
    { id: "draft", label: "Drafts" },
    { id: "closed", label: "Closed" },
  ];

  return (
    <div className="mx-auto space-y-6 pb-12 text-left text-foreground px-2">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="h-7 w-7" /> Examinations
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create, manage, and track all your published and draft exams.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 rounded-full h-9 px-5 shrink-0"
          onClick={() => {
            navigate("/instructor/exams/new");
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> New Exam
        </Button>
      </div>

      {/* PILL FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-border pb-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
          {categories.map((cat) => {
            const isActive = filter === cat.id;
            return (
              <Button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                variant={isActive ? "default" : "secondary"}
                className={`rounded-full h-9 px-4 shrink-0 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
                }`}
              >
                {cat.label}
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exams..."
              className="pl-9 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-border h-9 text-sm rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ListFilter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* LIST HEADER */}
      <div className="w-full text-sm">
        <div className="flex items-center justify-between py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-5 shrink-0 text-center">Status</div>
            <div>Title & Course</div>
          </div>
          <div className="hidden md:flex items-center gap-6 shrink-0 pl-4">
            <span className="w-20 text-left">Questions</span>
            <span className="w-24 text-left">Enrolled</span>
            <span className="w-20 text-left">Duration</span>
            <div className="w-8 text-right"></div>
          </div>
        </div>

        {/* LIST BODY */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((test, idx) => {
            const statusStr = test.isActive ? "published" : "closed";
            const meta = STATUS_META[statusStr] || STATUS_META.draft;
            const StatusIcon = meta.icon;

            return (
              <div
                key={test._id}
                className={`flex items-center justify-between py-3 px-4 transition-colors rounded-md ${idx % 2 === 0 ? "bg-muted/10" : "bg-transparent"} hover:bg-muted/30`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`w-5 shrink-0 flex justify-center ${meta.color}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium text-foreground">
                      {test.title}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {test.courseCode || "General"} • Due{" "}
                      {test.availableUntil
                        ? new Date(test.availableUntil).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short" },
                          )
                        : "TBD"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 pl-4">
                  <span className="hidden md:flex items-center gap-1.5 w-20 text-left text-muted-foreground text-xs">
                    <ClipboardList className="w-3.5 h-3.5" />{" "}
                    {test.questions?.length || 0}
                  </span>
                  <span className="hidden md:flex items-center gap-1.5 w-24 text-left text-muted-foreground text-xs">
                    <Users className="w-3.5 h-3.5" />{" "}
                    {test.assignedCohorts?.length || 0}
                  </span>
                  <span className="hidden md:flex items-center gap-1.5 w-20 text-left text-muted-foreground text-xs">
                    <Clock className="w-3.5 h-3.5" />{" "}
                    {test.durationInMinutes || 0}m
                  </span>

                  <div className="w-8 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-muted rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-card border-border"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => setPreviewTest(test)}
                        >
                          <Eye className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => {
                            setTestToEdit(test);
                            setIsCreateEditModalOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                          Edit Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => navigate(`/instructor/exam/${test._id}/submissions`)}
                        >
                          <BarChart2 className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                          Submissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          onClick={() => handleDelete(test._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Exam
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Search className="h-8 w-8 mb-3 opacity-20" />
            <p>No exams match your current filters.</p>
          </div>
        )}
      </div>

      {/* Render Modals */}
      <TestPreviewModal
        test={previewTest}
        onClose={() => setPreviewTest(null)}
      />
      <CreateEditTestModal
        isOpen={isCreateEditModalOpen}
        onClose={() => setIsCreateEditModalOpen(false)}
        testToEdit={testToEdit}
        onSave={handleSaveTest}
      />
    </div>
  );
}
