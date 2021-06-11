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
import { RouteWhenMemberOf, RtrOktaAuth } from '../src';
import IRouteWhenMemberOfGroupProps from '../src/models/IRouteWhenMemberOfGroupProps';

describe('<RouteWhenMemberOf />', () => {
  const userGroups = ['one', 'two'];
  const innerHtmlContent = 'innerHtmlContent';
  const defaultUnauthenticated = 'default-unauthenticated';
  const customUnauthenticated = 'custom-unauthenticated';
  const defaultUnauthorized = 'default-unauthorized';
  const customUnauthorized = 'custom-unauthorized';
  let mockIsAuthenticated = true;
  let mockUser = { sub: '', groups: userGroups };

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
    targetGroup: string,
    unauthorizedComponent?: any,
    unauthenticatedComponent?: any
  ) {
    const history = createMemoryHistory();
    const props: IRouteWhenMemberOfGroupProps = {
      group: targetGroup,
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
          <RouteWhenMemberOf {...props} />
        </RtrOktaAuth>
      </Router>
    );
  }

  async function renderForTargetGroup(targetGroup: string) {
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext, targetGroup);
    let comp: RenderResult = {} as RenderResult;
    await act(async () => {
      comp = render(jsx);
    });
    return comp;
  }

  it('renders component when authenticated and matches group', async () => {
    mockIsAuthenticated = true;
    const { queryByTestId } = await renderForTargetGroup(userGroups[0]);
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it('NOT renders component (renders default unauthorized) when authenticated but NOT matches group', async () => {
    const { queryByTestId } = await renderForTargetGroup('other');
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('NOT renders component (renders default unauthenticated) when NOT authenticated but matches group', async () => {
    mockIsAuthenticated = false;
    const { queryByTestId } = await renderForTargetGroup(userGroups[0]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthenticated)).toBeTruthy();
  });

  it('NOT renders component when no group specified', async () => {
    const { queryByTestId } = await renderForTargetGroup('');
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('renders specified Unauthorized component when not auhtorized', async () => {
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext, '', RouterCompUnauthorized);
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
      userGroups[0],
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
