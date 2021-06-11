import React from 'react';
import { WhenMemberOfAny, WhenNotMemberOfAny, RtrOktaAuth } from '../src';
import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';
import {
  act,
  cleanup,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';

describe('<WhenMemberOfAll /> / <WhenNotMemberOfAll />', () => {
  let mockIsAuthenticated = true;
  const userGroups = ['one', 'two'];
  const origMockUser = { sub: '', groups: userGroups };
  let mockUser = { ...origMockUser };
  const accessContent = 'accessHtmlContent';
  const noAccessContent = 'noAccessHtmlContent';

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    mockIsAuthenticated = true;
    mockUser = { ...origMockUser };
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

  function getJsx(mockAuthContext: any, targetGroups: string[]) {
    return (
      <RtrOktaAuth authCtx={mockAuthContext}>
        <WhenMemberOfAny groups={targetGroups}>
          <div data-testid={accessContent}>Yo!</div>
        </WhenMemberOfAny>
        <WhenNotMemberOfAny groups={targetGroups}>
          <div data-testid={noAccessContent}>Yo!</div>
        </WhenNotMemberOfAny>
      </RtrOktaAuth>
    );
  }

  async function renderForTargetGroups(targetGroups: string[]) {
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext, targetGroups);
    let comp: RenderResult = {} as RenderResult;
    await act(async () => {
      comp = render(jsx);
    });
    return comp;
  }

  it('renders content when matches a group', async () => {
    const { queryByTestId } = await renderForTargetGroups([userGroups[0]]);
    expect(queryByTestId(accessContent)).toBeTruthy();
    expect(queryByTestId(noAccessContent)).toBeFalsy();
  });

  it('renders content when matches all groups', async () => {
    const { queryByTestId } = await renderForTargetGroups(userGroups);
    expect(queryByTestId(accessContent)).toBeTruthy();
    expect(queryByTestId(noAccessContent)).toBeFalsy();
  });

  it('NOT renders content on no match', async () => {
    const { queryByTestId } = await renderForTargetGroups(['no-match']);
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content on no groups specified', async () => {
    const { queryByTestId } = await renderForTargetGroups([]);
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content when user has no groups', async () => {
    mockUser = { sub: '', groups: [] };
    const { queryByTestId } = await renderForTargetGroups(userGroups);
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content when user has no groups, no target groups specified', async () => {
    mockUser = { sub: '', groups: [] };
    const { queryByTestId } = await renderForTargetGroups([]);
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content when user has groups undefined', async () => {
    //@ts-ignore
    mockUser = { sub: '' };
    const { queryByTestId } = await renderForTargetGroups(userGroups);
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content when NOT authenticated', async () => {
    mockIsAuthenticated = false;
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext, userGroups);
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
    const jsx = getJsx(mockAuthContext, userGroups);
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
