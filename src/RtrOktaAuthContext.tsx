import * as React from 'react';
import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';

interface Props {
  authCtx: IOktaContext;
}

interface IRtrOktaAuthUserCtx {
  user: any | null;
  userGroups: string[];
  fetchingUserInfo: boolean;
  authCtx: IOktaContext;
}
export function useRtrOktaUserCtx({ authCtx }: Props): IRtrOktaAuthUserCtx {
  const [user, setUser] = React.useState<any>(null);
  const [fetchingUserInfo, setFetchingUserInfo] = React.useState<any>(null);
  const [userGroups, setUserGroups] = React.useState<string[]>([]);
  const { authState, oktaAuth } = authCtx;

  React.useEffect(applyAuthState, [authState.isAuthenticated]);

  return {
    user,
    userGroups,
    fetchingUserInfo,
    authCtx,
  };

  function applyAuthState() {
    setAuthState();
    async function setAuthState() {
      if (!authState.isAuthenticated) {
        setUser(null);
        return;
      }
      setFetchingUserInfo(true);
      const user = await oktaAuth.token.getUserInfo();
      setUser(user);
      setUserGroups(user.groups || []);
      setFetchingUserInfo(false);
    }
  }
}

export const RtrOktaAuthContext = React.createContext<IRtrOktaAuthUserCtx>({
  user: null,
  userGroups: [],
  fetchingUserInfo: false,
});
