import { useContext, FC } from "react";

import { AuthContext } from "./AuthContext";
import IWhenMemberOfProps from "./models/IWhenMemberOfProps";
import { hasFullIntersection } from './Intersections';
import IAuthContext from "./models/IAuthContext";

const WhenMemberOfAll: FC<IWhenMemberOfProps> = props => {
  const authContext = useContext<IAuthContext>(AuthContext);
  if (!authContext.isAuthenticated) return null;

  const fullintersection = hasFullIntersection(
    props.groups,
    authContext.groups
  );
  if (fullintersection) {
    return props.children;
  }

  return null;
};

export default WhenMemberOfAll;
