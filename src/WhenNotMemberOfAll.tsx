import { FC } from 'react';
import IWhenMemberOfProps from './models/IWhenMemberOfProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const WhenNotMemberOfAll: FC<IWhenMemberOfProps> = props => {
  const { isMemberOfAll, authCtx, authorizationStateKnown } = useRtrOktaAuth();

  const { isAuthenticated } = authCtx.authState;

  if (!authorizationStateKnown) return null;

  if (!isAuthenticated) return props.children;

  const intersects = isMemberOfAll(props.groups);
  if (!intersects) return props.children;

  return null;
};

export default WhenNotMemberOfAll;
