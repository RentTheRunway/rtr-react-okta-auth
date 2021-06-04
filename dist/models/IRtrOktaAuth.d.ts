import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';
export default interface IRtrOktaAuth {
    user: any | null;
    authorizationStateKnown: boolean;
    authCtx: IOktaContext;
    isMemberOf: (group: string) => boolean;
    isMemberOfAny: (groups: string[]) => boolean;
    isMemberOfAll: (group: string[]) => boolean;
    hasClaim: (claim: string) => boolean;
    hasAnyClaims: (claims: string[]) => boolean;
    hasAllClaims: (claims: string[]) => boolean;
}
