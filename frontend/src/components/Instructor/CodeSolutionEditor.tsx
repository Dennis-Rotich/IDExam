import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function CodeSolutionEditor() {
  return (
    <Card className="flex flex-col h-full border-muted overflow-hidden">
      <Tabs defaultValue="starter" className="flex flex-col h-full">
        <CardHeader className="py-2 px-4 flex flex-row items-center justify-between border-b bg-muted/10">
          <TabsList className="grid w-[300px] grid-cols-2">
            <TabsTrigger value="starter">Starter Code</TabsTrigger>
            <TabsTrigger value="solution">Reference Solution</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <TabsContent value="starter" className="m-0 h-full">
            <Editor
              height="100%"
              defaultLanguage="python"
              defaultValue={`def solve():\n    # Write your code here\n    pass`}
              options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
            />
          </TabsContent>
          <TabsContent value="solution" className="m-0 h-full">
            <Editor
              height="100%"
              defaultLanguage="python"
              defaultValue={`def solve():\n    return "Hello World"`}
              options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}