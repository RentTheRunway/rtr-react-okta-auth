import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import * as React from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import AppSetup from './AppSetup';
import useAppSetup from './useAppSetup';

const AppRouterAware = () => {
  const appSetup = useAppSetup();

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

  if (appSetup.hasAppSetup)
    return (
      <Security oktaAuth={oktaConfig} restoreOriginalUri={restoreOriginalUri}>
        <AppRoutes />
        <Route path="/login/callback" component={LoginCallback} />
      </Security>
    );

  return <AppSetup appSetup={appSetup} />;
};

const App = () => (
  <Router>
    <AppRouterAware />
  </Router>
);

export default App;
