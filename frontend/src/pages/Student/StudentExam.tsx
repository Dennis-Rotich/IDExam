import * as Panel from "react-resizable-panels";
import { MonacoInstance } from "../../components/Editor/MonacoInstance";

export const StudentExam = () => {
  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      {/* Top Header: Title & Timer */}
      <header className="h-14 border-b border-slate-700 flex items-center px-6 justify-between">
        <h1 className="font-bold">tAhIni Exam: Data Structures</h1>
        <div className="text-red-400 font-mono">Time Left: 45:00</div>
      </header>

      {/* Main Content: Split View */}
      <main className="flex-1 overflow-hidden">
        <Panel.Group dir="horizontal">
          <Panel.Panel
            defaultSize={40}
            minSize={20}
            className="bg-slate-800 p-6 overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
            <p className="text-slate-300">Implement a function that...</p>
          </Panel.Panel>

          <Panel.Separator className="w-1 bg-slate-700 hover:bg-blue-500 transition-colors" />

          <Panel.Panel defaultSize={60} minSize={30}>
            <MonacoInstance />
          </Panel.Panel>
        </Panel.Group>
      </main>
    </div>
  );
};
