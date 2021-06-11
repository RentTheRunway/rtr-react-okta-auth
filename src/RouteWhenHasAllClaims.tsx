import React, { FC } from 'react';
import { Route } from 'react-router-dom';
import DefaultUnAuthenticated from './DefaultUnAuthenticated';
import DefaultUnauthorized from './DefaultUnauthorized';
import IRouteWhenHasClaimsProps from './models/IRouteWhenHasClaimsProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const RouteWhenHasAllClaims: FC<IRouteWhenHasClaimsProps> = props => {
  const {
    claims,
    component,
    unauthenticatedComponent,
    unauthorizedComponent,
    ...rest
  } = props;

  const { hasAllClaims, authCtx } = useRtrOktaAuth();
  const { isAuthenticated } = authCtx.authState;
  const intersects = hasAllClaims(claims);
  const compToRender = isAuthenticated
    ? intersects
      ? component
      : !!unauthorizedComponent
      ? unauthorizedComponent
      : DefaultUnauthorized
    : !!unauthenticatedComponent
    ? unauthenticatedComponent
    : DefaultUnAuthenticated;
  return <Route component={compToRender} {...rest} />;
};

export default RouteWhenHasAllClaims;
