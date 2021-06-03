import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { IUseWhen, useWhen } from '..';

import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';
import { RtrOktaAuth } from '../src';

describe('AuthContext useAuthContextState()', () => {
  let mockIsAuthenticated = true;
  const mockUser = { sub: '', groups: [] };
  let hook = {} as IUseWhen;

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const mockWhenFn = jest.fn();

  function getMockUseOktaAuth(): IOktaContext {
    const ctx = {
      _onAuthRequired: jest.fn(),
      authState: {
        isAuthenticated: mockIsAuthenticated,
      },
      oktaAuth: {
        token: {
          getUserInfo: async () => mockUser,
        },
      },
    };
    return (ctx as unknown) as IOktaContext;
  }

  function getTestableCustomHook(mockAuthContext: IOktaContext): IUseWhen {
    function Comp() {
      Object.assign(hook, useWhen());
      return null;
    }
    render(
      <RtrOktaAuth authCtx={mockAuthContext}>
        <Comp />
      </RtrOktaAuth>
    );
    return hook;
  }

  it.skip('when() parameter fn is invoked and returns correct value when authenticated ', () => {
    mockIsAuthenticated = true;
    const mockAuthContext = getMockUseOktaAuth();

    mockWhenFn.mockReturnValueOnce(true);
    let useWhenHook = getTestableCustomHook(mockAuthContext);
    expect(useWhenHook.when(mockWhenFn)).toBeTruthy();
    expect(mockWhenFn).toBeCalledTimes(1);
  });

  it.skip('when() parameter fn is NOT invoked. Returns false when NOT authenticated', () => {
    mockIsAuthenticated = false;
    const mockAuthContext = getMockUseOktaAuth();
    mockWhenFn.mockReturnValueOnce(true);
    let useWhenHook = getTestableCustomHook(mockAuthContext);
    expect(useWhenHook.when(mockWhenFn)).toBeFalsy();
    expect(mockWhenFn).toBeCalledTimes(0);
  });
});
