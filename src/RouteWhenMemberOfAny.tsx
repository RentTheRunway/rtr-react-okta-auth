import React, { useContext, FC } from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import IRouteWhenMemberOfProps from "./models/IRouteWhenMemberOfProps";
import { hasIntersection } from './Intersections';
import DefaultUnauthorized from "./DefaultUnauthorized";
import UnAuthenticated from "./UnAuthenticated";

const RouteWhenMemberOfAny: FC<IRouteWhenMemberOfProps> = props => {
    const { groups, component, unauthorizedComponent, ...rest } = props;
    const authContext = useContext(AuthContext);
    const isAuthenticated = authContext.isAuthenticated;
    const intersects = hasIntersection(authContext.groups, groups);
    const compToRender = isAuthenticated
      ? intersects
        ? component
        : !!unauthorizedComponent
        ? unauthorizedComponent
        : DefaultUnauthorized
      : UnAuthenticated;
    return <Route {...rest} component={compToRender} />;
  };

  export default RouteWhenMemberOfAny;