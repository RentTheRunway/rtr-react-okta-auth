import React, { FC } from 'react';
import { Route } from 'react-router-dom';
import { useRtrOktaAuth } from '.';
import DefaultUnauthorized from './DefaultUnauthorized';
import IRouteWhenMemberOfProps from './models/IRouteWhenMemberOfProps';
import DefaultUnAuthenticated from './DefaultUnAuthenticated';

const RouteWhenMemberOfAny: FC<IRouteWhenMemberOfProps> = props => {
  const {
    groups,
    component,
    unauthenticatedComponent,
    unauthorizedComponent,
    ...rest
  } = props;
  const { isMemberOfAny, authCtx } = useRtrOktaAuth();
  const { isAuthenticated } = authCtx.authState;
  const intersects = isMemberOfAny(groups);
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

export default RouteWhenMemberOfAny;
