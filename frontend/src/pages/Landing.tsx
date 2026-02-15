import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import NetworkBackground from "../components/Layout/NetworkBackground";
import Footer from "../components/Layout/Footer";

const features = [
  {
    title: "Professional Coding Environment",
    description: `Utilizes the same engine that powers VS Code, providing students with industrial-grade features like syntax highlighting, bracket matching, and IntelliSense for multiple languages (Python, Java, C++, etc.)
       Specialized Split-Pane interface, ensuring students never have to switch tabs.`,
    image: "/coding-env.svg", // This would be your screenshot of the editor
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
    description:
      `Integrates a test-case engine where code is executed against hidden inputs to provide instant feedback or scoring.
      Features real-time synchronization & autosave features to prevent data loss preventionduring network-interruption.`,
    image: "/smart-exam-mgmt.svg",
  },
  {
    title: "Instructor Tooling",
    description:
      `A dedicated dashboard for teachers to build exams, write Markdown instructions, and define test cases (inputs and expected outputs).
      A high-level overview for instructors to track completion rates, average scores, and individual student status in real-time.`,
    image: "/instructor-tooling.svg",
    reverse: true,
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#000] flex flex-col items-center text-white font-sans overflow-x-hidden">
      <NetworkBackground />

      {/* Navigation */}
      <nav className="w-full flex gap-3 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tighter">
              IDE<span className="text-blue-500">xam</span>
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
                to="/instructor/create"
                className="bg-[#00a3a3] hover:bg-[#008a8a] text-white hover:text-white px-6 py-2 rounded-full text-sm font-bold transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center min-h-[80vh]">
        {/* Left Content */}
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

        {/* Right Graphic (The Swirls) */}
        <div className="absolute right-[-10%] top-[10%] w-[60%] h-[80%] opacity-80 pointer-events-none hidden md:block">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Abstract Colorful Swirls using CSS Gradients */}
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500 via-blue-600 to-green-400 rounded-full blur-[80px] opacity-30 animate-pulse"></div>
            <div className="absolute w-[400px] h-[400px] bg-gradient-to-bl from-yellow-400 via-emerald-500 to-cyan-500 rounded-full blur-[60px] opacity-40"></div>

            {/* Central Floating Card (Simulating the 'PC' logo box) */}
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

      {/* Features Grid (Matching the Dark Grid Style) */}
      <section className="w-full bg-[#000] py-24 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16">Features</h2>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left Side: Vertical Feature List */}
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

      <Footer />
    </div>
  );
}
