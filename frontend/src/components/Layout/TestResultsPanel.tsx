// Inside TestResultsPanel.tsx
export const TestResultsPanel = ({ results }: { results?: any }) => {
  if (!results) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-[#1e1e1e]">
        <p className="text-sm font-sans opacity-50">Run your code to see results</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#1e1e1e] p-5 overflow-y-auto font-sans">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm tracking-tight">Test Cases</h3>
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
          Time: {results.executionTime}
        </span>
      </div>

      <div className="space-y-3">
        {results.testResults.map((test: any, idx: number) => (
          <div 
            key={idx} 
            className="p-3 rounded-lg border border-[#333] bg-[#252525] flex items-center justify-between transition-all hover:border-[#444]"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Case {idx + 1}</span>
              <code className="text-xs text-slate-300 font-mono">Input: {test.input}</code>
            </div>
            
            <div className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-tighter ${
              test.passed ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            }`}>
              {test.passed ? "Passed" : "Failed"}
            </div>
          </div>
        ))}
      </div>

      {results.error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
          <p className="text-xs text-red-400 font-mono leading-relaxed">{results.error}</p>
        </div>
      )}
    </div>
  );
};