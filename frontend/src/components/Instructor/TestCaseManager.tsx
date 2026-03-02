{/* ... inside your TestContext === "testresults" block ... 
<div className="p-4 space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="p-4 rounded-xl bg-[#252525] border border-[#333] flex items-center justify-between">
      <div>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Overall Status</p>
        <p className={`text-sm font-bold mt-1 ${activeData.results.testResults.every(r => r.passed) ? 'text-green-500' : 'text-red-500'}`}>
          {activeData.results.testResults.every(r => r.passed) ? "All Tests Passed" : "Partial Failure"}
        </p>
      </div>
      <div className="h-10 w-10 rounded-full bg-black/20 flex items-center justify-center border border-[#333]">
        {activeData.results.testResults.every(r => r.passed) ? <CircleCheck className="text-green-500" /> : <CircleAlert className="text-red-500" />}
      </div>
    </div>
    
    <div className="p-4 rounded-xl bg-[#252525] border border-[#333]">
      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Success Rate</p>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-xl font-mono text-white">
          {activeData.results.testResults.filter(r => r.passed).length} / {activeData.results.testResults.length}
        </p>
        <p className="text-[10px] text-slate-400 mb-1 leading-none">cases passed</p>
      </div>
    </div>
  </div>

  <div className="flex flex-wrap gap-2">
    {activeData.results.testResults.map((res) => (
      <div
        key={res.id}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
          res.passed 
            ? "bg-green-500/5 border-green-500/20 text-green-500" 
            : "bg-red-500/5 border-red-500/20 text-red-500"
        }`}
      >
        <span className="text-[10px] font-mono font-bold opacity-60">#{res.id}</span>
        {res.passed ? <CircleCheck size={14} /> : <CircleAlert size={14} />}
      </div>
    ))}
  </div>

  <div className="pt-2">
    <div className="flex items-center justify-between mb-2 px-1">
       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Execution Logs</span>
       <button className="text-[10px] text-blue-400 hover:underline">Copy Trace</button>
    </div>
    <Terminal
      output={activeData.results.output}
      executionTime={activeData.results.executionTime} // Fixed: was passing output as time
      isLoading={false}
    />
  </div>
</div>
*/}