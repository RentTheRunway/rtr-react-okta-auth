import { useContext, FC } from 'react';
import { AuthContext } from "./AuthContext";
import IWhenMemberOfProps from "./models/IWhenMemberOfProps";
import { hasIntersection } from './Intersections';
import IAuthContext from './models/IAuthContext';

const WhenMemberOfAny: FC<IWhenMemberOfProps> = props => {
  const authContext = useContext<IAuthContext>(AuthContext);
  if (!authContext.isAuthenticated) return null;

  const intersects = hasIntersection(authContext.groups, props.groups);
  if (intersects) {
    return props.children;
  }

  return null;
};

export default WhenMemberOfAny;
