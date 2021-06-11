import { FC } from 'react';
import useRtrOktaAuth from './useRtrOktaAuth';

interface Props {
  children: any;
}

const WhenAuthStatePending: FC<Props> = (props: Props) => {
  const { authorizationStateKnown } = useRtrOktaAuth();

  return authorizationStateKnown ? props.children : null;
};

export default WhenAuthStatePending;
