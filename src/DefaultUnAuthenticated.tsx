import React, { FC } from 'react';
import useRtrOktaAuth from './useRtrOktaAuth';

const DefaultUnAuthenticated: FC = () => {
  const { authCtx } = useRtrOktaAuth();

  if (!authCtx.authState.isAuthenticated) {
    return (
      <div data-testid="default-unauthenticated">
        <div>Unauthenticated</div>
      </div>
    );
  }

  return null;
};

export default DefaultUnAuthenticated;
