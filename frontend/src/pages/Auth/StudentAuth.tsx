import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export function StudentAuth({ content }: { content: any }) {
  const { signUp, logIn, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await logIn("student");
        toast.success("Welcome back!"); // Success toast
      } else {
        if (signUp) {
          await signUp("student");
          toast.success("Account created successfully!"); // Success toast
        } else {
          await logIn("student");
          toast.success("Logged in successfully!"); // Success toast
        }
      }

      navigate("/student");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please check your credentials."); // Error toast
    }
  };

  return (
    <div className="min-h-screen w-full text-left">
      {/*Form (Light Mode) */}
      <div className="flex flex-col justify-center items-center bg-white p-8 sm:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <span className="text-xl font-bold tracking-tighter text-[#00a3a3]">
              tAhIni
            </span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin
                ? "Enter your credentials to access your dashboard."
                : "Register with your institutional email to get started."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="text-left text-black space-y-6 border border-slate-200 p-6 rounded-xl shadow-sm bg-white h-[400px]"
          >
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Isaiah Juma"
                  required
                  className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Institutional Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                required
                className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                {isLogin && (
                  <a
                    href="#"
                    className="text-xs font-medium text-[#00a3a3] hover:text-[#008a8a]"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <Input
                id="password"
                type="password"
                required
                className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00a3a3] hover:bg-[#008a8a] text-white shadow-sm h-11"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
              }}
              className="font-medium text-[#00a3a3] hover:text-[#008a8a]  transition-colors"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>

        {/* Instructor Portal Link */}
        <div className="flex flex-col gap-2 justify-end w-full">
          <div className="">
            <button
              key={content.switchPath}
              id={content.id}
              className="p-2 rounded-[5px] text-slate-500 hover:bg-slate-300 hover:text-slate-900"
              onClick={() => navigate(content.switchPath)}
            >
              Exam Portal
            </button>
          </div>
          <div className="">
            <button
              key={content.switchPath}
              id={content.id}
              className="p-2 rounded-[5px] text-slate-500 hover:bg-slate-300 hover:text-slate-900"
              onClick={() => navigate("/auth/instructor")}
            >
              Instructor Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
