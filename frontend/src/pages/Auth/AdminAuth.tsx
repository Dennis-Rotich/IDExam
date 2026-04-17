import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";

export function AdminAuth() {
  const content = useOutletContext<any>();

  const { signUp, logIn, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await logIn({ identifier: email, password });
        toast.success("Welcome back!");
        navigate("/admin");
      } else {
        await signUp({
          name,
          email,
          password,
          role: "admin",
        });
        toast.success("Account created successfully! Please log in.");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.response?.data?.message || "Authentication failed.");
    }
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col justify-center items-center bg-white p-6 sm:p-12">
      <div className="w-full max-w-[400px]">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
          <span className="text-2xl font-bold tracking-tighter text-[#00a3a3]">tAhIni</span>
          <span className="text-slate-500 font-medium ml-2 text-sm border-l border-slate-300 pl-2">Admin</span>
        </div>

        <div className="space-y-2 text-center lg:text-left mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {isLogin ? content?.roleBadge || "Admin Login" : "Create an account"}
          </h2>
          <p className="text-slate-500 text-sm">
            {isLogin
              ? content?.tagline || "Platform oversight and system administration."
              : "Register to manage the platform and oversee system operations."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="text-left text-black space-y-5 border border-slate-200 p-6 rounded-xl shadow-sm bg-white"
        >
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Admin Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-slate-50 border-slate-200 focus-visible:ring-[#00a3a3]"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">Admin Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@tahini.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-50 border-slate-200 focus-visible:ring-[#00a3a3]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              {isLogin && (
                <a href="#" className="text-xs font-medium text-[#00a3a3] hover:text-[#008a8a] transition-colors">
                  Forgot password?
                </a>
              )}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-50 border-slate-200 focus-visible:ring-[#00a3a3]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00a3a3] hover:bg-[#008a8a] text-white shadow-sm h-11 mt-2"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm mt-6">
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

        {/* Navigation Links */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            className="p-2 rounded-[5px] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium"
            onClick={() => navigate(content?.switchPath || "/")}
          >
            {content?.switchText || "Student Portal"}
          </button>
        </div>

      </div>
    </div>
  );
}