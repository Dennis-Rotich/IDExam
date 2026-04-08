import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";
import { getExamApi } from "../../api/exam";

export function ExamAuth() {
  const content = useOutletContext<any>();
  const { logIn, isLoading } = useAuth();
  const navigate = useNavigate();

  // Controlled inputs
  const [identifier, setIdentifier] = useState("");
  const [examCode, setExamCode] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // 1. Authenticate the student using standard credentials
      await logIn({ identifier, password });

      // 2. Verify the Exam Code actually exists and is active
      const examRes = await getExamApi(examCode);

      toast.success("Identity verified. Launching environment.");
      navigate(`/exam/${examRes.exam._id}`);
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials or inactive exam code.");
    } finally {
      setIsVerifying(false);
    }
  };

  const isBusy = isLoading || isVerifying;

  return (
    <div className="w-full space-y-8 flex flex-col items-center min-h-screen">
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
        className="w-full max-w-[420px] text-left text-black space-y-6 border border-slate-200 p-6 rounded-xl shadow-sm bg-white"
      >
        <div className="space-y-2">
          <Label htmlFor="identity" className="text-slate-700">
            Institutional Email or Student ID
          </Label>
          <Input
            id="identity"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
            value={examCode}
            onChange={(e) => setExamCode(e.target.value)}
            placeholder="e.g. 64f1a2b3c4d5" // Suggesting MongoDB ObjectId format
            required
            className="bg-slate-50 border-slate-200 focus-visible:ring-[#00a3a3]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="session-password" className="text-slate-700">
            Account Password
          </Label>
          <Input
            id="session-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your portal password"
            required
            className="bg-slate-50 border-slate-200 focus-visible:ring-[#00a3a3]"
          />
        </div>

        <Button
          type="submit"
          disabled={isBusy}
          className="w-full bg-[#00a3a3] hover:bg-[#008a8a] text-white shadow-sm h-11 mt-4"
        >
          {isBusy ? (
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
    </div>
  );
}