import React, { FC } from 'react';
import { Route } from 'react-router-dom';
import DefaultUnAuthenticated from './DefaultUnAuthenticated';
import DefaultUnauthorized from './DefaultUnauthorized';
import IRouteWhen from './models/IRouteWhenProps';
import useRtrOktaAuth from './useRtrOktaAuth';

const RouteWhen: FC<IRouteWhen> = props => {
  const {
    component,
    unauthenticatedComponent,
    unauthorizedComponent,
    isTrue,
    ...rest
  } = props;
  const { isAuthenticated } = useRtrOktaAuth().authCtx.authState;
  const hasAccess = isTrue();
  const compToRender = isAuthenticated
    ? hasAccess
      ? component
      : !!unauthorizedComponent
      ? unauthorizedComponent
      : DefaultUnauthorized
    : !!unauthenticatedComponent
    ? unauthenticatedComponent
    : DefaultUnAuthenticated;
  return <Route component={compToRender} {...rest} />;
};

export default RouteWhen;
