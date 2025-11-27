import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/shared/components/ui/Header";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;
