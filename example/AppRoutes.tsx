import { useOktaAuth } from '@okta/okta-react';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { RtrOktaAuth } from '../src/.';
import Home from './pages/Home';

interface Props {}

const AppRoutes: React.FC<Props> = () => {
  const authCtx = useOktaAuth();

  return (
    <RtrOktaAuth authCtx={authCtx}>
      <Route path="/" component={Home} />
    </RtrOktaAuth>
  );
};

export default AppRoutes;
