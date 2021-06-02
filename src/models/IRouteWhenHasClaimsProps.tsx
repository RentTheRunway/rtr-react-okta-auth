import { RouteProps } from 'react-router-dom';

export default interface IRouteWhenHasClaimsProps extends RouteProps {
  claims: string[];
  unauthorizedComponent?: any;
  unauthenticatedComponent?: any;
}
