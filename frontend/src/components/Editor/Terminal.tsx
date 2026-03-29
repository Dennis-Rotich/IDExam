interface TerminalProps {
  output?: string;
  executionTime?: string;
  isLoading?: boolean;
}

export const Terminal = ({ output, executionTime, isLoading }: TerminalProps) => {
  return (
    <div className="flex flex-col rounded-lg border border-[#333] bg-black/40 overflow-hidden mb-6 group transition-all hover:border-[#444]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252525] border-b border-[#333]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] opacity-80 group-hover:opacity-100" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] opacity-80 group-hover:opacity-100" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] opacity-80 group-hover:opacity-100" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-2 select-none">
            Console
          </span>
        </div>
        <div className="flex items-center gap-3">
           {isLoading && <span className="text-[10px] text-green-500 animate-pulse">Executing...</span>}
           <span className="text-[10px] text-slate-500 font-mono italic">
            {executionTime || "0ms"}
          </span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 min-h-[120px] max-h-[300px] overflow-y-auto custom-scrollbar">
        {output ? (
          <pre className="text-xs font-mono leading-relaxed break-words whitespace-pre-wrap">
            <span className="text-blue-400 mr-2 opacity-70 font-bold">»</span>
            <span className="text-slate-300">{output}</span>
            <span className="inline-block w-1.5 h-4 ml-1 bg-green-500/50 animate-pulse align-middle" />
          </pre>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-xs py-8">
            <p>No output generated.</p>
            <p className="text-[10px] mt-1 not-italic opacity-50 uppercase">Run your code to see logs</p>
          </div>
        )}
      </div>
    </div>
  );
};