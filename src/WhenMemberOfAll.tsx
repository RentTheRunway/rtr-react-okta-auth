import { FC } from 'react';
import IWhenMemberOfProps from './models/IWhenMemberOfProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const WhenMemberOfAll: FC<IWhenMemberOfProps> = props => {
  const { isMemberOfAll, authCtx, authorizationStateKnown } = useRtrOktaAuth();
  const { isAuthenticated } = authCtx.authState;

  if (!isAuthenticated || !authorizationStateKnown) return null;

  const intersects = isMemberOfAll(props.groups);

  if (intersects) {
    return props.children;
  }

  return null;
};

export default WhenMemberOfAll;
