import { FC } from 'react';
import IWhenMemberOfProps from './models/IWhenMemberOfProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const WhenMemberOfAny: FC<IWhenMemberOfProps> = props => {
  const { isMemberOfAny, authCtx, authorizationStateKnown } = useRtrOktaAuth();
  const { isAuthenticated } = authCtx.authState;

  if (!isAuthenticated || !authorizationStateKnown) return null;

  const intersects = isMemberOfAny(props.groups);

  if (intersects) {
    return props.children;
  }

  return null;
};

export default WhenMemberOfAny;
