import { FC } from 'react';
import IWhenHasClaimsProps from './models/IWhenHasClaimsProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const WhenNotHasAnyClaims: FC<IWhenHasClaimsProps> = props => {
  const { hasAnyClaims, authCtx, authorizationStateKnown } = useRtrOktaAuth();
  const { isAuthenticated } = authCtx.authState;

  if (!authorizationStateKnown) return null;

  if (!isAuthenticated) return props.children;

  const intersects = hasAnyClaims(props.claims);
  if (!intersects) return props.children;

  return null;
};

export default WhenNotHasAnyClaims;
