import { Play, Save } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// Your custom components
import { ExamMetadata } from "../../components/Instructor/ExamMetadataForm";
import { CodeSolutionEditor } from "../../components/Instructor/CodeSolutionEditor";
import { TestCaseManager } from "../../components/Instructor/TestCaseManager";

export function QuestionEditor() {
  return (
    <div className="mx-auto px-6 space-y-6 pb-12 text-black">
      <div className="flex items-center justify-between">
        <Input 
          className="w-1/2 text-2xl font-bold h-12 border-none shadow-none px-0 focus-visible:ring-0 bg-transparent" 
          placeholder="Untitled Question..." 
        />
        <div className="flex gap-2">
          <Button variant="outline"><Play className="w-4 h-4 mr-2" /> Run Solution</Button>
          <Button><Save className="w-4 h-4 mr-2" /> Save Question</Button>
        </div>
      </div>

      {/* Replaced with your component */}
      <ExamMetadata />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px] text-left">
        <Card className="flex flex-col h-full border-muted">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Problem Description</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Textarea className="w-full h-full min-h-[400px] border-0 rounded-none focus-visible:ring-0 resize-none p-4" />
          </CardContent>
        </Card>

        <CodeSolutionEditor />
      </div>

      <TestCaseManager />
    </div>
  );
}