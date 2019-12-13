import React, { FC } from "react";
import IRouteWhenHasClaimProps from "./models/IRouteWhenHasClaimProps";
import RouteWhenHasAnyClaims from "./RouteWhenHasAnyClaims";

const RouteWhenHasClaim: FC<IRouteWhenHasClaimProps> = props => {
  return <RouteWhenHasAnyClaims {...props} claims={[props.claim]} />;
};

export default RouteWhenHasClaim;
