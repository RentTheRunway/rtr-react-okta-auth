import * as React from 'react';
import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';

interface Props {
  authCtx: IOktaContext;
}

interface IRtrOktaAuthUserCtx {
  user: any | null;
  userGroups: string[];
  authorizationStateKnown: boolean;
  authCtx: IOktaContext;
}
export function useRtrOktaUserCtx({ authCtx }: Props): IRtrOktaAuthUserCtx {
  const [user, setUser] = React.useState<any>(null);
  const [authorizationStateKnown, setAuthorizationStateKnown] = React.useState<
    boolean
  >(false);
  const [userGroups, setUserGroups] = React.useState<string[]>([]);
  const { authState, oktaAuth } = authCtx;

  React.useEffect(applyAuthState, [authState.isAuthenticated]);

  return {
    user,
    userGroups,
    authorizationStateKnown,
    authCtx,
  };

  function applyAuthState() {
    if (authState.isPending) return;

    setAuthState();
    async function setAuthState() {
      if (!authState.isAuthenticated) {
        setUser(null);
        setUserGroups([]);
        setAuthorizationStateKnown(true);
        return;
      }

      setAuthorizationStateKnown(false);
      const userInfo = await oktaAuth.token.getUserInfo();
      setUser(userInfo);
      setUserGroups(userInfo.groups || []);
      setAuthorizationStateKnown(true);
    }
  }
}

export const RtrOktaAuthContext = React.createContext<IRtrOktaAuthUserCtx>({
  user: null,
  userGroups: [],
  authorizationStateKnown: false,
  authCtx: {} as IOktaContext,
});
