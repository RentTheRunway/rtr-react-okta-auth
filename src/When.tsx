import { useContext, FC } from 'react';
import { AuthContext } from "./AuthContext";
import IWhenProps from './models/IWhenProps';
import IAuthContext from './models/IAuthContext';

const When: FC<IWhenProps> = props => {
    const authContext = useContext<IAuthContext>(AuthContext);
    if (!authContext.isAuthenticated) return null;

    if(props.isTrue())
        return props.children;

    return null;
}

export default When;