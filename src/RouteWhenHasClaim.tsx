import React, { FC } from 'react';
import IRouteWhenHasClaimProps from './models/IRouteWhenHasClaimProps';
import RouteWhenHasAnyClaims from './RouteWhenHasAnyClaims';

const RouteWhenHasClaim: FC<IRouteWhenHasClaimProps> = props => {
  const { claim, ...rest } = props;
  return <RouteWhenHasAnyClaims claims={[claim]} {...rest} />;
};

export default RouteWhenHasClaim;
