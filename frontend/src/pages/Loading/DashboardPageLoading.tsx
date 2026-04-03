import { Loader2 } from "lucide-react";

export function DashboardPageLoading() {
  const skeletonBase = "bg-muted/50 animate-pulse";

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* 1. Sidebar Skeleton (Hidden on mobile, visible on md+) */}
      <div className="hidden md:flex flex-col w-[260px] border-r border-border bg-card/10 p-4 space-y-8">
        {/* Brand / Logo Area */}
        <div className="flex items-center gap-3 px-2 mt-2">
          <div className={`h-6 w-6 rounded ${skeletonBase}`} />
          <div className={`h-5 w-32 rounded ${skeletonBase}`} />
        </div>
        
        {/* Navigation Links */}
        <div className="space-y-2 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`h-10 w-full rounded-md ${skeletonBase}`} />
          ))}
        </div>
      </div>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Skeleton */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-background lg:h-[60px] px-6">
          <div className={`h-4 w-40 rounded ${skeletonBase}`} />
          <div className={`h-8 w-8 rounded-full ${skeletonBase}`} />
        </header>

        {/* Dashboard Body Skeleton */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 space-y-6 bg-background relative">
          
          {/* Subtle spinning loader in the absolute center for extra feedback */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <Loader2 className="w-12 h-12 text-muted-foreground/20 animate-spin" />
          </div>

          {/* KPI Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-card/10 flex flex-col gap-3 h-28">
                <div className={`h-3 w-16 rounded ${skeletonBase}`} />
                <div className={`h-8 w-24 rounded mt-1 ${skeletonBase}`} />
              </div>
            ))}
          </div>

          {/* Main Content Area (e.g., Table or Chart) */}
          <div className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card/10 h-[400px]">
             <div className="flex justify-between items-center pb-4 border-b border-border/50">
               <div className={`h-4 w-48 rounded ${skeletonBase}`} />
               <div className={`h-8 w-24 rounded-full ${skeletonBase}`} />
             </div>
             
             {/* List/Table rows */}
             <div className="space-y-4 pt-2">
               {Array.from({ length: 5 }).map((_, i) => (
                 <div key={i} className={`h-12 w-full rounded ${skeletonBase}`} />
               ))}
             </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}