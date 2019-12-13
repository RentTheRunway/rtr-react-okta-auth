import { RouteProps } from "react-router-dom";

export default interface IRouteWhenMemberOfProps extends RouteProps {
    groups: string[];
    unauthorizedComponent?: any;
  }
  