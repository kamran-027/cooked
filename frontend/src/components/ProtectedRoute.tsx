import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import type { ReactElement } from "react";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { user, isHydrating } = useUser();
  const token = sessionStorage.getItem("token");

  if (isHydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
