import { Suspense } from "react";
import { Navigate, Outlet, useMatch } from "react-router-dom";
import { useAuthContext } from "@/contexts";
import DefaultLayout from "@/layouts/default-layout";
import Spinner from "@/components/spinner";
import type { CustomRoute } from "@/types";

interface Props {
  getRoutes: () => CustomRoute[];
}

export default function Root(props: Props): React.ReactElement {
  const { getRoutes } = props;

  const { isAuth } = useAuthContext();

  const match = useMatch("/");

  const routes = getRoutes();

  const sidebarRoutes = routes[0].children?.slice(0, -1);

  if (!isAuth) {
    return <Navigate to="/auth/login" replace />;
  }

  if (match !== null) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DefaultLayout sidebarRoutes={sidebarRoutes as CustomRoute[]}>
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </DefaultLayout>
  );
}
