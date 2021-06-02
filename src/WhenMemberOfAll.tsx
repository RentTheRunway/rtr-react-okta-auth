import { FC } from 'react';
import IWhenMemberOfProps from './models/IWhenMemberOfProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const WhenMemberOfAll: FC<IWhenMemberOfProps> = props => {
  const { isMemberOfAll, authCtx } = useRtrOktaAuth();
  if (!authCtx.authState.isAuthenticated) return null;
  const intersects = isMemberOfAll(props.groups);

  if (intersects) {
    return props.children;
  }

  return null;
};

export default WhenMemberOfAll;
