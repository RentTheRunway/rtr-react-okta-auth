import * as React from 'react';
import {
  hasAllProperties,
  hasAnyProperty,
  hasFullIntersection,
  hasIntersection,
} from './Intersections';
import IRtrOktaAuth from './models/IRtrOktaAuth';
import { RtrOktaAuthContext } from './RtrOktaAuthContext';

export default function useRtrOktaAuth(): IRtrOktaAuth {
  const { user, userGroups, fetchingUserInfo, authCtx } = React.useContext(
    RtrOktaAuthContext
  );

  return {
    user,
    fetchingUserInfo,
    authCtx,
    isMemberOf,
    isMemberOfAny,
    isMemberOfAll,
    hasClaim,
    hasAnyClaims,
    hasAllClaims,
  };

  function isMemberOf(group: string) {
    if (!user) return false;
    return hasIntersection([group], userGroups);
  }

  function isMemberOfAny(groups: string[]) {
    if (!user) return false;
    return hasIntersection(groups, userGroups);
  }

  function isMemberOfAll(groups: string[]) {
    if (!user) return false;
    return hasFullIntersection(groups, userGroups);
  }

  function hasClaim(claim: string) {
    if (!user) return false;
    return hasAnyProperty(user, [claim]);
  }

  function hasAnyClaims(claims: string[]) {
    if (!user) return false;
    return hasAnyProperty(user, claims);
  }

  function hasAllClaims(claims: string[]) {
    if (!user) return false;
    return hasAllProperties(user, claims);
  }
}
