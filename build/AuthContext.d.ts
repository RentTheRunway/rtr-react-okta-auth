/// <reference types="react" />
import IAuthContext from "./models/IAuthContext";
declare function useAuthContextState(): IAuthContext;
export { useAuthContextState };
export declare const AuthContext: import("react").Context<IAuthContext>;
export declare const AuthContextProvider: import("react").Provider<IAuthContext>;
