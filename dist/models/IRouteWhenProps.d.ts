import { RouteProps } from "react-router-dom";
export default interface IRouteWhenProps extends RouteProps {
    isTrue: () => boolean;
    unauthorizedComponent?: any;
}
