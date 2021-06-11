import { FC } from 'react';
import IWhenProps from './models/IWhenProps';
import useWhen from './useWhen';

const When: FC<IWhenProps> = props => {
  const { when } = useWhen();

  if (when(props.isTrue)) return props.children;

  return null;
};

export default When;
