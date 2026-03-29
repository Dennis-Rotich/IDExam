import { Loader2, Terminal } from "lucide-react"; // Loader2 spins better

interface StudentConsoleProps {
  results: {
    output: string;
    executionTime: string;
    error?: string; 
  };
  isExecuting: boolean;
}

export const StudentConsole = ({
  results,
  isExecuting,
}: StudentConsoleProps) => {
  // Determine State
  const hasContent = results.output || results.error;
  
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] font-sans border-t border-[#333]">
      {/* Header - Always visible so the UI doesn't jump */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#333]/50 bg-[#252525]">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <Terminal size={12} />
          Console Output
        </div>
        {/* Optional: Show execution time if we have results */}
        {!isExecuting && hasContent && (
           <span className="text-[10px] text-slate-600 font-mono">{results.executionTime}</span>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-black/20 custom-scrollbar font-mono text-xs">
        
        {/* CASE 1: LOADING */}
        {isExecuting ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="animate-spin text-blue-500" size={20} />
            <span className="text-[10px] uppercase tracking-widest opacity-70">Executing...</span>
          </div>
        ) : 
        
        /* CASE 2: ERROR */
        results.error ? (
          <div className="text-red-400 leading-relaxed whitespace-pre-wrap">
             <span className="font-bold mr-2 text-red-500 bg-red-500/10 px-1 rounded">ERROR</span>
             {results.error}
          </div>
        ) : 
        
        /* CASE 3: OUTPUT */
        results.output ? (
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            <span className="text-blue-400 mr-2 opacity-50">❯</span>
            {results.output}
            <span className="inline-block w-1.5 h-4 ml-1 bg-slate-500/50 animate-pulse align-middle" />
          </div>
        ) : 
        
        /* CASE 4: IDLE (Ready) */
        (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
            <Terminal size={32} className="mb-2 opacity-20" />
            <p className="italic">Ready when you are...</p>
          </div>
        )}
      </div>
    </div>
  );
};