import { useState } from 'react';

interface IAppLS {
  issuer: string;
  clientId: string;
}

export interface IAppSetup {
  issuer: string;
  clientId: string;
  setIssuerEvent: any;
  setClientIdEvent: any;
  onSubmit: (event: any) => void;
  valid: boolean;
  hasAppSetup: boolean;
}

export default function useAppSetup(): IAppSetup {
  const lsKey = 'rtr-okta-demo-app-config';
  const appDetails = getAppDetails();
  const [issuer, setIssuer] = useState(appDetails.issuer);
  const [clientId, setClientId] = useState(appDetails.clientId);
  const [hasAppSetup, setHasAppSetup] = useState(hasAppDetails());

  const [valid, setValid] = useState(true);

  return {
    clientId,
    hasAppSetup,
    issuer,
    onSubmit,
    setClientIdEvent,
    setIssuerEvent,
    valid,
  };

  function setIssuerEvent(e: any) {
    setIssuer(e.target.value);
  }

  function setClientIdEvent(e: any) {
    setClientId(e.target.value);
  }

  function onSubmit(e: any) {
    e.preventDefault();
    const issuerVal = issuer.trim();
    const clientIdVal = clientId.trim();
    const valid = issuerVal !== '' && clientIdVal !== '';
    if (valid) {
      setAppDetails({ issuer: issuerVal, clientId: clientIdVal });
    }
    setValid(valid);
    setHasAppSetup(valid);
  }

  function setAppDetails(app: IAppLS) {
    localStorage.setItem(lsKey, JSON.stringify(app));
  }

  function getAppDetails(): IAppLS {
    if (!hasAppDetails()) return { issuer: '', clientId: '' };

    const app = localStorage.getItem(lsKey)!;
    const appObj = JSON.parse(app);
    return appObj as IAppLS;
  }

  function hasAppDetails(): boolean {
    return !!localStorage.getItem(lsKey);
  }
}
