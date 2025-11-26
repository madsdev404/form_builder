import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../ui/ErrorPage";
import HomePage from "@/features/home/routes/HomePage";
import LoginPage from "@/features/auth/routes/LoginPage";
import AuthCallbackPage from "@/features/auth/routes/AuthCallbackPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // Public routes
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "auth/callback",
        element: <AuthCallbackPage />,
      },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
