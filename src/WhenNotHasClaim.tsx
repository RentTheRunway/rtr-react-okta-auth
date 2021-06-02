import React, { FC } from 'react';
import IWhenHasClaimProps from './models/IWhenHasClaimProps';
import WhenNotHasAllClaims from './WhenNotHasAllClaims';

const WhenNotHasClaim: FC<IWhenHasClaimProps> = props => {
  const { claim, ...rest } = props;
  return <WhenNotHasAllClaims claims={[claim]} {...rest} />;
};

export default WhenNotHasClaim;
