import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";
import { getExamApi } from "../../api/exam";

export function ExamAuth() {
  const { logIn, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [identifier, setIdentifier] = useState("");
  const [examCode, setExamCode] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      await logIn({ identifier, password });
      
      const examRes = await getExamApi(examCode);
      
      // Defensively check if the backend returned the exam object correctly
      if (!examRes || !examRes.exam || !examRes.exam._id) {
        throw new Error("Invalid exam response format from server.");
      }

      toast.success("Identity verified. Launching environment.");
      navigate(`/exam/${examRes.exam._id}`); // Always navigate using the internal _id
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.response?.data?.message || error.message || "Invalid credentials or inactive exam code.");
    } finally {
      setIsVerifying(false);
    }
  };

  const isBusy = isLoading || isVerifying;

  return (
    <div className="w-full min-h-screen relative flex flex-col justify-center items-center bg-white p-6 sm:p-12">
      <div className="w-full max-w-[400px]">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
          <span className="text-2xl font-bold tracking-tighter text-[#00a3a3]">tAhIni</span>
          <span className="text-slate-500 font-medium ml-2 text-sm border-l border-slate-300 pl-2">Exam Portal</span>
        </div>

        <div className="space-y-2 text-center lg:text-left mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Enter Exam Session
          </h2>
          <p className="text-slate-500 text-sm">
            Verify your identity to launch the secure environment.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="text-left text-black space-y-5 border border-slate-200 p-6 rounded-xl shadow-sm bg-white"
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
              placeholder="CS401-SP26" 
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
              required
              className="bg-slate-50 border-slate-200 focus-visible:ring-[#00a3a3]"
            />
          </div>

          <Button
            type="submit"
            disabled={isBusy}
            className="w-full bg-[#00a3a3] hover:bg-[#008a8a] text-white shadow-sm h-11 mt-2"
          >
            {isBusy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Launch Exam"
            )}
          </Button>
        </form>

        {/* Navigation Links */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            className="p-2 rounded-[5px] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium"
            onClick={() => navigate("/auth/student")}
          >
            Student Portal
          </button>
        </div>

      </div>
    </div>
  );
}