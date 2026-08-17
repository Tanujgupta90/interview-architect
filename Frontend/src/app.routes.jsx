import { createHashRouter } from "react-router"; // 👈 Changed to Hash Router
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";

// CRITICAL LINUX FIX: Matches the exact lowercase filename 'interview.jsx' stored in your repository history
import Interview from "./features/interview/pages/interview";

export const router = createHashRouter([ // 👈 Changed to createHashRouter
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
]);
