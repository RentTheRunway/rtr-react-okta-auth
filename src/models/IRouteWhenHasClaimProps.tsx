import { RouteProps } from "react-router-dom";

export default interface IRouteWhenHasClaimProps extends RouteProps {
    claim: string;
    unauthorizedComponent?: any;
  }
  