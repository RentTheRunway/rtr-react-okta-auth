import React, { FC } from 'react';
import IWhenHasClaimProps from './models/IWhenHasClaimProps';
import WhenHasAllClaims from './WhenHasAllClaims';

const WhenHasClaim: FC<IWhenHasClaimProps> = props => {
  const { claim, ...rest } = props;
  return <WhenHasAllClaims claims={[claim]} {...rest} />;
};

export default WhenHasClaim;
