import App from "./App";
import { DashboardLayout } from "./components/DashboardLayout";
import { ExamManager } from "./pages/Instructor/ExamManager";
import { InstructorOverview } from "./pages/Instructor/InstructorOverview";
import { LiveProctoring } from "./pages/Instructor/LiveProctoring";
import { QuestionEditor } from "./pages/Instructor/QuestionEditor";
import { Settings } from "./pages/Instructor/Settings";
import LandingPage from "./pages/Landing";
import { StudentExam } from "./pages/Student/StudentExam";

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
          path: "student",
          element: <DashboardLayout role="student" />,
          children: [
            {
              index: true,
              element: <InstructorOverview />,
            },
            {
              path: "exam/:examId",
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
