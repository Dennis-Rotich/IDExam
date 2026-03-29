import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";

export function AdminAuth({ content }: { content: any }) {
  const { signUp, logIn, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await logIn("admin");
        toast.success("Admin login successful!");
      } else {
        if (signUp) {
          await signUp("admin");
          toast.success("Admin account created!");
        } else {
          await logIn("admin");
          toast.success("Logged in successfully!");
        }
      }

      navigate("/admin");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="w-full max-w-[400px] space-y-8">
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="flex lg:hidden items-center gap-2 mb-8">
        <span className="text-xl font-bold tracking-tighter text-slate-900">
          tAh<span className="text-[#00a3a3]">Ini</span>
        </span>
        <span className="text-slate-500 font-medium ml-2 text-sm border-l border-slate-300 pl-2">
          Admin
        </span>
      </div>

      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {isLogin ? (content?.roleBadge || "Admin Login") : "Create an account"}
        </h2>
        <p className="text-slate-500 text-sm">
          {isLogin
            ? (content?.tagline || "Platform oversight and system administration.")
            : "Register to manage the platform and oversee system operations."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="text-left text-black space-y-6 border border-slate-200 p-6 rounded-xl shadow-sm bg-white min-h-[400px]"
      >
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">Full Name</Label>
            <Input
              id="name"
              placeholder="System Administrator"
              required
              className="bg-slate-50 border-slate-200 placeholder:text-slate-400 focus-visible:ring-[#00a3a3]"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">Admin Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@university.edu"
            required
            className="bg-slate-50 border-slate-200 placeholder:text-slate-400 focus-visible:ring-[#00a3a3]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-700">Password</Label>
            {isLogin && (
              <a
                href="#"
                className="text-xs font-medium text-[#00a3a3] hover:text-[#008a8a] transition-colors"
              >
                Forgot password?
              </a>
            )}
          </div>
          <Input
            id="password"
            type="password"
            required
            className="bg-slate-50 border-slate-200 placeholder:text-slate-400 focus-visible:ring-[#00a3a3]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#00a3a3] hover:bg-[#008a8a] text-white shadow-sm h-11 mt-4"
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
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="font-medium text-[#00a3a3] hover:text-[#008a8a] transition-colors"
        >
          {isLogin ? "Sign up" : "Log in"}
        </button>
      </div>

      <div className="absolute top-8 right-8 hidden sm:block">
        <button
          id={content?.id}
          className="p-2 rounded-[5px] text-slate-500 hover:bg-slate-300 hover:text-slate-900 transition-colors text-sm font-medium"
          onClick={() => navigate(content?.switchPath || "/auth/instructor")}
        >
          {content?.switchText || "Instructor Portal"}
        </button>
      </div>
    </div>
  );
}