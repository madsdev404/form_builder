import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../ui/ErrorPage";
import DashboardPage from "@/features/dashboard/routes/DashboardPage";
import LoginPage from "@/features/auth/routes/LoginPage";
import AuthCallbackPage from "@/features/auth/routes/AuthCallbackPage";
import CreateFormPage from "@/features/forms/routes/CreateFormPage";
import FormViewerPage from "@/features/forms/routes/FormViewerPage";
import ResponseListPage from "@/features/responses/routes/ResponseListPage";

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
      {
        path: "form/:formId",
        element: <FormViewerPage />,
      },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "create-form",
            element: <CreateFormPage />,
          },
          {
            path: "forms/:formId/responses",
            element: <ResponseListPage />,
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
