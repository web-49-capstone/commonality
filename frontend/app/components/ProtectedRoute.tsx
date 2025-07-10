import { useEffect } from "react";
import { useNavigate } from "react-router";

// Dummy auth check, replace with real logic as needed
function isAuthenticated() {
  return Boolean(localStorage.getItem("authToken"));
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login-signup", { replace: true });
    }
  }, [navigate]);
  return isAuthenticated() ? <>{children}</> : null;
}

