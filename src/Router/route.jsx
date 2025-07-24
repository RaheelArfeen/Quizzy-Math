// router.jsx
import {
    createBrowserRouter,
} from "react-router";
import Root from "../Root/Root";

import Home from "../Pages/Home";
import Dashboard from "../Pages/Dashboard";
import AddKid from "../Pages/AddKid";
import KidDashboard from "../Pages/KidDashboard";
import QuizConfig from "../Pages/QuizConfig";
import QuizStart from "../Pages/QuizStart";
import Results from "../Pages/Results";
import Tables from "../Pages/Tables";
import Placeholder from "../Pages/Placeholder";
import NotFound from "../Pages/NotFound";
import Register from "../Pages/Register";
import Login from "../Pages/Login";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                path: '/',
                Component: Home
            },
            { path: '/login', Component: Login },
            { path: '/register', Component: Register },
            { path: '/dashboard', Component: Dashboard },
            { path: '/add-kid', Component: AddKid },
            { path: '/kid/:id', Component: KidDashboard },
            { path: '/quiz', Component: QuizConfig },
            { path: '/quiz/start', Component: QuizStart },
            { path: '/results', Component: Results },
            { path: '/tables', Component: Tables },
            {
                path: '/history/:id',
                Component: () => (
                    <Placeholder
                        title="Quiz History"
                        description="View complete quiz history for this child."
                    />
                )
            },
            {
                path: '/leaderboard',
                Component: () => (
                    <Placeholder
                        title="Leaderboard"
                        description="Family and global quiz leaderboards."
                    />
                )
            },
        ]
    },
]);
