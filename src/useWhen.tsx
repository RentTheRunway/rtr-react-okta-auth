import { useContext } from 'react';
import { AuthContext } from "./AuthContext";
import IAuthContext from './models/IAuthContext';
import IUseWhen from './models/IUseWhen';

function useWhen(): IUseWhen {
    const authContext = useContext<IAuthContext>(AuthContext);

    return {
        when
    };

    function when(fn: () => boolean) {
        if(!authContext.isAuthenticated) return false;

        return fn();
    }
}

export default useWhen;