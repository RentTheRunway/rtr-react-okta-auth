import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';
import {
  act,
  cleanup,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { IRouteWhenProps, RouteWhen, RtrOktaAuth } from '../src';

describe('<RouteWhen />', () => {
  const innerHtmlContent = 'innerHtmlContent';
  const defaultUnauthenticated = 'default-unauthenticated';
  const customUnauthenticated = 'custom-unauthenticated';
  const defaultUnauthorized = 'default-unauthorized';
  const customUnauthorized = 'custom-unauthorized';
  let mockIsAuthenticated = true;
  let mockUser = { sub: '', groups: [] };
  const mockIsTrue = jest.fn();

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
    return <div data-testid={customUnauthorized}>Yo!</div>;
  };

  const RouterCompUnauthenticated = () => {
    return <div data-testid={customUnauthenticated}>Yo!</div>;
  };

  function getJsx(
    mockAuthContext: any,
    unauthorizedComponent?: any,
    unauthenticatedComponent?: any
  ) {
    const history = createMemoryHistory();
    const props: IRouteWhenProps = {
      isTrue: mockIsTrue,
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
          <RouteWhen {...props} />
        </RtrOktaAuth>
      </Router>
    );
  }

  async function renderWhen() {
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext);
    let comp: RenderResult = {} as RenderResult;
    await act(async () => {
      comp = render(jsx);
    });
    return comp;
  }

  it('renders component when authenticated and isTrue()', async () => {
    mockIsTrue.mockReturnValue(true);
    const { queryByTestId } = await renderWhen();
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it('NOT renders component (renders default unauthorized) when authenticated but NOT isTrue()', async () => {
    mockIsTrue.mockReturnValue(false);
    const { queryByTestId } = await renderWhen();
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('NOT renders component (renders default unauthenticated) when NOT authenticated but isTrue()', async () => {
    mockIsTrue.mockReturnValue(true);
    mockIsAuthenticated = false;
    const { queryByTestId } = await renderWhen();
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthenticated)).toBeTruthy();
  });

  it('renders specified unauthorized component when not auhtorized', async () => {
    mockIsTrue.mockReturnValueOnce(false);
    mockIsAuthenticated = true;
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext, RouterCompUnauthorized);
    await act(async () => {
      render(jsx);
    });
    expect(screen.queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(screen.queryByTestId(defaultUnauthorized)).toBeFalsy();
    expect(screen.queryByTestId(customUnauthorized)).toBeTruthy();
  });

  it('renders specified unauthenticated component when not authenticated', async () => {
    mockIsTrue.mockReturnValueOnce(true);
    mockIsAuthenticated = false;
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(
      mockAuthContext,
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
