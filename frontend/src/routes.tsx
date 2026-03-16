import App from "./App";
import { DashboardLayout } from "./components/DashboardLayout";
import { StudentAuth } from "./pages/Auth/StudentAuth";
import { ExamAuth } from "./pages/Auth/ExamAuth";
import { ExamManager } from "./pages/Instructor/ExamManager";
import { InstructorOverview } from "./pages/Instructor/InstructorOverview";
import { LiveProctoring } from "./pages/Instructor/LiveProctoring";
import { QuestionEditor } from "./pages/Instructor/QuestionEditor";
import { Settings } from "./pages/Instructor/Settings";
import LandingPage from "./pages/Landing";
import { StudentPractice } from "./pages/Student/Practice";
import { StudentResults } from "./pages/Student/Results";
import { StudentExam } from "./pages/Student/StudentExam";
import { StudentOverview } from "./pages/Student/StudentOverview";
import { InstructorAuth } from "./pages/Auth/InstructorAuth";
import { AuthLayout } from "./components/Layout/Auth";

const MainRoutes = () => {
  const instructorContent = {
      id: "ins",
      roleBadge: "Instructor Login",
      tagline: "Your class is ready. So are you.",
      imageSrc: "/instructor-auth.svg",
      primarySupportText: "Contact Enterprise Support",
      secondarySupportText: "Request a deployment",
      switchText: "Student Portal",
      switchPath: "/auth/student",
    };

    const studentContent = {
      id: "std",
      roleBadge: "Student Login",
      tagline:
        "Sharpen your skills with real-time feedback and guided learning.",
      imageSrc: "/student-auth.svg",
      primarySupportText: "View learning resources",
      secondarySupportText: "Request feedback",
      switchText: "Instructor Portal", // THIS IS A BUG THAT NEEDS FIXING - KEEPS GETTING OVERLAYED BY "INS. LOGIN" BUTTON
      switchPath: "/auth/exam",
    };

    const examContent = {
      id: "exm",
      roleBadge: "Exam Login",
      tagline: "Focus on the code. We'll handle the rest.",
      imageSrc: "/exam-auth2.svg",
      primarySupportText: "Contact your proctor",
      secondarySupportText: "Technical support",
      switchText: "Student Portal",
      switchPath: "/auth/student",
    };

  const routes = [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: "auth",
          element: <AuthLayout />, // <-- THIS IS THE MISSING PIECE
          children: [
            {
              index: true,
              element: <StudentAuth content={studentContent}/>, // Renders at /auth
            },
            {
              path: "student",
              element: <StudentAuth content={studentContent}/>,
            },
            {
              path: "exam",
              element: <ExamAuth content={examContent}/>, // Renders at /auth/exam
            },
            {
              path: "instructor",
              element: <InstructorAuth content={instructorContent}/>, // Renders at /auth/instructor
            },
          ],
        },
        {
          path: "student",
          element: <DashboardLayout role="student" />,
          children: [
            {
              index: true,
              element: <StudentOverview />,
            },
            {
              path: "results",
              element: <StudentResults />,
            },
            {
              path: "practice",
              element: <StudentPractice />,
            },
          ],
        },
        {
          path: "exam",
          children: [
            {
              index: true,
              element: <ExamAuth content={examContent}/>,
            },
            {
              path: ":examId",
              element: <StudentExam />,
            },
          ],
        },
        {
          path: "instructor",
          element: <DashboardLayout role="instructor" />,
          children: [
            {
              index: true,
              element: <InstructorOverview />,
            },
            {
              path: "exams",
              element: <ExamManager />,
            },
            {
              path: "questions",
              element: <QuestionEditor />,
            },
            {
              path: "proctoring",
              element: <LiveProctoring />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
          ],
        },
      ],
    },
  ];

  return routes;
};

export default MainRoutes;
