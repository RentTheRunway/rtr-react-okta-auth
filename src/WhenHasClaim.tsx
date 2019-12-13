import { useContext, FC } from 'react';
import { AuthContext } from "./AuthContext";
import IWhenHasClaimProps from "./models/IWhenHasClaimProps";
import IAuthContext from './models/IAuthContext';
import { hasAnyProperty } from './Intersections';

const WhenHasClaim: FC<IWhenHasClaimProps> = props => {
  const authContext = useContext<IAuthContext>(AuthContext);
  if (!authContext.isAuthenticated) return null;

  const intersects = hasAnyProperty(authContext.user, [props.claim]);
  if (intersects) {
    return props.children;
  }

  return null;
};

export default WhenHasClaim;
