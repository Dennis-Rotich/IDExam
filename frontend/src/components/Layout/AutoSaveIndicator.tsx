import { useEffect, useState } from "react";
import { useExamStore } from "../../store/useExamStore";
import { useAutoSave } from "../../hooks/useAutoSave";
import { CloudCheck, CloudUploadIcon, AlertCircle } from "lucide-react";

export const AutoSaveIndicator = () => {
  // Handles the debounce and API calls
  useAutoSave();
  // We only need 'saveStatus' for the UI
  const { saveStatus } = useExamStore();

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#333]/50 text-[11px] font-medium transition-all">
      {saveStatus === "saving" && (
        <>
          <CloudUploadIcon size={14} className="text-blue-400 animate-pulse" />
          <span className="text-slate-400 font-sans">Syncing to tAhIni...</span>
        </>
      )}
      {saveStatus === "saved" && (
        <>
          <CloudCheck size={14} className="text-green-500" />
          <span className="text-slate-500 font-sans">Cloud Synced</span>
        </>
      )}
      {saveStatus === "error" && (
        <>
          <AlertCircle size={14} className="text-red-500" />
          <span className="text-red-400 font-sans">
            Sync Failed. Retrying...
          </span>
        </>
      )}
      {saveStatus === "idle" && (
        <span className="text-slate-600 font-sans">Ready</span>
      )}
    </div>
  );
};
