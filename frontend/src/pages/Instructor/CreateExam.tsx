import { useState } from 'react';
import { Save, CalendarClock, Settings2, ShieldAlert } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';

// Note: Ensure ExamMetadataForm and TestCaseManager are also updated to this flat aesthetic in your codebase
// import ExamMetadataForm from '../../components/Instructor/ExamMetadataForm';
// import TestCaseManager from '../../components/Instructor/TestCaseManager';

export default function CreateExam() {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    courseCode: '',
    duration: '',
  });

  const handleSave = () => {
    console.log("Publishing Exam:", examData);
  };

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      
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
          <Button className="bg-foreground text-background hover:bg-foreground/90 h-9 rounded-full px-5 text-sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Publish Exam
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MAIN COLUMN (Description & Question Selector Placeholder) */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              General Instructions
            </div>
            <Textarea 
              className="w-full min-h-[200px] border-0 rounded-none focus-visible:ring-0 resize-none p-5 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm" 
              placeholder="Provide instructions for the students taking this exam..."
              value={examData.description}
              onChange={(e) => setExamData({...examData, description: e.target.value})}
            />
          </div>

          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30 min-h-[300px]">
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
              <span>Exam Manifest</span>
              <span className="text-[10px] bg-muted/50 px-2 py-0.5 rounded">0 Questions</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-muted-foreground">
              <p className="text-sm mb-4">No questions added to this exam yet.</p>
              <Button variant="outline" className="rounded-full border-border">Browse Question Bank</Button>
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
                <label className="text-xs font-medium text-foreground">Course Code</label>
                <Input placeholder="e.g. CS301" className="h-8 text-sm bg-background border-border" value={examData.courseCode} onChange={(e)=>setExamData({...examData, courseCode: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Duration (Minutes)</label>
                <Input type="number" placeholder="90" className="h-8 text-sm bg-background border-border" value={examData.duration} onChange={(e)=>setExamData({...examData, duration: e.target.value})} />
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
                <Input type="datetime-local" className="h-8 text-sm bg-background border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Closing Date</label>
                <Input type="datetime-local" className="h-8 text-sm bg-background border-border" />
              </div>
            </div>
          </div>

          <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
            <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ShieldAlert className="w-3.5 h-3.5" /> Proctoring Rules
            </div>
            <div className="p-4 space-y-3">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border bg-background" defaultChecked /> Enable Environment Check
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border bg-background" defaultChecked /> Block Tab Switching
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border bg-background" /> Enforce Fullscreen
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}