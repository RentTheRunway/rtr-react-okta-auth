import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';
import * as React from 'react';
import { RtrOktaAuthContext, useRtrOktaUserCtx } from './RtrOktaAuthContext';

interface Props {
  authCtx: IOktaContext;
}

const RtrOktaAuth: React.FC<Props> = ({ authCtx, children }) => {
  const rtrOktaUserCtx = useRtrOktaUserCtx({ authCtx });

  return (
    <RtrOktaAuthContext.Provider value={rtrOktaUserCtx}>
      {children}
    </RtrOktaAuthContext.Provider>
  );
};

export default RtrOktaAuth;
