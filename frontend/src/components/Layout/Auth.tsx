import { Outlet, useLocation, useNavigate } from "react-router-dom";

export function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Determine the exact role context from the URL
  let content;

  if (path.includes("instructor")) {
    content = {
      id: "ins",
      roleBadge: "Instructor Login",
      tagline: "Your class is ready. So are you.",
      imageSrc: "/instructor-auth.svg",
      primarySupportText: "Contact Enterprise Support",
      secondarySupportText: "Request a deployment",
      switchTextStudent: "Student Portal",
      switchPath: "/auth/instructor",
    };
  } else if (path.includes("exam")) {
    content = {
      id: "exm",
      roleBadge: "Exam Login",
      tagline: "Focus on the code. We'll handle the rest.",
      imageSrc: "/exam-auth2.svg",
      primarySupportText: "Contact your proctor",
      secondarySupportText: "Technical support",
      switchText: "Student Portal",
      switchPath: "/auth/student",
    };
  } else {
    // Default to standard Student Auth (/auth or /auth/student)
    content = {
      id: "std",
      roleBadge: "Student Login",
      tagline:
        "Sharpen your skills with real-time feedback and guided learning.",
      imageSrc: "/student-auth.svg",
      primarySupportText: "View learning resources",
      secondarySupportText: "Request feedback",
      switchText: "Exam Portal", // THIS IS A BUG THAT NEEDS FIXING - KEEPS GETTING OVERLAYED BY "INS. LOGIN" BUTTON
      switchPath: "/auth/exam",
    };
  }

  return (
    <div className="h-screen w-full grid lg:grid-cols-2 text-left">
      {/* LEFT PANEL: Dynamic Branding & Context (Dark Mode) */}
      <div className="h-screen hidden lg:flex flex-col justify-between bg-[#000] p-12 xl:p-16 border-r border-[#333]">
        {/* TOP: Brand & Tagline */}
        <div className="space-y-8 mb-9">
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tighter">
              <span className="text-2xl text-white font-bold tracking-tighter">
                IDE<span className="text-[#00a3a3]">xam</span>
              </span>
            </span>
            {content.roleBadge && (
              <span className="text-slate-500 font-medium ml-3 border-l border-slate-700 pl-3">
                {content.roleBadge}
              </span>
            )}
          </div>

          <h1 className="text-4xl text-right font-bold tracking-tight leading-tight text-white">
            {content.tagline}
          </h1>
        </div>

        <div className="z-20 py-4">
          <div className="rounded-3xl shadow-2xl overflow-hidden">
            <img
              src={content.imageSrc}
              alt={`${content.roleBadge} view`}
              height={400}
              width={400}
              className="opacity-90"
            />
          </div>
        </div>

        {/* BOTTOM: Support Escape Hatch */}
        <div className="space-y-6 max-w-md">
          <div className="pt-6 border-t border-[#333] flex flex-col gap-2 text-sm">
            <p className="text-slate-400">
              Having trouble?{" "}
              <a
                href="#"
                className="text-[#00a3a3] hover:text-[#008a8a] transition-colors"
              >
                {content.primarySupportText}
              </a>
            </p>
            {content.secondarySupportText && (
              <p className="text-slate-400">
                Platform issue?{" "}
                <a
                  href="#"
                  className="text-slate-300 hover:text-white underline underline-offset-4 transition-colors"
                >
                  {content.secondarySupportText}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Injected Form via Outlet (Light Mode) */}
      <div className="flex flex-col justify-center items-center bg-white p-8 sm:p-12 relative h-screen">
        {/* Wrap Outlet in a keyed div to ensure content clears properly */}
        <div key={`content-${path}`} className="w-full flex justify-center">
          <Outlet context={content}/>
        </div>
      </div>
    </div>
  );
}
