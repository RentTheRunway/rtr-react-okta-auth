interface IAuthContext {
    groups: string[];
    user: any;
    userDisplayName: string;
    isAuthenticated: boolean;
    login: (redirectToUrl?: any) => void;
    logout: (redirectUrl?: any) => Promise<void>;
    auth: any;
    _reAuthorize: (auth: any) => Promise<void>;
}
export default IAuthContext;
