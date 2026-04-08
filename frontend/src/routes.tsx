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
              element: <StudentAuth />, // Renders at /auth
            },
            {
              path: "student",
              element: <StudentAuth />,
            },
            {
              path: "exam",
              element: <ExamAuth />, // Renders at /auth/exam
            },
            {
              path: "instructor",
              element: <InstructorAuth />, // Renders at /auth/instructor
            },
            {
              path: "admin",
              element: <AdminAuth />, // Renders at /auth/instructor
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
              element: <ExamAuth />,
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
