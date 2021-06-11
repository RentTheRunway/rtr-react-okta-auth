import { useOktaAuth } from '@okta/okta-react';
import * as React from 'react';
import { RtrOktaAuth } from '../src';
import AppRtrOktaAware from './AppRtrOktaAware';

interface Props {}

const AppOktaAware: React.FC<Props> = () => {
  const authCtx = useOktaAuth();

  return (
    <RtrOktaAuth authCtx={authCtx}>
      <AppRtrOktaAware />
    </RtrOktaAuth>
  );
};

export default AppOktaAware;
