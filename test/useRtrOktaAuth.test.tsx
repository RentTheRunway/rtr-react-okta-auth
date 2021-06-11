import { cleanup, render, act } from '@testing-library/react';
import React from 'react';

import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';
import { IRtrOktaAuth, RtrOktaAuth, useRtrOktaAuth } from '../src';
import {
  useRtrOktaUserCtx,
  RtrOktaAuthContext,
} from '../src/RtrOktaAuthContext';

interface IMockUser {
  sub: string;
  groups: string[];
  CanDoA?: string[];
  CanDoB?: string[];
}
const userGroups = ['one', 'two'];
const mockUserOrig = { sub: '', groups: userGroups, CanDoA: [], CanDoB: [] };
let mockUser: IMockUser | null = { ...mockUserOrig };
let hook = {} as IRtrOktaAuth;

const mockAuthContext: IOktaContext = ({
  _onAuthRequired: jest.fn(),
  authState: {
    isAuthenticated: true,
  },
  oktaAuth: {
    token: {
      getUserInfo: async () => mockUser,
    },
  },
} as unknown) as IOktaContext;

async function setupTestableCustomHook() {
  function Comp() {
    hook = useRtrOktaAuth();
    return null;
  }

  function Comp1() {
    const ctx = useRtrOktaUserCtx({ authCtx: mockAuthContext });
    return (
      <RtrOktaAuthContext.Provider value={ctx}>
        <Comp />
      </RtrOktaAuthContext.Provider>
    );
  }

  await act(async () => {
    render(
      <RtrOktaAuth authCtx={mockAuthContext}>
        <Comp1 />
      </RtrOktaAuth>
    );
  });
}

describe('useRtrOktaAuth - isMemberOf', () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    mockAuthContext.authState.isAuthenticated = true;
    mockUser = { ...mockUserOrig };
  });

  it('returns false for no user', async () => {
    mockAuthContext.authState.isAuthenticated = false;
    mockUser = null;
    await setupTestableCustomHook();
    const res = hook.isMemberOf(userGroups[0]);
    expect(res).toBe(false);
  });

  it('returns false for no matching groups', async () => {
    await setupTestableCustomHook();
    const res = hook.isMemberOf('no-match');
    expect(res).toBe(false);
  });

  it('returns true for matching group', async () => {
    await setupTestableCustomHook();
    const res = hook.isMemberOf(userGroups[0]);
    expect(res).toBe(true);
  });
});

describe('useRtrOktaAuth - hasClaim', () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    mockAuthContext.authState.isAuthenticated = true;
    mockUser = { ...mockUserOrig };
  });

  it('returns false for no user', async () => {
    mockAuthContext.authState.isAuthenticated = false;
    mockUser = null;
    await setupTestableCustomHook();
    const res = hook.hasClaim('CanDoA');
    expect(res).toBe(false);
  });

  it('returns false for no matching claim', async () => {
    await setupTestableCustomHook();
    const res = hook.hasClaim('no-match');
    expect(res).toBe(false);
  });

  it('returns true for matching group', async () => {
    await setupTestableCustomHook();
    const res = hook.hasClaim('CanDoB');
    expect(res).toBe(true);
  });
});
