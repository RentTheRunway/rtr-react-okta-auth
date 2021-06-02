import React, { FC } from 'react';
import IWhenMemberOfGroupProps from './models/IWhenMemberOfGroupProps';
import WhenMemberOfAll from './WhenMemberOfAll';

const WhenMemberOf: FC<IWhenMemberOfGroupProps> = props => {
  const { group, ...rest } = props;
  return <WhenMemberOfAll groups={[group]} {...rest} />;
};

export default WhenMemberOf;
