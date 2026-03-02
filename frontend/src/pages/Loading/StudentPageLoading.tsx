import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import type { ComponentProps } from "react";
import { useState, useLayoutEffect, useRef } from "react";
import { Settings, User, HelpCircle, Loader2 } from "lucide-react";

type PanelProps = ComponentProps<typeof ResizablePanel>;

export const LoadingExam = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [minPercentage, setMinPercentage] = useState(0);

  useLayoutEffect(() => {
    const calculateMinSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const percentage = (280 / containerWidth) * 100;
        setMinPercentage(percentage);
      }
    };
    calculateMinSize();
    const observer = new ResizeObserver(calculateMinSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Utility class for the glowy "ghost" effect
  const glowClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent";

  const leftPanelProps: Partial<PanelProps> = {
    defaultSize: 45,
    minSize: minPercentage,
    className: `flex flex-col bg-[#282828] rounded-lg border border-[#333] overflow-hidden ${glowClass}`,
  };

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a] text-[#eff1f6] font-sans">
      {/* Navbar - Static but polished */}
      <nav className="h-12 border-b border-[#333] bg-[#282828] flex items-center px-4 justify-between">
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-blue-500 font-bold tracking-tighter animate-pulse">
            tAhIni
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">IDExam Engine</span>
        </div>
        <div className="flex items-center gap-6 opacity-50">
           <div className="h-4 w-24 bg-[#333] rounded animate-pulse" />
           <div className="flex items-center gap-3">
            <Settings size={18} />
            <User size={18} />
          </div>
        </div>
      </nav>

      <main ref={containerRef} className="flex-1 overflow-hidden p-2">
        <ResizablePanelGroup orientation="horizontal">
          {/* Left: Problem Description Skeleton */}
          <ResizablePanel {...leftPanelProps}>
            <div className="h-10 border-b border-[#333] bg-[#333]/30 flex items-center px-4">
               <div className="h-3 w-20 bg-[#444] rounded" />
            </div>
            <div className="flex-1 p-6 space-y-4">
              <div className="h-6 w-3/4 bg-[#333] rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#333]/50 rounded animate-pulse" />
                <div className="h-4 w-full bg-[#333]/50 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-[#333]/50 rounded animate-pulse" />
              </div>
            </div>
            <div className="p-3 bg-[#282828] border-t border-[#333] flex gap-2">
               {Array.from({length: 5}).map((_, i) => (
                 <div key={i} className="w-10 h-10 bg-[#333] rounded animate-pulse" />
               ))}
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-2 bg-transparent" />

          {/* Right: Editor & Terminal Skeleton */}
          <ResizablePanel defaultSize={55}>
            <ResizablePanelGroup orientation="vertical">
              {/* Editor Skeleton */}
              <ResizablePanel defaultSize={70} className={`bg-[#282828] rounded-lg border border-[#333] flex flex-col ${glowClass}`}>
                <div className="h-10 border-b border-[#333] px-4 flex items-center justify-between bg-[#333]/30">
                  <div className="h-3 w-12 bg-blue-500/20 rounded" />
                  <HelpCircle size={14} className="text-slate-700" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                   <Loader2 className="w-8 h-8 text-blue-500/20 animate-spin" />
                </div>
              </ResizablePanel>

              <ResizableHandle className="h-2 bg-transparent" />

              {/* Terminal Skeleton */}
              <ResizablePanel defaultSize={30} className={`bg-[#282828] rounded-lg border border-[#333] ${glowClass}`}>
                <div className="p-4 space-y-2">
                  <div className="h-3 w-32 bg-[#333] rounded" />
                  <div className="h-3 w-48 bg-[#333]/50 rounded" />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <footer className="h-12 bg-[#282828] border-t border-[#333] px-4 flex items-center justify-between">
        <div className="h-4 w-32 bg-[#333] rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="w-16 h-8 bg-[#333] rounded opacity-50" />
          <div className="w-24 h-8 bg-green-900/30 rounded opacity-50" />
        </div>
      </footer>

      {/* Tailwind Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};