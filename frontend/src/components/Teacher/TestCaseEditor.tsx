// src/components/Teacher/TestCaseEditor.jsx
export default function TestCaseEditor({ testCases, setTestCases }) {
  const addRow = () => {
    setTestCases([...testCases, { input: '', output: '', isHidden: false }]);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
      <h3 className="text-lg font-semibold mb-4">Test Cases</h3>
      {testCases.map((tc, index) => (
        <div key={index} className="flex gap-4 mb-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-slate-500">Input</label>
            <textarea className="w-full border rounded p-2 text-sm bg-slate-50" value={tc.input} />
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-500">Expected Output</label>
            <textarea className="w-full border rounded p-2 text-sm bg-slate-50" value={tc.output} />
          </div>
          <button className="text-red-500 p-2">Delete</button>
        </div>
      ))}
      <button onClick={addRow} className="mt-2 text-blue-600 font-medium">+ Add Test Case</button>
    </div>
  );
}

/* 
Logic: How the Instructor "Generates" Them
1. There are two ways an instructor "generates" these:
2. Manual Entry: The form above.
3. Scripted Generation (Advanced): If the instructor writes a 
"Solution Script," you can add a button that runs that script against 
the "Inputs" to automatically populate the "Expected Outputs."
*/