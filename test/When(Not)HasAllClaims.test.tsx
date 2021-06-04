import React from 'react';
import { WhenHasAllClaims, RtrOktaAuth, WhenNotHasAllClaims } from '../src';
import {
  cleanup,
  render,
  RenderResult,
  act,
  screen,
} from '@testing-library/react';
import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';

describe('<WhenHasAllClaims /> / <WhenNotHasAllClaims />', () => {
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
        <WhenHasAllClaims claims={targetClaims}>
          <div data-testid={accessContent}>Yo!</div>
        </WhenHasAllClaims>
        <WhenNotHasAllClaims claims={targetClaims}>
          <div data-testid={noAccessContent}>Yo!</div>
        </WhenNotHasAllClaims>
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

  it('renders content when matches all claims', async () => {
    const { queryByTestId } = await renderForTargetClaims(
      Object.keys(userClaims)
    );
    expect(queryByTestId(accessContent)).toBeTruthy();
    expect(queryByTestId(noAccessContent)).toBeFalsy();
  });

  it('NOT renders content when NOT matches all claims', async () => {
    const { queryByTestId } = await renderForTargetClaims(
      Object.keys(userClaims).concat(['none'])
    );
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content when NOT matches all claims and empty claim', async () => {
    const { queryByTestId } = await renderForTargetClaims(
      Object.keys(userClaims).concat([''])
    );
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
});
