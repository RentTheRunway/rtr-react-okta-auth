import React from 'react';

import { cleanup, render, act, screen } from '@testing-library/react';
import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';
import { RtrOktaAuth } from '../src';
import DefaultUnAuthenticated from '../src/DefaultUnAuthenticated';

describe('<DefaultUnAuthenticated />', () => {
  let mockIsAuthenticated = true;
  const defaultUnauthenticated = 'default-unauthenticated';
  const mockUser = { sub: '', groups: [] };

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    mockIsAuthenticated = true;
  });

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

  function getJsx(mockAuthContext: any) {
    return (
      <RtrOktaAuth authCtx={mockAuthContext}>
        <DefaultUnAuthenticated />
      </RtrOktaAuth>
    );
  }

  it('renders when not authenticated', async () => {
    mockIsAuthenticated = false;
    const authContext = getMockUseOktaAuth();
    await act(async () => {
      render(getJsx(authContext));
    });
    const elem = screen.getByTestId(defaultUnauthenticated);
    expect(elem).toBeTruthy();
  });

  it('renders null when authenticated', async () => {
    mockIsAuthenticated = true;
    const authContext = getMockUseOktaAuth();
    await act(async () => {
      render(getJsx(authContext));
    });
    expect(screen.queryByTestId(defaultUnauthenticated)).toBeFalsy();
  });
});
