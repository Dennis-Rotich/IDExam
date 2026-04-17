import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, CalendarClock, Settings2, ShieldAlert, Loader2, Plus, 
  X, Search, Trash2, GripVertical, ArrowUp, ArrowDown, Code2, BookOpen
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { createExamApi } from '../../api/exam'; 
// Changed to match the API used in QuestionBank.tsx
import { getInstructorQuestionsApi } from '../../api/question';
import { generateExamCode } from '../../utils/string';
import { useAuth } from '../../context/AuthContext'; // Import auth to match your QuestionBank logic if needed

export default function CreateExam() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // Bank State
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [bankTags, setBankTags] = useState(''); 
  
  const [questionsBank, setQuestionsBank] = useState<any[]>([]);
  const [isLoadingBank, setIsLoadingBank] = useState(false);
  const [hasLoadedBank, setHasLoadedBank] = useState(false);

  // 1. Fetch Questions (Using the exact logic from QuestionBank.tsx)
  const loadBankQuestions = async () => {
    try {
      setIsLoadingBank(true);
      const data = await getInstructorQuestionsApi();
      setQuestionsBank(Array.isArray(data) ? data : []);
      setHasLoadedBank(true);
    } catch (error) {
      toast.error("Failed to load question bank.");
    } finally {
      setIsLoadingBank(false);
    }
  };

  // Only fetch when the modal opens for the first time
  useEffect(() => {
    if (isBankOpen && !hasLoadedBank) {
      loadBankQuestions();
    }
  }, [isBankOpen, hasLoadedBank]);

  // 2. Local Filtering Logic
  const filteredBankQuestions = questionsBank.filter((q) => {
    const matchesSearch = 
      (q.title || "").toLowerCase().includes(bankSearch.toLowerCase()) ||
      (q.topic || "").toLowerCase().includes(bankSearch.toLowerCase());

    const searchTags = bankTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    const matchesTags = searchTags.length === 0 || searchTags.some(searchTag => 
      q.tags?.some((tag: string) => tag.toLowerCase().includes(searchTag))
    );

    return matchesSearch && matchesTags;
  });
  
  const [examData, setExamData] = useState({
    title: '',
    examCode: '',
    courseCode: '',
    description: '',
    durationInMinutes: '',
    availableFrom: '',
    availableUntil: '',
    environmentCheck: true,
    blockTabSwitching: true,
    enforceFullscreen: false,
    passMark: '',
    questions: [] as any[], 
  });

  const handleToggleQuestion = (question: any) => {
    setExamData(prev => {
      const isSelected = prev.questions.some(q => q._id === question._id);
      if (isSelected) {
        return { ...prev, questions: prev.questions.filter(q => q._id !== question._id) };
      } else {
        return { ...prev, questions: [...prev.questions, question] };
      }
    });
  };

  const removeQuestion = (id: string) => {
    setExamData(prev => ({ ...prev, questions: prev.questions.filter(q => q._id !== id) }));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    setExamData(prev => {
      const newQuestions = [...prev.questions];
      if (direction === 'up' && index > 0) {
        [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
      } else if (direction === 'down' && index < newQuestions.length - 1) {
        [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
      }
      return { ...prev, questions: newQuestions };
    });
  };

  const totalPoints = examData.questions.reduce((sum, q) => sum + (q.pointsWeight || q.points || 0), 0);

  // Consolidated Save Logic for Drafts and Publishing
  const submitExamData = async (isDraft: boolean) => {
    if (!examData.title.trim()) return toast.error("Exam title is required.");
    if (!examData.durationInMinutes) return toast.error("Duration is required.");
    if (examData.questions.length === 0) return toast.error("Add at least one question.");
    
    try {
      isDraft ? setIsSavingDraft(true) : setIsSaving(true);
      
      const finalExamCode = examData.examCode.trim() || generateExamCode(examData.courseCode);
      const questionIds = examData.questions.map(q => q._id);

      await createExamApi({
        title: examData.title,
        examCode: finalExamCode,
        courseCode: examData.courseCode,
        instructions: examData.description,
        durationInMinutes: parseInt(examData.durationInMinutes),
        availableFrom: examData.availableFrom ? new Date(examData.availableFrom).toISOString() : undefined,
        availableUntil: examData.availableUntil ? new Date(examData.availableUntil).toISOString() : undefined,
        aiProctoringEnabled: examData.environmentCheck || examData.blockTabSwitching || examData.enforceFullscreen, 
        questions: questionIds,
        totalPoints: totalPoints,
        passMark: parseInt(examData.passMark) || 50,
        status: isDraft ? "draft" : "published",
        isActive: true, 
      });
      
      toast.success(isDraft ? "Draft saved successfully!" : "Exam published successfully!");
      navigate("/instructor/exams"); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save exam to server.");
    } finally {
      isDraft ? setIsSavingDraft(false) : setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2 relative animate-in fade-in duration-300">
      
      {/* QUESTION BANK MODAL */}
      {isBankOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border shadow-lg rounded-xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Question Bank 
                {isLoadingBank && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsBankOpen(false)} className="h-8 w-8 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4 border-b border-border bg-muted/30 space-y-3 shrink-0">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search questions by title or topic..." 
                    className="pl-9 bg-background border-border" 
                    value={bankSearch} 
                    onChange={(e) => setBankSearch(e.target.value)} 
                  />
                </div>
                <div className="w-1/3">
                  <Input 
                    placeholder="Filter by tags (comma separated)..." 
                    className="bg-background border-border" 
                    value={bankTags} 
                    onChange={(e) => setBankTags(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Scrolling list of filtered questions */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-background/50">
              {isLoadingBank ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm">Loading questions...</p>
                </div>
              ) : filteredBankQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3">
                  <Search className="h-8 w-8 opacity-20" />
                  <p className="text-sm">No questions found matching your criteria.</p>
                </div>
              ) : (
                filteredBankQuestions.map((q) => {
                  const isSelected = examData.questions.some(eq => eq._id === q._id);
                  const isMine = typeof q.createdBy === "string" ? q.createdBy === user?.id : (q.createdBy as any)?._id === user?.id;

                  return (
                    <div key={q._id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected ? 'border-primary/50 bg-primary/5' : 'border-border bg-card hover:border-foreground/30'}`}>
                      <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                        <div className="mt-0.5 text-muted-foreground">
                          {q.type === "CODING" ? <Code2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{q.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                              {q.type?.replace('_', ' ')} • {q.pointsWeight || 0} pts
                            </span>
                            {!isMine && (
                              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Dept. Network</span>
                            )}
                            {q.tags && q.tags.length > 0 && (
                              <div className="flex gap-1 hidden sm:flex">
                                {q.tags.slice(0, 2).map((tag: string) => <span key={tag} className="text-[9px] bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground border border-border">{tag}</span>)}
                                {q.tags.length > 2 && <span className="text-[9px] text-muted-foreground">+{q.tags.length - 2}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={isSelected ? "destructive" : "secondary"} 
                        size="sm" 
                        onClick={() => handleToggleQuestion(q)} 
                        className={`h-8 shrink-0 ${!isSelected && 'bg-foreground text-background hover:bg-foreground/90'}`}
                      >
                        {isSelected ? "Remove" : "Add to Exam"}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="p-4 border-t border-border bg-muted/10 flex justify-between items-center shrink-0">
              <span className="text-sm text-foreground font-medium bg-background border border-border px-3 py-1 rounded-full">
                {examData.questions.length} Selected
              </span>
              <Button onClick={() => setIsBankOpen(false)} className="rounded-full px-6">Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <div className="w-full sm:w-1/2">
          <Input 
            className="text-2xl font-bold h-12 border-transparent shadow-none px-2 focus-visible:ring-1 focus-visible:ring-border bg-transparent text-foreground placeholder:text-muted-foreground/50 w-full" 
            placeholder="Untitled Exam..." 
            value={examData.title}
            onChange={(e) => setExamData({...examData, title: e.target.value})}
            autoFocus
          />
        </div>
        <div className="flex items-center gap-3">
          <Button 
            disabled={isSaving || isSavingDraft} 
            variant="secondary" 
            className="bg-muted/50 hover:bg-muted text-foreground h-9 rounded-full px-5 text-sm"
            onClick={() => submitExamData(true)}
          >
            {isSavingDraft ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </Button>
          <Button 
            disabled={isSaving || isSavingDraft} 
            className="bg-foreground text-background hover:bg-foreground/90 h-9 rounded-full px-5 text-sm transition-all" 
            onClick={() => submitExamData(false)}
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? "Publishing..." : "Publish Exam"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MAIN COLUMN */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">General Instructions</div>
            <Textarea className="w-full min-h-[120px] border-0 rounded-none focus-visible:ring-0 resize-none p-5 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm" placeholder="Provide instructions..." value={examData.description} onChange={(e) => setExamData({...examData, description: e.target.value})} />
          </div>

          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30 min-h-[300px]">
            <div className="py-3 px-4 border-b border-border bg-muted/10 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam Manifest</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-medium">{totalPoints} Total Pts</span>
                <span className="text-[10px] bg-foreground text-background px-2 py-0.5 rounded-full font-medium">{examData.questions.length} Questions</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col p-2">
              {examData.questions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-16">
                  <p className="text-sm mb-4">No questions added to this exam yet.</p>
                  <Button variant="outline" className="rounded-full border-border" onClick={() => setIsBankOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Browse Question Bank
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {examData.questions.map((q, index) => (
                    <div key={q._id} className="flex items-center gap-3 p-3 bg-background border border-border rounded-md group">
                      <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab hidden sm:block" />
                      <span className="text-sm font-medium w-6 text-muted-foreground">{index + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{q.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{q.type.replace('_', ' ')} • {q.pointsWeight || q.points || 0} pts</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => moveQuestion(index, 'up')} disabled={index === 0}><ArrowUp className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => moveQuestion(index, 'down')} disabled={index === examData.questions.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeQuestion(q._id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 pb-2 text-center">
                    <Button variant="outline" size="sm" className="rounded-full border-border border-dashed text-muted-foreground hover:text-foreground" onClick={() => setIsBankOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" /> Add More Questions
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Settings2 className="w-3.5 h-3.5" /> Exam Settings</div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Exam Code</label>
                <Input placeholder="e.g. MIDTERM-A" className="h-8 text-sm bg-background border-border uppercase font-mono" value={examData.examCode} onChange={(e) => setExamData({...examData, examCode: e.target.value.toUpperCase()})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Course Code</label>
                <Input placeholder="e.g. CS301" className="h-8 text-sm bg-background border-border uppercase font-mono" value={examData.courseCode} onChange={(e) => setExamData({...examData, courseCode: e.target.value.toUpperCase()})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Duration (Mins) <span className="text-destructive">*</span></label>
                  <Input type="number" placeholder="90" className="h-8 text-sm bg-background border-border" value={examData.durationInMinutes} onChange={(e) => setExamData({...examData, durationInMinutes: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Pass Mark (Pts) <span className="text-destructive">*</span></label>
                  <Input type="number" placeholder="50" className="h-8 text-sm bg-background border-border" value={examData.passMark} onChange={(e) => setExamData({...examData, passMark: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><CalendarClock className="w-3.5 h-3.5" /> Availability</div>
            <div className="p-4 space-y-4">
              <div className="space-y-2"><label className="text-xs font-medium text-foreground">Opening Date</label><Input type="datetime-local" className="h-8 text-sm bg-background border-border" value={examData.availableFrom} onChange={(e) => setExamData({...examData, availableFrom: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-xs font-medium text-foreground">Closing Date</label><Input type="datetime-local" className="h-8 text-sm bg-background border-border" value={examData.availableUntil} onChange={(e) => setExamData({...examData, availableUntil: e.target.value})} /></div>
            </div>
          </div>

          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><ShieldAlert className="w-3.5 h-3.5" /> Proctoring Rules</div>
            <div className="p-4 space-y-3">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:text-primary transition-colors"><input type="checkbox" className="rounded border-border bg-background" checked={examData.environmentCheck} onChange={(e) => setExamData({...examData, environmentCheck: e.target.checked})} /> Enable Environment Check</label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:text-primary transition-colors"><input type="checkbox" className="rounded border-border bg-background" checked={examData.blockTabSwitching} onChange={(e) => setExamData({...examData, blockTabSwitching: e.target.checked})} /> Block Tab Switching</label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:text-primary transition-colors"><input type="checkbox" className="rounded border-border bg-background" checked={examData.enforceFullscreen} onChange={(e) => setExamData({...examData, enforceFullscreen: e.target.checked})} /> Enforce Fullscreen</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}