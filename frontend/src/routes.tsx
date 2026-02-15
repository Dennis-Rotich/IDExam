import App from "./App";
import ExamCreator from "./pages/Instructor/CreateExam";
import { InstructorDashboard } from "./pages/Instructor/Dashboard";
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
                element: <LandingPage />
            },
            {
                path: "exam/:examId",
                element: <StudentExam />,
            },
            {
                path: "instructor/dashboard",
                element: <InstructorDashboard />,
            },
            {
                path: "instructor/create",
                element: <ExamCreator />
            }
           ]
        }
    ];
    
    return routes;
}

export default MainRoutes;