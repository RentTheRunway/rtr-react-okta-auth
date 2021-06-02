import { FC } from 'react';
import IWhenMemberOfProps from './models/IWhenMemberOfProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const WhenNotMemberOfAll: FC<IWhenMemberOfProps> = props => {
  const { isMemberOfAll, authCtx } = useRtrOktaAuth();

  const authenticated = authCtx.authState.isAuthenticated;
  if (!authenticated) return props.children;

  const intersects = isMemberOfAll(props.groups);
  if (!intersects) return props.children;

  return null;
};

export default WhenNotMemberOfAll;
