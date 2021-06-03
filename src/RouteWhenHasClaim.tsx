import React, { FC } from 'react';
import IRouteWhenHasClaimProps from './models/IRouteWhenHasClaimProps';
import RouteWhenHasAllClaims from './RouteWhenHasAllClaims';

const RouteWhenHasClaim: FC<IRouteWhenHasClaimProps> = props => {
  const { claim, ...rest } = props;
  return <RouteWhenHasAllClaims claims={[claim]} {...rest} />;
};

export default RouteWhenHasClaim;
