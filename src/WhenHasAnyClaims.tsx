import { useContext, FC } from 'react';
import { AuthContext } from "./AuthContext";
import IWhenHasClaimsProps from "./models/IWhenHasClaimsProps";
import IAuthContext from './models/IAuthContext';
import { hasAnyProperty } from './Intersections';

const WhenHasAnyClaims: FC<IWhenHasClaimsProps> = props => {
  const authContext = useContext<IAuthContext>(AuthContext);
  if (!authContext.isAuthenticated) return null;

  const intersects = hasAnyProperty(authContext.user, props.claims);
  if (intersects) {
    return props.children;
  }

  return null;
};

export default WhenHasAnyClaims;
