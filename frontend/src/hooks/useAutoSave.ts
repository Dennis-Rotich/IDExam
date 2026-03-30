import { useEffect, useCallback, useRef } from "react";
import { useExamStore } from "../store/useExamStore"; // Your Zustand store
import { debounce } from "lodash"; 

export const useAutoSave = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    setSaveStatus
  } = useExamStore();

  const currentCode = questions[currentQuestionIndex].code;
  const questionId = questions[currentQuestionIndex].id;

  // Use a ref to keep track of the latest code without triggering re-renders in the debounce
  const codeRef = useRef(currentCode);

  useEffect(() => {
    codeRef.current = currentCode;
  }, [currentCode]);

  // The actual API Call
  const saveToBackend = async (code: string, qId: string) => {
    console.log(`[Sync Engine] Saving Question ${qId}...`);
    try {
      // Simulating the Redis API call
      await fetch("/api/autosave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: qId, code })
      });

      setSaveStatus("saved");
      console.log("[Sync Engine] Save Complete");
    } catch (error) {
      console.error("[Sync Engine] Save Failed", error);
      setSaveStatus("error");
    }
  };

  //the Debounced Function 
  //waits 1500ms before allowing the saveToBackend to run
  const debouncedSave = useCallback(
    debounce((code: string, qId: string) => {
      saveToBackend(code, qId);
    }, 1500),
    []
  );

  // The Listener
  useEffect(() => {
    //Immediately show "Saving..." when code changes
    setSaveStatus("saving");
    //Queue the save
    debouncedSave(currentCode, questionId);
    //Cancel the timer if the component unmounts
    return () => debouncedSave.cancel();
  }, [currentCode, questionId, debouncedSave, setSaveStatus]);
};