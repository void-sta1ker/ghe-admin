import { Navigate, Outlet, useMatch } from "react-router-dom";
import { useAuthContext } from "@/contexts";

const Auth: React.FC = function Auth() {
  const match = useMatch("/auth/login");
  const { isAuth } = useAuthContext();

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  if (match !== null) {
    return <Outlet />;
  }

  return null;
};

export default Auth;
