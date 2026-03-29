import App from "./App";
import { DashboardLayout } from "./components/DashboardLayout";
import { StudentAuth } from "./pages/Auth/StudentAuth";
import { ExamAuth } from "./pages/Auth/ExamAuth";
import { InstructorOverview } from "./pages/Instructor/InstructorOverview";
import { LiveProctoring } from "./pages/Instructor/LiveProctoring";
import { QuestionEditor } from "./pages/Instructor/QuestionEditor";
import { Settings } from "./pages/Settings";
import LandingPage from "./pages/Landing";
import { StudentPractice } from "./pages/Student/Practice";
import { StudentExam } from "./pages/Student/Exam";
import { StudentOverview } from "./pages/Student/Overview";
import { InstructorAuth } from "./pages/Auth/InstructorAuth";
import { AuthLayout } from "./components/Layout/Auth";
import { StudentTestsPage } from "./pages/Student/Tests";
import { InstructorTestsPage } from "./pages/Instructor/Tests";
import { StudentSubmissionReview } from "./pages/Instructor/SubmissionReview";
import { QuestionBank } from "./pages/Instructor/QuestionBank";
import { NewQuestion } from "./pages/Instructor/NewQuestion";
import { ProfilePage } from "./pages/Profile";
import { StudentProfilePage } from "./pages/Student/Profile";
import { StudentResultsPage } from "./pages/Student/Results";
import { StudentSubmissionDetail } from "./pages/Student/SubmissionDetail";
import { HelpAndSupportPage } from "./pages/Student/HelpAndSupport";
import { AdminOverview } from "./pages/Admin/Overview";
import { AdminUsersPage } from "./pages/Admin/Users";
import { AdminProctoringPage } from "./pages/Admin/Proctoring";
import { AdminTestsPage } from "./pages/Admin/Tests";
import { AdminAnalyticsPage } from "./pages/Admin/Analytics";
import { AdminAuditLogPage } from "./pages/Admin/Audit";
import { AdminAnnouncementsPage } from "./pages/Admin/Announcements";
import { AdminSystemDocsPage } from "./pages/Admin/AdminSystemDocs";
import { AdminAuth } from "./pages/Auth/AdminAuth";

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
    tagline: "Sharpen your skills with real-time feedback and guided learning.",
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

  const adminContent = {
    id: "adm",
    roleBadge: "Admin Login",
    tagline: "Platform oversight and system administration.",
    imageSrc: "/admin-auth.svg",
    primarySupportText: "View system status",
    secondarySupportText: "Vendor escalation portal",
    switchText: "Instructor Portal",
    switchPath: "/auth/instructor",
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
          element: <AuthLayout />,
          children: [
            {
              index: true,
              element: <StudentAuth content={studentContent} />, // Renders at /auth
            },
            {
              path: "student",
              element: <StudentAuth content={studentContent} />,
            },
            {
              path: "exam",
              element: <ExamAuth content={examContent} />, // Renders at /auth/exam
            },
            {
              path: "instructor",
              element: <InstructorAuth content={instructorContent} />, // Renders at /auth/instructor
            },
            {
              path: "admin",
              element: <AdminAuth content={adminContent} />, // Renders at /auth/instructor
            },
          ],
        },
        {
          path: "/admin",
          element: <DashboardLayout />,
          children: [
            {
              index: true,
              element: <AdminOverview />,
            },
            {
              path: "users",
              element: <AdminUsersPage />,
            },
            {
              path: "proctoring",
              element: <AdminProctoringPage />,
            },
            {
              path: "tests",
              element: <AdminTestsPage />,
            },
            {
              path: "analytics",
              element: <AdminAnalyticsPage />,
            },
            {
              path: "audit",
              element: <AdminAuditLogPage />,
            },
            {
              path: "announcements",
              element: <AdminAnnouncementsPage />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
            {
              path: "docs",
              element: <AdminSystemDocsPage />,
            },
          ],
        },
        {
          path: "/student",
          element: <DashboardLayout />,
          children: [
            {
              index: true,
              element: <StudentOverview />,
            },
            {
              path: "profile",
              element: <StudentProfilePage />,
            },
            {
              path: "exams",
              element: <StudentTestsPage />,
            },
            {
              path: "results",
              element: <StudentResultsPage />,
            },
            {
              path: "results/:submissionId",
              element: <StudentSubmissionDetail />,
            },
            {
              path: "practice",
              element: <StudentPractice />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
            {
              path: "help",
              element: <HelpAndSupportPage role="student"/>,
            },
          ],
        },
        {
          path: "/exam",
          children: [
            {
              index: true,
              element: <ExamAuth content={examContent} />,
            },
            {
              path: ":examId",
              element: <StudentExam />,
            },
          ],
        },
        {
          path: "/instructor",
          element: <DashboardLayout />,
          children: [
            {
              index: true,
              element: <InstructorOverview />,
            },
            {
              path: "profile",
              element: <ProfilePage />,
            },
            {
              path: "exams",
              element: <InstructorTestsPage />,
            },
            {
              path: "exam/submission/review/:examId",
              element: <StudentSubmissionReview />,
            },
            {
              path: "questions/new",
              element: <NewQuestion />,
            },
            {
              path: "questions",
              element: <QuestionBank />,
            },
            {
              path: "questions/edit/:questionId",
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
            {
              path: "help",
              element: <HelpAndSupportPage role="instructor"/>,
            },
          ],
        },
      ],
    },
  ];

  return routes;
};

export default MainRoutes;
