import React, { useState, useEffect, useContext } from "react";
import { withOktaAuth } from "@okta/okta-react";
import { AuthContext } from "./AuthContext";
import IAuthContext from "./models/IAuthContext";

function withAuthUpdator(Component:any, onAuthKnown:()=>void, onAuthPending:()=>void) {
  return Updater;

  function Updater(props: any) {
    const authContextState = useContext<IAuthContext>(AuthContext);
    const [hasAuthenticatedState, setHasAuthenticatedState] = useState<boolean>(false);
    const currentUrl = `${window.location.origin}${window.location.pathname}`;
    const { redirectUri } = props.auth._config; 
    const shouldRun = (currentUrl !== redirectUri);
    useEffect(effect, [shouldRun]);
  
    if (!hasAuthenticatedState) return null;
  
    return <Component {...props} />;

    function effect() {
      if(shouldRun) {
        checkAuthentication();
      }
    }
    async function checkAuthentication() {      
      onAuthPending();
      await authContextState._reAuthorize(props);      
      setHasAuthenticatedState(true);
      onAuthKnown();      
    }
  }
}

function withAuthAwareness(Component:any, onAuthKnown:()=>void = () => {}, onAuthPending:()=>void = () => {}) {
  return withOktaAuth(withAuthUpdator(Component, onAuthKnown, onAuthPending));
}

export default withAuthAwareness;
