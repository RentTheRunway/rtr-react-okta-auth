import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';
import {
  act,
  cleanup,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import { RtrOktaAuth, WhenHasClaim, WhenNotHasClaim } from '../src';

describe('<WhenHasClaim /> / <WhenNotHasClaim />', () => {
  let mockIsAuthenticated = true;
  let mockUser = { sub: '', groups: [], one: [], two: [] };
  const accessContent = 'accessHtmlContent';
  const noAccessContent = 'noAccessHtmlContent';
  const userClaims = { one: true, two: true };

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

  function getJsx(mockAuthContext: any, targetClaim: string) {
    return (
      <RtrOktaAuth authCtx={mockAuthContext}>
        <WhenHasClaim claim={targetClaim}>
          <div data-testid={accessContent}>Yo!</div>
        </WhenHasClaim>
        <WhenNotHasClaim claim={targetClaim}>
          <div data-testid={noAccessContent}>Yo!</div>
        </WhenNotHasClaim>
      </RtrOktaAuth>
    );
  }

  async function renderForTargetClaim(targetClaim: string) {
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext, targetClaim);
    let comp: RenderResult = {} as RenderResult;
    await act(async () => {
      comp = render(jsx);
    });
    return comp;
  }

  it('Renders content when authenticated and has claim', async () => {
    const { queryByTestId } = await renderForTargetClaim(
      Object.keys(userClaims)[0]
    );
    expect(queryByTestId(accessContent)).toBeTruthy();
    expect(queryByTestId(noAccessContent)).toBeFalsy();
  });

  it('NOT renders content when authenticated and NOT has claim', async () => {
    const { queryByTestId } = await renderForTargetClaim('no-match');
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content when authenticated and empty claim', async () => {
    const { queryByTestId } = await renderForTargetClaim('');
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content when NOT authenticated', async () => {
    mockIsAuthenticated = false;
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext, Object.keys(userClaims)[0]);
    await act(async () => {
      render(jsx);
    });
    expect(screen.queryByTestId(accessContent)).toBeFalsy();
    expect(screen.queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('does not render until user state is known', async () => {
    let resolveUser: any;
    const mockAuthContext = getMockUseOktaAuth();
    mockAuthContext.oktaAuth.token.getUserInfo = () =>
      new Promise(resolve => {
        resolveUser = resolve;
      });
    const jsx = getJsx(mockAuthContext, Object.keys(userClaims)[0]);
    await act(async () => {
      render(jsx);
    });
    expect(screen.queryByTestId(accessContent)).toBeFalsy();
    expect(screen.queryByTestId(noAccessContent)).toBeFalsy();

    resolveUser!(mockUser);
    await waitFor(() => {
      expect(screen.queryByTestId(accessContent)).toBeTruthy();
    });
    expect(screen.queryByTestId(noAccessContent)).toBeFalsy();
  });
});
