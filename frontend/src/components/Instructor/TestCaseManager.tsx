import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { TestCaseEditor } from "./TestCaseEditor";

export function TestCaseManager() {
  const [testCases, setTestCases] = useState([
    { id: 1, input: "2 3", output: "5", isHidden: false },
    { id: 2, input: "-1 5", output: "4", isHidden: true },
  ]);

  const addTestCase = () => {
    setTestCases([...testCases, { id: Date.now(), input: "", output: "", isHidden: true }]);
  };

  const removeTestCase = (id: number) => {
    setTestCases(testCases.filter((tc) => tc.id !== id));
  };

  const updateTestCase = (id: number, field: string, value: string | boolean) => {
    setTestCases(testCases.map(tc => tc.id === id ? { ...tc, [field]: value } : tc));
  };

  return (
    <Card className="border-muted bg-muted/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Test Cases</CardTitle>
          <CardDescription>Define inputs and expected outputs. Hidden cases prevent hard-coding.</CardDescription>
        </div>
        <Button variant="default" size="sm" onClick={addTestCase}>
          <Plus className="w-4 h-4 mr-2" /> Add Case
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {testCases.map((tc) => (
          <TestCaseEditor 
            key={tc.id} 
            {...tc} 
            onRemove={removeTestCase} 
            onUpdate={updateTestCase} 
          />
        ))}
        {testCases.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No test cases defined. Click "Add Case" to start.
          </div>
        )}
      </CardContent>
    </Card>
  );
}