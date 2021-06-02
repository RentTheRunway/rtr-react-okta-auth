import { FC } from 'react';
import IWhenMemberOfProps from './models/IWhenMemberOfProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const WhenMemberOfAny: FC<IWhenMemberOfProps> = props => {
  const { isMemberOfAny, authCtx } = useRtrOktaAuth();
  if (!authCtx.authState.isAuthenticated) return null;
  const intersects = isMemberOfAny(props.groups);

  if (intersects) {
    return props.children;
  }

  return null;
};

export default WhenMemberOfAny;
