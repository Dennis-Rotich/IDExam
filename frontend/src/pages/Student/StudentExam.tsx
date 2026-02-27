import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import type { ComponentProps } from "react";
import { useState, useLayoutEffect, useRef } from "react";
import { MonacoInstance } from "../../components/Editor/MonacoInstance";
import { Timer } from "../../components/Layout/Timer";
import { ChevronUp, Settings, User, HelpCircle } from "lucide-react";

// Alias shadcn props to the PanelProps type you're comfortable with
type PanelProps = ComponentProps<typeof ResizablePanel>;

export const StudentExam = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [minPercentage, setMinPercentage] = useState(0);

  useLayoutEffect(() => {
    const calculateMinSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Enforce the 280px minimum for the Lexend-styled description
        const percentage = (280 / containerWidth) * 100;
        setMinPercentage(percentage);
      }
    };
    calculateMinSize();
    const observer = new ResizeObserver(calculateMinSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Panel configurations using shadcn/PanelProps logic
  const leftPanelProps: Partial<PanelProps> = {
    defaultSize: 45,
    minSize: minPercentage,
    className:
      "flex flex-col bg-[#282828] rounded-lg border border-[#333] overflow-hidden",
  };

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a] text-[#eff1f6] font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="h-12 border-b border-[#333] bg-[#282828] flex items-center px-4 justify-between">
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-blue-500 font-bold tracking-tighter">
            tAhIni
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">IDExam Engine</span>
        </div>
        <div className="flex items-center gap-6">
          <Timer
            endsAt={new Date(Date.now() + 3600000).toISOString()}
            onTimeUp={() => {}}
          />
          <div className="flex items-center gap-3 text-slate-400">
            <Settings size={18} className="hover:text-white cursor-pointer" />
            <User size={18} className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </nav>

      <main ref={containerRef} className="flex-1 overflow-hidden p-2">
        {minPercentage > 0 && (
          <ResizablePanelGroup orientation="horizontal">
            {/* Left: Problem Description */}
            <ResizablePanel {...leftPanelProps}>
              <div className="flex items-center px-4 h-10 border-b border-[#333] bg-[#333]/30 text-xs text-white">
                <span className="border-b-2 border-white h-full flex items-center font-medium">
                  Description
                </span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  20. Valid Parentheses
                </h2>
                <p className="text-slate-300 mb-4">
                  Implement a function to determine if the input string is valid
                  based on parentheses matching.
                </p>
              </div>

              {/* Question Navigation */}
              <div className="p-3 bg-[#282828] border-t border-[#333]">
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <button
                      key={i}
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded bg-[#3e3e3e] hover:bg-[#4e4e4e] text-[12px] font-bold transition-all active:scale-95 text-[#eff1f6]"
                      onClick={() =>
                        console.log(`Navigating to question ${i + 1}`)
                      }
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-2 bg-transparent hover:bg-blue-500/20 transition-colors" />

            {/* Right: Vertical Split (Editor & Terminal) */}
            <ResizablePanel defaultSize={55}>
              <ResizablePanelGroup orientation="vertical">
                {/* Top Section: Monaco */}
                <ResizablePanel
                  defaultSize={70}
                  className="bg-[#282828] rounded-lg border border-[#333] flex flex-col overflow-hidden"
                >
                  <div className="h-10 border-b border-[#333] px-4 flex items-center justify-between bg-[#333]/30 text-xs">
                    <span className="text-blue-400 font-mono">Java</span>
                    <HelpCircle size={14} className="text-slate-500" />
                  </div>
                  <div className="flex-1 relative">
                    <MonacoInstance />
                  </div>
                </ResizablePanel>

                <ResizableHandle className="h-2 bg-transparent hover:bg-blue-500/20 transition-colors" />

                {/* Bottom Section: Test Result Panel */}
                <ResizablePanel
                  defaultSize={30}
                  className="bg-[#282828] rounded-lg border border-[#333] flex flex-col overflow-hidden"
                >
                  <div className="h-10 border-b border-[#333] px-4 flex items-center bg-[#333]/30 text-xs font-medium gap-4">
                    <span className="text-green-500 border-b-2 border-green-500 h-full flex items-center">
                      Testcase
                    </span>
                    <span className="text-slate-400">Test Result</span>
                  </div>
                  <div className="flex-1 p-4 font-mono text-xs text-slate-500">
                    Run your code to see results for the tAhIni test suite.
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </main>

      {/* Action Footer */}
      <footer className="h-12 bg-[#282828] border-t border-[#333] px-4 flex items-center justify-between">
        <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
          <ChevronUp size={16} /> Console
        </button>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-[#333] hover:bg-[#444] rounded text-xs font-medium text-white transition-colors">
            Run
          </button>
          <button className="px-4 py-1.5 bg-green-600 hover:bg-green-500 rounded text-xs font-bold text-white transition-colors">
            Submit
          </button>
        </div>
      </footer>
    </div>
  );
};
