import * as React from 'react';
import { LoginCallback, Security } from '@okta/okta-react';
import { IAppSetup } from './useAppSetup';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Route, useHistory } from 'react-router-dom';
import Home from './pages/Home';

interface Props {
  appSetup: IAppSetup;
}

const AppRoutes: React.FC<Props> = ({ appSetup }) => {
  const config = {
    issuer: appSetup.issuer,
    clientId: appSetup.clientId,
    redirectUri: `${window.location.origin}/login/callback`,
    pkce: true,
    responseType: 'token id_token',
    scopes: ['openid', 'groups', 'profile', 'email'],
    tokenManager: {
      autoRenew: false,
      secure: true,
      storage: 'localStorage',
    },
  };

  const history = useHistory();
  const restoreOriginalUri = async (
    _oktaAuth: OktaAuth,
    originalUri: string
  ) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };

  const oktaConfig = new OktaAuth(config);

  return (
    <Security oktaAuth={oktaConfig} restoreOriginalUri={restoreOriginalUri}>
      <Route path="/" component={Home} />
      <Route path="/login/callback" component={LoginCallback} />
    </Security>
  );
};

export default AppRoutes;
