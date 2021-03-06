import { FC } from 'react';
import IWhenMemberOfProps from './models/IWhenMemberOfProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const WhenNotMemberOfAny: FC<IWhenMemberOfProps> = props => {
  const { isMemberOfAny, authCtx, authorizationStateKnown } = useRtrOktaAuth();

  const { isAuthenticated } = authCtx.authState;

  if (!authorizationStateKnown) return null;

  if (!isAuthenticated) return props.children;

  const intersects = isMemberOfAny(props.groups);
  if (!intersects) return props.children;

  return null;
};

export default WhenNotMemberOfAny;
