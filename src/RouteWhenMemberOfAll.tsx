import React, { useContext, FC } from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import IRouteWhenMemberOfProps from "./models/IRouteWhenMemberOfProps";
import { hasFullIntersection } from "./Intersections";

import DefaultUnauthorized from "./DefaultUnauthorized";
import UnAuthenticated from "./UnAuthenticated";
import IAuthContext from "./models/IAuthContext";

const RouteWhenMemberOfAll: FC<IRouteWhenMemberOfProps> = props => {
  const { groups, component, unauthorizedComponent, ...rest } = props;
  const authContext = useContext<IAuthContext>(AuthContext);
  const isAuthenticated = authContext.isAuthenticated;
  const intersects = hasFullIntersection(groups, authContext.groups);
  const compToRender = isAuthenticated
    ? intersects
      ? props.component
      : !!props.unauthorizedComponent
      ? props.unauthorizedComponent
      : DefaultUnauthorized
    : UnAuthenticated;
  return <Route {...rest} component={compToRender} />;
};

export default RouteWhenMemberOfAll;
