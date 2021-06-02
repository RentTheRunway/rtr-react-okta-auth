export default interface IRtrOktaAuth {
  user: any | null;
  fetchingUserInfo: boolean;
  isMemberOf: (group: string) => boolean;
  isMemberOfAny: (groups: string[]) => boolean;
  isMemberOfAll: (group: string[]) => boolean;
  hasClaim: (claim: string) => boolean;
  hasAnyClaim: (claims: string[]) => boolean;
  hasAllClaims: (claims: string[]) => boolean;
}
