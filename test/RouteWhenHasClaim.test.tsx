import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  RouteWhenHasClaim,
  IRouteWhenHasClaimProps,
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

describe('<RouteWhenHasClaim />', () => {
  const innerHtmlContent = 'innerHtmlContent';
  const defaultUnauthenticated = 'default-unauthenticated';
  const customUnauthenticated = 'custom-unauthenticated';
  const defaultUnauthorized = 'default-unauthorized';
  const customUnauthorized = 'custom-unauthorized';
  let mockIsAuthenticated = true;
  let mockUser = { sub: '', groups: [], one: [], two: [] };
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
    targetClaim: string,
    unauthorizedComponent?: any,
    unauthenticatedComponent?: any
  ) {
    const history = createMemoryHistory();
    const props: IRouteWhenHasClaimProps = {
      claim: targetClaim,
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
          <RouteWhenHasClaim {...props} />
        </RtrOktaAuth>
      </Router>
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

  it('renders component when authenticated and matches claim', async () => {
    const { queryByTestId } = await renderForTargetClaim(
      Object.keys(userClaims)[0]
    );
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it('NOT renders component (renders default unauthorized) when authenticated but NOT matching claim', async () => {
    mockIsAuthenticated = true;
    const { queryByTestId } = await renderForTargetClaim('none');
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('NOT renders component (renders default unauthenticated) when NOT authenticated but matches claims', async () => {
    mockIsAuthenticated = false;
    const { queryByTestId } = await renderForTargetClaim(
      Object.keys(userClaims)[0]
    );
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthenticated)).toBeTruthy();
  });

  it('NOT renders component when no claim specified', async () => {
    mockIsAuthenticated = true;
    const { queryByTestId } = await renderForTargetClaim('');
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('renders specified Unauthorized component when not auhtorized', async () => {
    mockIsAuthenticated = true;
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext, 'none', RouterCompUnauthorized);
    await act(async () => {
      render(jsx);
    });
    expect(screen.queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(screen.queryByTestId(customUnauthorized)).toBeTruthy();
  });

  it('renders specified unauthenticated component when not authenticated', async () => {
    mockIsAuthenticated = false;
    const mockAuthContext = getMockUseOktaAuth();
    const targetClaim = Object.keys(userClaims)[0];
    const jsx = getJsx(
      mockAuthContext,
      targetClaim,
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
