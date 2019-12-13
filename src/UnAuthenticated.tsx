import { useContext, useEffect, FC } from "react";
import { AuthContext } from "./AuthContext";
import IAuthContext from "./models/IAuthContext";

const UnAuthenticated: FC = () => {
  const authContext = useContext<IAuthContext>(AuthContext);

  useEffect(() => {
    if (!authContext.isAuthenticated) {
      const path = `${window.location.pathname}${window.location.search}`;
      authContext.login(path);
    }
  }, []);

  return null;
};

export default UnAuthenticated;
