import React, { FC } from 'react';
import IWhenMemberOfGroupProps from './models/IWhenMemberOfGroupProps';
import WhenNotMemberOfAll from './WhenNotMemberOfAll';

const WhenNotMemberOf: FC<IWhenMemberOfGroupProps> = props => {
  const { group, ...rest } = props;
  return <WhenNotMemberOfAll groups={[group]} {...rest} />;
};

export default WhenNotMemberOf;
