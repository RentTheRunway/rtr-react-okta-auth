import React, { FC } from 'react';
import { Route } from 'react-router-dom';
import DefaultUnAuthenticated from './DefaultUnAuthenticated';
import DefaultUnauthorized from './DefaultUnauthorized';
import IRouteWhenMemberOfProps from './models/IRouteWhenMemberOfProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const RouteWhenMemberOfAll: FC<IRouteWhenMemberOfProps> = props => {
  const {
    groups,
    component,
    unauthenticatedComponent,
    unauthorizedComponent,
    ...rest
  } = props;
  const { isMemberOfAll, authCtx } = useRtrOktaAuth();
  const { isAuthenticated } = authCtx.authState;
  const intersects = isMemberOfAll(groups);
  const compToRender = isAuthenticated
    ? intersects
      ? component
      : !!unauthorizedComponent
      ? unauthorizedComponent
      : DefaultUnauthorized
    : !!unauthenticatedComponent
    ? unauthenticatedComponent
    : DefaultUnAuthenticated;
  return <Route {...rest} component={compToRender} />;
};

export default RouteWhenMemberOfAll;
