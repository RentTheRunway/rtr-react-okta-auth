import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  RouteWhenMemberOfAny,
  IRouteWhenMemberOfProps,
  RtrOktaAuth,
} from '../src';
import {
  cleanup,
  render,
  RenderResult,
  act,
  screen,
} from '@testing-library/react';
import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';

describe('<RouteWhenMemberOfAny />', () => {
  const defaultAuthenticatedGroups = ['one', 'two'];
  const innerHtmlContent = 'innerHtmlContent';
  const defaultUnauthenticated = 'default-unauthenticated';
  const customUnauthenticated = 'custom-unauthenticated';
  const defaultUnauthorized = 'default-unauthorized';
  const customUnauthorized = 'custom-unauthorized';
  let mockIsAuthenticated = true;
  let mockUser = { sub: '', groups: defaultAuthenticatedGroups };

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

  const RouterComp = () => {
    return <div data-testid={innerHtmlContent}>Yo!</div>;
  };

  const RouterCompUnauthorized = () => {
    return <div data-testid={customUnauthorized}>Yo! unaothorized</div>;
  };

  const RouterCompUnauthenticated = () => {
    return <div data-testid={customUnauthenticated}>Yo! unauthenticated</div>;
  };

  function getJsx(
    mockAuthContext: any,
    targetGroups: string[],
    unauthorizedComponent?: any,
    unauthenticatedComponent?: any
  ) {
    const history = createMemoryHistory();
    const props: IRouteWhenMemberOfProps = {
      groups: targetGroups,
      path: '/',
      exact: true,
      component: RouterComp,
    };
    if (unauthorizedComponent) {
      props.unauthorizedComponent = unauthorizedComponent;
    }
    if (unauthenticatedComponent) {
      props.unauthenticatedComponent = unauthenticatedComponent;
    }
    return (
      <Router history={history}>
        <RtrOktaAuth authCtx={mockAuthContext}>
          <RouteWhenMemberOfAny {...props} />
        </RtrOktaAuth>
      </Router>
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

  it('renders component when authenticated and matches group', async () => {
    mockIsAuthenticated = true;
    const { queryByTestId } = await renderForTargetGroups(
      defaultAuthenticatedGroups.slice()
    );
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it('NOT renders component (renders default unauthorized) when authenticated but NOT matches group', async () => {
    const { queryByTestId } = await renderForTargetGroups(['none']);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('NOT renders component (renders default unauthenticated) when NOT authenticated but matches group', async () => {
    mockIsAuthenticated = false;
    const { queryByTestId } = await renderForTargetGroups(
      defaultAuthenticatedGroups
    );
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthenticated)).toBeTruthy();
  });

  it('NOT renders component when no groups specified', async () => {
    const { queryByTestId } = await renderForTargetGroups([]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('renders component when matching some target groups but not all available groups', async () => {
    const targetGroups = defaultAuthenticatedGroups
      .slice()
      .splice(0, defaultAuthenticatedGroups.length - 1);
    const { queryByTestId } = await renderForTargetGroups(targetGroups);
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
    expect(queryByTestId(defaultUnauthorized)).toBeFalsy();
  });

  it('renders specified Unauthorized component when not auhtorized', async () => {
    const mockAuthContext = getMockUseOktaAuth();
    const targetGroups: string[] = [];
    const jsx = getJsx(mockAuthContext, targetGroups, RouterCompUnauthorized);
    await act(async () => {
      render(jsx);
    });
    expect(screen.queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(screen.queryByTestId(customUnauthorized)).toBeTruthy();
  });

  it('renders specified unauthenticated component when not authenticated', async () => {
    mockIsAuthenticated = false;
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(
      mockAuthContext,
      defaultAuthenticatedGroups,
      RouterCompUnauthorized,
      RouterCompUnauthenticated
    );
    await act(async () => {
      render(jsx);
    });
    expect(screen.queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(screen.queryByTestId(defaultUnauthenticated)).toBeFalsy();
    expect(screen.queryByTestId(customUnauthenticated)).toBeTruthy();
  });
});
