import { useState, useMemo } from "react";
import { authContext } from "@/contexts/auth-context";

interface Props {
  children: React.ReactElement;
}

const accessToken = localStorage.getItem("access_token");

export default function AuthProvider(props: Props): React.ReactElement {
  const { children } = props;

  const [isAuth, setIsAuth] = useState<boolean>(Boolean(accessToken));

  const value = useMemo(() => ({ isAuth, setIsAuth }), [isAuth]);

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
