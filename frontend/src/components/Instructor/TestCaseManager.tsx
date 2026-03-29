  import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
  import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
  import { Button } from "../ui/button";
  import { Input } from "../ui/input";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
  import { Badge } from "../ui/badge";

  const MOCK_TEST_CASES = [
    { id: 1, input: "nums = [2,7,11,15], target = 9", output: "[0,1]", isHidden: false },
    { id: 2, input: "nums = [3,2,4], target = 6", output: "[1,2]", isHidden: false },
    { id: 3, input: "nums = [3,3], target = 6", output: "[0,1]", isHidden: true },
    { id: 4, input: "nums = [1,2,3,4,5], target = 10", output: "[]", isHidden: true },
  ];

  export function TestCaseManager() {
    return (
      <Card className="bg-card border-border shadow-sm text-left">
        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border bg-muted/30">
          <div>
            <CardTitle className="text-sm font-medium text-foreground">Execution Test Cases</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Define inputs and expected outputs. Hidden cases are used for final grading.</p>
          </div>
          <Button size="sm" variant="outline" className="border-border hover:bg-muted text-foreground h-8">
            <Plus className="w-4 h-4 mr-2" /> Add Test Case
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium w-[40%]">Input Arguments</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[30%]">Expected Output</TableHead>
                <TableHead className="text-center text-muted-foreground font-medium w-[15%]">Visibility</TableHead>
                <TableHead className="w-[15%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TEST_CASES.map((tc) => (
                <TableRow key={tc.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="p-3">
                    <Input defaultValue={tc.input} className="h-8 font-mono text-xs bg-transparent border-border text-foreground" />
                  </TableCell>
                  <TableCell className="p-3">
                    <Input defaultValue={tc.output} className="h-8 font-mono text-xs bg-transparent border-border text-foreground" />
                  </TableCell>
                  <TableCell className="p-3 text-center">
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
                  <TableCell className="p-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }