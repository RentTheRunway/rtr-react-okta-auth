import React from 'react';
import {
  WhenHasAnyClaims,
  RtrOktaAuth,
  WhenNotHasAnyClaims,
} from '../src/index';
import {
  cleanup,
  render,
  RenderResult,
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';

describe('<WhenHasAnyClaims /> / <WhenNotHasAnyClaims />', () => {
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

  function getJsx(mockAuthContext: any, targetClaims: string[]) {
    return (
      <RtrOktaAuth authCtx={mockAuthContext}>
        <WhenHasAnyClaims claims={targetClaims}>
          <div data-testid={accessContent}>Yo!</div>
        </WhenHasAnyClaims>
        <WhenNotHasAnyClaims claims={targetClaims}>
          <div data-testid={noAccessContent}>Yo!</div>
        </WhenNotHasAnyClaims>
      </RtrOktaAuth>
    );
  }

  async function renderForTargetClaims(targetClaims: string[]) {
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext, targetClaims);
    let comp: RenderResult = {} as RenderResult;
    await act(async () => {
      comp = render(jsx);
    });
    return comp;
  }

  it('renders content when matches a claim', async () => {
    const { queryByTestId } = await renderForTargetClaims([
      Object.keys(userClaims)[0],
    ]);
    expect(queryByTestId(accessContent)).toBeTruthy();
    expect(queryByTestId(noAccessContent)).toBeFalsy();
  });

  it('renders content when matches all claims', async () => {
    const { queryByTestId } = await renderForTargetClaims(
      Object.keys(userClaims)
    );
    expect(queryByTestId(accessContent)).toBeTruthy();
    expect(queryByTestId(noAccessContent)).toBeFalsy();
  });

  it('NOT renders content on no match', async () => {
    const { queryByTestId } = await renderForTargetClaims(['none']);
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content on no claims specified', async () => {
    const { queryByTestId } = await renderForTargetClaims([]);
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content when NOT authenticated', async () => {
    mockIsAuthenticated = false;
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext, Object.keys(userClaims));
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
    const jsx = getJsx(mockAuthContext, Object.keys(userClaims));
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
