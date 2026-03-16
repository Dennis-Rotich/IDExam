import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function ExamAuth({ content }: { content: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    navigate("/student/exam/live");
  };

  return (
    <div className="w-full space-y-8 flex flex-col items-center">
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="flex lg:hidden justify-center gap-2 mb-8">
        <span className="text-xl font-bold tracking-tighter text-slate-900">
          IDE<span className="text-[#00a3a3]">xam</span>
        </span>
      </div>

      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Enter Exam Session
        </h2>
        <p className="text-slate-500 text-sm">
          Verify your identity to launch the secure environment.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-[420px] text-left text-black space-y-6 border border-slate-200 p-6 rounded-xl shadow-sm bg-white h-[400px]"
      >
        <div className="space-y-2">
          <Label htmlFor="identity" className="text-slate-700">
            Institutional Email or Student ID
          </Label>
          <Input
            id="identity"
            type="text"
            placeholder="student@university.edu"
            required
            className="bg-slate-50 border-slate-200 focus-visible:ring-[#00a3a3]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exam-code" className="text-slate-700">
            Exam Code
          </Label>
          <Input
            id="exam-code"
            type="text"
            placeholder="CS-DSA-201"
            required
            className="bg-slate-50 border-slate-200 focus-visible:ring-[#00a3a3]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="session-password" className="text-slate-700">
            Session Password
          </Label>
          <Input
            id="session-password"
            type="password"
            placeholder="Provided by your proctor"
            required
            className="bg-slate-50 border-slate-200 focus-visible:ring-[#00a3a3]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#00a3a3] hover:bg-[#008a8a] text-white shadow-sm h-11 mt-4"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Launch Exam"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-slate-500">Having trouble authenticating? </span>
        <a
          href="#"
          className="font-medium text-[#00a3a3] hover:text-[#008a8a] transition-colors"
        >
          Contact Proctor
        </a>
      </div>

      <div className="flex flex-col gap-2 items-start w-[600px] w-[180px]">
        <button
          key={content.switchPath}
          id={content.id}
          className="p-2 rounded-[5px] text-slate-500 hover:bg-slate-300 hover:text-slate-900 bg-slate-200"
          onClick={() => navigate(content.switchPath)}
        >
          {content.switchText}
        </button>
      </div>
    </div>
  );
}
