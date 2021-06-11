import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import * as React from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import AppOktaAware from './AppOktaAware';
import DemoAppSetup from './DemoAppSetup';
import useDemoAppSetup from './useDemoAppSetup';

const AppRouterAware = () => {
  const demoAppSetup = useDemoAppSetup();

  const history = useHistory();
  const restoreOriginalUri = async (
    _oktaAuth: OktaAuth,
    originalUri: string
  ) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };

  const config = {
    issuer: demoAppSetup.issuer,
    clientId: demoAppSetup.clientId,
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

  if (demoAppSetup.hasAppSetup) {
    const oktaConfig = new OktaAuth(config);
    return (
      <Security oktaAuth={oktaConfig} restoreOriginalUri={restoreOriginalUri}>
        <AppOktaAware />
        <Route path="/login/callback" component={LoginCallback} />
      </Security>
    );
  }

  //Collect Okta Issuer and Client ID
  return <DemoAppSetup demoAppSetup={demoAppSetup} />;
};

const App = () => (
  <Router>
    <AppRouterAware />
  </Router>
);

export default App;
