import React, { useContext, FC } from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import IRouteWhen from "./models/IRouteWhenProps";
import DefaultUnauthorized from "./DefaultUnauthorized";
import UnAuthenticated from "./UnAuthenticated";
import IAuthContext from "./models/IAuthContext";

const RouteWhen: FC<IRouteWhen> = props => {
    const { component, unauthorizedComponent, isTrue, ...rest } = props;
    const authContext = useContext<IAuthContext>(AuthContext);
    const isAuthenticated = authContext.isAuthenticated;
    const hasAccess = isTrue();
    const compToRender = isAuthenticated
      ? hasAccess
        ? component
        : !!unauthorizedComponent
        ? unauthorizedComponent
        : DefaultUnauthorized
      : UnAuthenticated;
    return <Route {...rest} component={compToRender} />;
  };

  export default RouteWhen;