import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Eye, EyeOff, Code2, FileText, CheckCircle2, List } from "lucide-react";
import { type Question } from "../../types/exam";

interface QuestionPreviewModalProps {
  question: Question | null;
  onClose: () => void;
}

export function QuestionPreviewModal({ question, onClose }: QuestionPreviewModalProps) {
  if (!question) return null;

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium">Easy</Badge>;
      case "Medium": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 font-medium">Medium</Badge>;
      case "Hard": return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-medium">Hard</Badge>;
      default: return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  // Safely extract starter code for the first available language
  const defaultLang = question.allowedLanguages?.[0] || 'python';
  const starterCodeSnippet = question.starterCode?.[defaultLang] || "# No starter code defined";

  return (
    <Dialog open={!!question} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl bg-card border-border text-foreground p-0 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-start justify-between pr-6">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-3">
                {question.title}
                {getDifficultyBadge(question.difficulty)}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {question.topic || "General"}</span>
                <span>•</span>
                {/* Updated Type display */}
                <span className="uppercase text-[10px] tracking-wider font-semibold bg-muted px-2 py-0.5 rounded-full text-foreground border border-border">
                  {question.type.replace("_", " ")}
                </span>
                <span>•</span>
                <span>{question.pointsWeight || 10} Points</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-8 pb-4">
            
            {/* Description Section */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Problem Description</h3>
              <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans">
                {question.description || <span className="text-muted-foreground italic">No description provided.</span>}
              </div>
            </section>

            {/* --- CODING QUESTION SPECIFIC UI --- */}
            {question.type === "CODING" && (
              <>
                {/* Code Snippets Section */}
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> Code Environment
                  </h3>
                  <Tabs defaultValue="starter" className="w-full">
                    <TabsList className="bg-muted w-full justify-start rounded-b-none border border-border border-b-0 px-2">
                      <TabsTrigger value="starter">Starter Code ({defaultLang})</TabsTrigger>
                      <TabsTrigger value="reference">Reference Solution</TabsTrigger>
                    </TabsList>
                    <div className="bg-[#1e1e1e] dark:bg-background border border-border rounded-b-lg overflow-hidden">
                      <TabsContent value="starter" className="m-0 p-4">
                        <pre className="text-sm font-mono text-[#d4d4d4] overflow-x-auto">
                          <code>{starterCodeSnippet}</code>
                        </pre>
                      </TabsContent>
                      <TabsContent value="reference" className="m-0 p-4">
                        <pre className="text-sm font-mono text-[#d4d4d4] overflow-x-auto">
                          <code>{question.referenceSolution || "# No reference solution defined"}</code>
                        </pre>
                      </TabsContent>
                    </div>
                  </Tabs>
                </section>

                {/* Test Cases Section */}
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Test Cases
                  </h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50 border-b border-border">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-muted-foreground">Input</TableHead>
                          <TableHead className="text-muted-foreground">Expected Output</TableHead>
                          <TableHead className="text-center text-muted-foreground w-[100px]">Visibility</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {question.testCases && question.testCases.length > 0 ? (
                          question.testCases.map((tc, idx) => (
                            <TableRow key={idx} className="border-border hover:bg-muted/30">
                              <TableCell className="font-mono text-xs">{tc.input}</TableCell>
                              <TableCell className="font-mono text-xs text-emerald-600 dark:text-emerald-500">{tc.expectedOutput}</TableCell>
                              <TableCell className="text-center">
                                {tc.isHidden ? (
                                  <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/10 font-normal text-[10px] gap-1">
                                    <EyeOff className="w-3 h-3" /> Hidden
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 font-normal text-[10px] gap-1">
                                    <Eye className="w-3 h-3" /> Public
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-6 text-sm text-muted-foreground">
                              No test cases defined for this question.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              </>
            )}

            {/* --- MULTIPLE CHOICE UI --- */}
            {question.type === "MULTIPLE_CHOICE" && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <List className="w-4 h-4" /> Options & Answer
                </h3>
                <div className="space-y-2">
                  {question.options?.map((opt, idx) => {
                    const isCorrect = question.correctAnswer === idx;
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-md border flex items-center justify-between ${
                          isCorrect ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5' : 'border-border bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-bold text-muted-foreground mr-3">{String.fromCharCode(65 + idx)}.</span>
                          <span className="text-sm font-medium">{opt}</span>
                        </div>
                        {isCorrect && <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Correct Answer</Badge>}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* --- TRUE/FALSE OR SHORT ANSWER UI --- */}
            {(question.type === "TRUE_FALSE" || question.type === "SHORT_ANSWER") && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Correct Answer
                </h3>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    {String(question.correctAnswer)}
                  </p>
                </div>
              </section>
            )}

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}