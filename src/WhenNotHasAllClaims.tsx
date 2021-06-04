import { FC } from 'react';
import IWhenHasClaimsProps from './models/IWhenHasClaimsProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const WhenNotHasAllClaims: FC<IWhenHasClaimsProps> = props => {
  const { hasAllClaims, authCtx, authorizationStateKnown } = useRtrOktaAuth();
  const { isAuthenticated } = authCtx.authState;

  if (!authorizationStateKnown) return null;

  if (!isAuthenticated) return props.children;

  const intersects = hasAllClaims(props.claims);
  if (!intersects) return props.children;

  return null;
};

export default WhenNotHasAllClaims;
