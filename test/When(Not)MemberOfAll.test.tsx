import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';
import {
  act,
  cleanup,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';
import React from 'react';
import { RtrOktaAuth, WhenMemberOfAll, WhenNotMemberOfAll } from '../src';

describe('<WhenMemberOfAll />', () => {
  let mockIsAuthenticated = true;
  const userGroups = ['one', 'two'];
  let mockUser = { sub: '', groups: userGroups };
  const accessContent = 'accessHtmlContent';
  const noAccessContent = 'noAccessHtmlContent';

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

  function getJsx(mockAuthContext: any, targetGroups: string[]) {
    return (
      <RtrOktaAuth authCtx={mockAuthContext}>
        <WhenMemberOfAll groups={targetGroups}>
          <div data-testid={accessContent}>Yo!</div>
        </WhenMemberOfAll>
        <WhenNotMemberOfAll groups={targetGroups}>
          <div data-testid={noAccessContent}>Yo!</div>
        </WhenNotMemberOfAll>
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

  it('renders content when full match', async () => {
    const { queryByTestId } = await renderForTargetGroups(userGroups);
    expect(queryByTestId(accessContent)).toBeTruthy();
    expect(queryByTestId(noAccessContent)).toBeFalsy();
  });

  it('NOT renders content when not full match', async () => {
    const { queryByTestId } = await renderForTargetGroups([
      userGroups[0],
      'none',
    ]);
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content when not full match, extra group', async () => {
    const { queryByTestId } = await renderForTargetGroups(
      userGroups.concat('no-match')
    );
    expect(queryByTestId(accessContent)).toBeFalsy();
    expect(queryByTestId(noAccessContent)).toBeTruthy();
  });

  it('NOT renders content when no groups specified', async () => {
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
});
