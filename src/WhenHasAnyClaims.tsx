import { FC } from 'react';
import IWhenHasClaimsProps from './models/IWhenHasClaimsProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const WhenHasAnyClaims: FC<IWhenHasClaimsProps> = props => {
  const { hasAnyClaims, authCtx, authorizationStateKnown } = useRtrOktaAuth();
  const { isAuthenticated } = authCtx.authState;

  if (!isAuthenticated || !authorizationStateKnown) return null;

  const intersects = hasAnyClaims(props.claims);

  if (intersects) {
    return props.children;
  }

  return null;
};

export default WhenHasAnyClaims;
