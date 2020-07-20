import React, { useState, useEffect, useContext } from "react";
import { withOktaAuth, useOktaAuth } from "@okta/okta-react";
import { AuthContext } from "./AuthContext";
import IAuthContext from "./models/IAuthContext";

function withAuthUpdator(
  Component: any,
  onAuthKnown: () => void,
  onAuthPending: () => void
) {
  return Updater;

  function Updater(props: any) {
    const { authService, authState } = useOktaAuth();
    const [authStateIsSetup, setAuthStateIsSetup] = useState<boolean>(false);
    const authContextState = useContext<IAuthContext>(AuthContext);
    const authPending = authState && authState.isPending;
    const authKnown = authState && !authState.isPending;

    useEffect(onAuthStateChange, [authKnown]);

    if (authPending) {
      onAuthPending();
      return null;
    }

    if (authStateIsSetup) {
      onAuthKnown();
      return <Component {...props} />;
    }

    return null;

    function onAuthStateChange() {
      const currentUrl = `${window.location.origin}${window.location.pathname}`;
      const { redirectUri } = authService._config;
      const shouldRun = currentUrl !== redirectUri;
      if (authKnown && shouldRun) {
        setupAuthAwareness();
      }

      async function setupAuthAwareness() {
        await authContextState._applyAuthState(authService);
        setAuthStateIsSetup(true);
      }
    }
  }
}

function withAuthAwareness(
  Component: any,
  onAuthKnown: () => void = () => {},
  onAuthPending: () => void = () => {}
) {
  return withOktaAuth(withAuthUpdator(Component, onAuthKnown, onAuthPending));
}

export default withAuthAwareness;
