import { createContext, useState } from "react";
import IAuthContext from "./models/IAuthContext";

function useAuthContextState(): IAuthContext {
  const [groups, setGroups] = useState<string[]>([]);
  const [user, setUser] = useState<any>({});
  const [userDisplayName, setUserDisplayName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [auth, setAuth] = useState<any>(null);

  return {
    groups,
    user,
    userDisplayName,
    isAuthenticated,
    logout,
    login,
    auth,
    _applyAuthState,
  };

  function login(returnUrl?: any): void {
    const redirectTo = typeof returnUrl === "string" ? returnUrl : "/";
    auth.login(redirectTo);
  }

  async function logout(returnUrl?: any): Promise<void> {
    const redirectTo = typeof returnUrl === "string" ? returnUrl : "/";
    await auth.logout(redirectTo);
    clearAfterLogout();
  }

  async function _applyAuthState(authService: any) {
    setAuth(authService);
    await applyAuthState(authService);
  }

  async function applyAuthState(authService: any): Promise<boolean> {
    const authState = authService.getAuthState();
    const isAuth = authState.isAuthenticated;
    if (isAuthenticated !== isAuth) {
      if (isAuth) {
        setIsAuthenticated(true);
        const user = await authService.getUser();
        setUser(user);
        setGroups(user.groups || []);
        setUserDisplayName(`${user.given_name} ${user.family_name}`);
      } else {
        clearAfterLogout();
      }
    }
    return isAuth;
  }

  function clearAfterLogout() {
    setIsAuthenticated(false);
    setGroups([]);
    setUserDisplayName("");
    setUser({});
  }
}

export { useAuthContextState };
export const AuthContext = createContext<IAuthContext>({} as IAuthContext);
export const AuthContextProvider = AuthContext.Provider;
