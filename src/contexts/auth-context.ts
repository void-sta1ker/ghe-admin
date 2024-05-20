import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

interface AuthContext {
  isAuth: boolean;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
}

const authContext = createContext<AuthContext>({
  isAuth: false,
  setIsAuth: () => {
    //
  },
});

authContext.displayName = "authContext";

const AuthContextConsumer = authContext.Consumer;

// eslint-disable-next-line @typescript-eslint/no-use-before-define
export { AuthContextConsumer as AuthConsumer, authContext, useAuthContext };

function useAuthContext(): React.ContextType<React.Context<AuthContext>> {
  return useContext(authContext);
}
