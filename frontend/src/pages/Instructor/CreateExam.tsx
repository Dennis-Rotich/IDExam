import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, CalendarClock, Settings2, ShieldAlert, Loader2, Plus, X, Search, Trash2, GripVertical } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { createExamApi } from '../../api/exam';
import { generateExamCode } from '@/utils/string';

// --- MOCK DATA (Replace with API call to your Question collection) ---
const MOCK_BANK = [
  { _id: 'q1', title: 'What is the time complexity of QuickSort?', type: 'Multiple Choice', points: 2 },
  { _id: 'q2', title: 'Explain the difference between TCP and UDP.', type: 'Essay', points: 10 },
  { _id: 'q3', title: 'Write a React hook to fetch data.', type: 'Code', points: 15 },
  { _id: 'q4', title: 'What does ACID stand for in database transactions?', type: 'Short Answer', points: 5 },
  { _id: 'q5', title: 'Calculate the factorial of N recursively.', type: 'Code', points: 10 },
];

export default function CreateExam() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal State
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  
  const [examData, setExamData] = useState({
    title: '',
    examCode: '',     // NEW
    courseCode: '',   // NEW
    description: '',
    durationInMinutes: '',
    availableFrom: '',
    availableUntil: '',
    environmentCheck: true,
    blockTabSwitching: true,
    enforceFullscreen: false,
    questions: [] as any[], // NEW: Holds full question objects for the UI
  });

  // Toggle question in/out of the exam
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
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q._id !== id)
    }));
  };

  const handleSave = async () => {
    if (!examData.title.trim()) return toast.error("Exam title is required.");
    if (!examData.durationInMinutes) return toast.error("Duration is required.");
    if (examData.questions.length === 0) return toast.error("Add at least one question.");
    
    try {
      setIsSaving(true);
      
      // Auto-generate the code if the instructor left the input blank
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
        aiProctoringEnabled: examData.environmentCheck || examData.blockTabSwitching, // Aggregate logic
        questions: questionIds // Array of IDs matching Mongoose schema
      });
      
      toast.success("Exam published successfully!");
      navigate("/instructor/tests"); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to publish exam to server.");
    } finally {
      setIsSaving(false);
    }
  };

  const totalPoints = examData.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2 relative">
      
      {/* --- QUESTION BANK MODAL --- */}
      {isBankOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border shadow-lg rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Question Bank</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsBankOpen(false)} className="h-8 w-8 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search questions by title or type..." 
                  className="pl-9 bg-background border-border" 
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {MOCK_BANK.filter(q => q.title.toLowerCase().includes(bankSearch.toLowerCase())).map((q) => {
                const isSelected = examData.questions.some(eq => eq._id === q._id);
                return (
                  <div key={q._id} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg border border-transparent hover:border-border transition-all">
                    <div>
                      <p className="text-sm font-medium text-foreground">{q.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{q.type} • {q.points} pts</p>
                    </div>
                    <Button 
                      variant={isSelected ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() => handleToggleQuestion(q)}
                      className="h-8"
                    >
                      {isSelected ? "Remove" : "Add"}
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
              <Button onClick={() => setIsBankOpen(false)}>Done</Button>
            </div>
          </div>
        </div>
      )}
      {/* --- END MODAL --- */}

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
          <Button variant="secondary" className="bg-muted/50 hover:bg-muted text-foreground h-9 rounded-full px-5 text-sm">
            Save Draft
          </Button>
          <Button 
            disabled={isSaving} 
            className="bg-foreground text-background hover:bg-foreground/90 h-9 rounded-full px-5 text-sm transition-all" 
            onClick={handleSave}
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
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              General Instructions
            </div>
            <Textarea 
              className="w-full min-h-[120px] border-0 rounded-none focus-visible:ring-0 resize-none p-5 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm" 
              placeholder="Provide instructions for the students taking this exam..."
              value={examData.description}
              onChange={(e) => setExamData({...examData, description: e.target.value})}
            />
          </div>

          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30 min-h-[300px]">
            <div className="py-3 px-4 border-b border-border bg-muted/10 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam Manifest</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-medium">{totalPoints} Total Pts</span>
                <span className="text-[10px] bg-foreground text-background px-2 py-0.5 rounded-full font-medium">
                  {examData.questions.length} Questions
                </span>
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
                      <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                      <span className="text-sm font-medium w-6 text-muted-foreground">{index + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{q.title}</p>
                        <p className="text-xs text-muted-foreground">{q.type} • {q.points} pts</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeQuestion(q._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

        {/* SIDEBAR (Settings) */}
        <div className="space-y-6">
          
          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Settings2 className="w-3.5 h-3.5" /> Exam Settings
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Exam Code <span className="text-destructive">*</span></label>
                <Input 
                  placeholder="e.g. MIDTERM-A" 
                  className="h-8 text-sm bg-background border-border uppercase font-mono" 
                  value={examData.examCode} 
                  onChange={(e) => setExamData({...examData, examCode: e.target.value.toUpperCase()})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Course Code</label>
                <Input 
                  placeholder="e.g. CS301" 
                  className="h-8 text-sm bg-background border-border uppercase font-mono" 
                  value={examData.courseCode} 
                  onChange={(e) => setExamData({...examData, courseCode: e.target.value.toUpperCase()})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Duration (Minutes) <span className="text-destructive">*</span></label>
                <Input 
                  type="number" 
                  placeholder="90" 
                  className="h-8 text-sm bg-background border-border" 
                  value={examData.durationInMinutes} 
                  onChange={(e) => setExamData({...examData, durationInMinutes: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <CalendarClock className="w-3.5 h-3.5" /> Availability
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Opening Date</label>
                <Input 
                  type="datetime-local" 
                  className="h-8 text-sm bg-background border-border" 
                  value={examData.availableFrom}
                  onChange={(e) => setExamData({...examData, availableFrom: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Closing Date</label>
                <Input 
                  type="datetime-local" 
                  className="h-8 text-sm bg-background border-border" 
                  value={examData.availableUntil}
                  onChange={(e) => setExamData({...examData, availableUntil: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ShieldAlert className="w-3.5 h-3.5" /> Proctoring Rules
            </div>
            <div className="p-4 space-y-3">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-border bg-background" 
                  checked={examData.environmentCheck} 
                  onChange={(e) => setExamData({...examData, environmentCheck: e.target.checked})}
                /> Enable Environment Check
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-border bg-background" 
                  checked={examData.blockTabSwitching} 
                  onChange={(e) => setExamData({...examData, blockTabSwitching: e.target.checked})}
                /> Block Tab Switching
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-border bg-background" 
                  checked={examData.enforceFullscreen} 
                  onChange={(e) => setExamData({...examData, enforceFullscreen: e.target.checked})}
                /> Enforce Fullscreen
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}