import { RouteProps } from 'react-router-dom';
export default interface IRouteWhenMemberOfGroupProps extends RouteProps {
    group: string;
    unauthenticatedComponent?: any;
    unauthorizedComponent?: any;
}
