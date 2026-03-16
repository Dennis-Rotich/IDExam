import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Layout/Footer";
import { UserCircle } from "lucide-react";

const features = [
  {
    title: "Professional Coding Environment",
    description: `Utilizes the same engine that powers VS Code, providing students with industrial-grade features like syntax highlighting, bracket matching, and IntelliSense for multiple languages (Python, Java, C++, etc.)
       Specialized Split-Pane interface, ensuring students never have to switch tabs.`,
    image: "/coding-env.svg",
  },
  {
    title: "Built-In Academic Integrity",
    description: `While the web version handles basic assessments, the platform is architected for a downloadable version (via Electron) to enable system-level proctoring and integrity checks.
      Provides a proctor view with a grid of all active students, allowing instructors to see real-time code snapshots and progress without interrupting the student.`,
    image: "/academic-integrity.svg",
    reverse: true,
  },
  {
    title: "Smart Exam Management",
    description: `Integrates a test-case engine where code is executed against hidden inputs to provide instant feedback or scoring.
      Features real-time synchronization & autosave features to prevent data loss preventionduring network-interruption.`,
    image: "/smart-exam-mgmt.svg",
  },
  {
    title: "Instructor Tooling",
    description: `A dedicated dashboard for teachers to build exams, write Markdown instructions, and define test cases (inputs and expected outputs).
      A high-level overview for instructors to track completion rates, average scores, and individual student status in real-time.`,
    image: "/instructor-tooling.svg",
    reverse: true,
  },
];

// ── Additive data ────────────────────────────────────────────────────────────

const institutions = [
  { name: "State University", abbr: "SU" },
  { name: "Tech Institute", abbr: "TI" },
  { name: "National College of Engineering", abbr: "NCE" },
  { name: "Polytechnic University", abbr: "PU" },
  { name: "City College of CS", abbr: "CCS" },
];

const testimonials = [
  {
    quote:
      "IDExam replaced three separate tools we were stitching together. Our TAs spend zero time debugging student environment issues now.",
    name: "Dr. Aisha Mensah",
    role: "Associate Professor, Computer Science",
    institution: "State University",
    initials: "AM",
  },
  {
    quote:
      "The proctor view alone was worth the switch. I can see every student's progress in real-time without hovering over shoulders.",
    name: "Prof. Daniel Okafor",
    role: "Lecturer, Software Engineering",
    institution: "Tech Institute",
    initials: "DO",
  },
  {
    quote:
      "Our students consistently say the editor feels just like their dev environment. That removes one variable from every exam.",
    name: "Sarah Lin",
    role: "Head of Curriculum, NCE",
    institution: "National College of Engineering",
    initials: "SL",
  },
];

