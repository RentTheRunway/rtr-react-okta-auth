import * as React from 'react';
import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';
interface Props {
    authCtx: IOktaContext;
}
interface IRtrOktaAuthUserCtx {
    user: any | null;
    userGroups: string[];
    fetchingUserInfo: boolean;
    authCtx: IOktaContext;
}
export declare function useRtrOktaUserCtx({ authCtx }: Props): IRtrOktaAuthUserCtx;
export declare const RtrOktaAuthContext: React.Context<IRtrOktaAuthUserCtx>;
export {};
