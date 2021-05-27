import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  RouteWhenMemberOfAll,
  IRouteWhenMemberOfProps,
  IAuthContext,
  AuthContext,
} from '../src';
import { cleanup, render } from '@testing-library/react';
import { any } from 'prop-types';

describe('<RouteWhenMemberOfAll />', () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const innerHtmlContent = 'innerHtmlContent';
  const defaultAuthenticatedGroups = ['one', 'two'];
  const defaultUnauthorized = 'default-unauthorized';
  const customUnauthorized = 'custom-unauthorized';
  const mockAuthContextLogin = jest.fn();

  function getMockAuthContext(): IAuthContext {
    return {
      groups: defaultAuthenticatedGroups,
      user: any,
      userDisplayName: '',
      isAuthenticated: true,
      login: mockAuthContextLogin,
      logout: (redirectUrl?: any) => new Promise(() => {}),
      auth: {},
      _applyAuthState: (auth: any) => new Promise(() => {}),
    };
  }

  const RouterComp = () => {
    return <div data-testid={innerHtmlContent}>Yo!</div>;
  };

  const RouterCompUnauthorized = () => {
    return <div data-testid={customUnauthorized}>Yo!</div>;
  };
  function getJsx(
    mockAuthContext: IAuthContext,
    targetGroups: string[],
    unauthorizedComponent?: any
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
    return (
      <Router history={history}>
        <AuthContext.Provider value={mockAuthContext}>
          <RouteWhenMemberOfAll {...props} />
        </AuthContext.Provider>
      </Router>
    );
  }

  function renderForTargetGroups(targetGroups: string[]) {
    const mockAuthContext = getMockAuthContext();
    const jsx = getJsx(mockAuthContext, targetGroups);
    return render(jsx);
  }

  it('renders component when authenticated and matches group', () => {
    const { queryByTestId } = renderForTargetGroups(
      defaultAuthenticatedGroups.slice()
    );
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it('NOT renders component when NOT matching all groups, extra group', () => {
    const { queryByTestId } = renderForTargetGroups(
      defaultAuthenticatedGroups.slice().concat('other')
    );
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('renders component when matching all target groups but not all available groups', () => {
    const targetGroups = defaultAuthenticatedGroups
      .slice()
      .splice(0, defaultAuthenticatedGroups.length - 1);
    const { queryByTestId } = renderForTargetGroups(targetGroups);
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
    expect(queryByTestId(defaultUnauthorized)).toBeFalsy();
  });

  it('NOT renders component when no groups specified', () => {
    const { queryByTestId } = renderForTargetGroups([]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('renders specified Unauthorized component when not auhtorized', () => {
    const mockAuthContext = getMockAuthContext();
    const targetGroups: string[] = [];
    const jsx = getJsx(mockAuthContext, targetGroups, RouterCompUnauthorized);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(customUnauthorized)).toBeTruthy();
  });

  it('redircts to Okta login when not authenticated', () => {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = false;
    const targetGroups: string[] = defaultAuthenticatedGroups.slice();
    const jsx = getJsx(mockAuthContext, targetGroups);
    render(jsx);
    expect(mockAuthContextLogin).toBeCalledTimes(1);
  });
});