const securityPoints = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L3 5.5V10c0 4 3.1 7.5 7 8.5 3.9-1 7-4.5 7-8.5V5.5L10 2z"
          stroke="#00a3a3"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M7 10l2 2 4-4"
          stroke="#00a3a3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "End-to-end encrypted submissions",
    description:
      "All code submissions and exam content are encrypted in transit and at rest.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="3"
          y="8"
          width="14"
          height="10"
          rx="2"
          stroke="#00a3a3"
          strokeWidth="1.5"
        />
        <path
          d="M7 8V6a3 3 0 016 0v2"
          stroke="#00a3a3"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="13" r="1.5" fill="#00a3a3" />
      </svg>
    ),
    title: "Role-based access control",
    description:
      "Granular permission layers for admins, instructors, proctors, and students.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#00a3a3" strokeWidth="1.5" />
        <path
          d="M10 6v4l3 2"
          stroke="#00a3a3"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Immutable audit logs",
    description:
      "Every action(submission, edit, flag) is timestamped and tamper-proof.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z"
          stroke="#00a3a3"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Sandboxed code execution",
    description:
      "Student code runs in isolated containers; no access to host systems or network.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2a8 8 0 100 16A8 8 0 0010 2z"
          stroke="#00a3a3"
          strokeWidth="1.5"
        />
        <path
          d="M6.5 10.5c.5 1.5 2 2.5 3.5 2.5s3-.9 3.5-2.5"
          stroke="#00a3a3"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="7.5" cy="8" r="1" fill="#00a3a3" />
        <circle cx="12.5" cy="8" r="1" fill="#00a3a3" />
      </svg>
    ),
    title: "FERPA-conscious data handling",
    description:
      "Designed with student data privacy regulations in mind. No data sold or shared.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 10h14M3 6h14M3 14h8"
          stroke="#00a3a3"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Detailed compliance reporting",
    description:
      "Export audit trails and integrity reports for academic review boards.",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#000] flex flex-col items-center text-white font-sans overflow-x-hidden">
      {/* ── Navigation (unchanged) ── */}
      <nav className="w-full flex gap-3 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tighter">
              IDE<span className="text-[#00a3a3]">xam</span>
            </span>
          </div>
          <div className="flex">
            <div className="hidden md:flex md:items-center gap-3 text-sm font-medium text-slate-400 px-3">
              <a href="#" className="hover:text-white">
                Features
              </a>
              <a href="#" className="hover:text-white">
                Solutions
              </a>
              <a href="#" className="hover:text-white">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/exam/23e01fba-7753-4b5c-8c0a-abd16640760d"
                className="bg-[#00a3a3] hover:bg-[#008a8a] text-white hover:text-white px-6 py-2 rounded-full text-sm font-bold transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero (unchanged) ── */}
      <div className="relative w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center min-h-[80vh]">
        <div className="z-10 w-full flex flex-col items-start justify-center md:w-2/3 pt-10">
          <h1 className="text-5xl md:text-6xl text-left font-bold leading-[1.1] mb-8">
            Secure coding assessments
          </h1>
          <p className="text-slate-400 text-left text-xl md:text-2xl max-w-2xl mb-10 leading-relaxed">
            Built for secure, real-time coding assessments with integrated
            proctoring and automated judging.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/demo"
              className="bg-[#00a3a3] hover:bg-[#008a8a] text-white px-10 py-4 rounded-full text-lg font-bold transition"
            >
              Download Demo
            </Link>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[10%] w-[60%] h-[80%] opacity-80 pointer-events-none hidden md:block">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500 via-blue-600 to-green-400 rounded-full blur-[80px] opacity-30 animate-pulse"></div>
            <div className="absolute w-[400px] h-[400px] bg-gradient-to-bl from-yellow-400 via-emerald-500 to-cyan-500 rounded-full blur-[60px] opacity-40"></div>
            <div className="z-20 p-3 rounded-3xl shadow-2xl">
              <img
                src="/hand-coding.svg"
                alt="coding-screen"
                height={540}
                width={540}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Features Grid (unchanged) ── */}
      <section className="w-full bg-[#000] py-24 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl text-left font-bold mb-16">Features</h2>
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-full lg:w-2/1 flex flex-col gap-2">
              {features.map((f, idx) => (
                <FeatureCard
                  key={idx}
                  title={f.title}
                  description={f.description}
                  imageSrc={f.image}
                  reverse={f.reverse}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── [NEW] Security & compliance ── */}
      <section className="w-full py-24 border-t border-slate-900 bg-[#000] text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#00a3a3] uppercase">
              Security & compliance
            </span>
            <h2 className="text-4xl font-bold mt-3 mb-4">
              Built for institutional accountability
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl">
              Academic integrity isn't a feature toggle — it's the foundation.
              Every layer of IDExam is designed around it.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 hover:border-[#00a3a3]/40 transition-colors"
              >
                <div className="mb-4">{point.icon}</div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── [NEW] Institutions bar ── */}
      <section className="w-full border-t border-b border-slate-800 bg-black/60 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-8">
            Trusted by leading institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {institutions.map((inst) => (
              <div
                key={inst.abbr}
                className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity"
              >
                {/* Placeholder logo block — swap with <img> when real logos are available */}
                <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                  {inst.abbr}
                </div>
                <span className="text-sm font-medium text-slate-400">
                  {inst.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── [NEW] Testimonials ── */}
      <section className="w-full py-24 border-t border-slate-900 bg-[#000] text-right">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#00a3a3] uppercase">
              From the faculty
            </span>
            <h2 className="text-4xl font-bold mt-3">
              What instructors are saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-7 flex flex-col gap-6 hover:border-slate-700 transition-colors"
              >
                {/* Quote mark */}
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                  <path
                    d="M0 18V11.1C0 7.9 .9 5.2 2.7 3 4.5.8 6.9.1 10 0l.9 2.1C8.7 2.6 7.1 3.5 6 4.8 4.9 6.1 4.3 7.5 4.2 9H8V18H0zm13 0V11.1c0-3.2.9-5.9 2.7-8.1C17.5.8 19.9.1 23 0l.9 2.1c-2.2.5-3.8 1.4-4.9 2.7-1.1 1.3-1.7 2.7-1.8 4.2H21V18h-8z"
                    fill="#00a3a3"
                    opacity="0.4"
                  />
                </svg>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  {true ? <UserCircle /> : <img src="" alt="profile-picture"/> }
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      {t.role} · {t.institution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── [NEW] Institution CTA ── */}
      <section className="w-full py-24 border-t border-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#00a3a3] uppercase">
            For institutions
          </span>
          <h2 className="text-4xl font-bold mt-3 mb-5">
            Ready to bring IDExam to your department?
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            We work directly with department heads and IT teams to ensure a
            smooth rollout — from pilot to full deployment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:institutions@idexam.io"
              className="bg-[#00a3a3] hover:bg-[#008a8a] text-white px-10 py-4 rounded-full text-base font-bold transition"
            >
              Request an institutional demo
            </a>
            <a
              href="#"
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-10 py-4 rounded-full text-base font-medium transition"
            >
              View pricing
            </a>
          </div>
          <p className="text-xs text-slate-600 mt-6">
            No commitment required. We'll walk you through a live exam session
            with your own test data.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
