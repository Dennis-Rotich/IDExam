// src/components/Layout/SplitPane.jsx
export default function SplitPane(/*{ question, children }*/) {
  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden">
      {/* Question Panel */}
      <div className="w-1/3 border-r border-slate-700 p-6 overflow-y-auto bg-slate-50 text-slate-800">
        <h2 className="text-2xl font-bold mb-4">Problem Statement</h2>
        <div className="prose">{/*question*/}</div>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 flex flex-col">
        {/*children*/}
      </div>
    </div>
  );
}