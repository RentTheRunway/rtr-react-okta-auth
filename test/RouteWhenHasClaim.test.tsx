import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  RouteWhenHasClaim,
  IRouteWhenHasClaimProps,
  IAuthContext,
  AuthContext,
} from '../src';
import { cleanup, render } from '@testing-library/react';

describe('<RouteWhenHasClaim />', () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const innerHtmlContent = 'innerHtmlContent';
  const userClaims = { one: true, two: true };
  const defaultUnauthorized = 'default-unauthorized';
  const customUnauthorized = 'custom-unauthorized';
  const mockAuthContextLogin = jest.fn();

  function getMockAuthContext(): IAuthContext {
    return {
      groups: [],
      user: userClaims,
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
    targetClaim: string,
    unauthorizedComponent?: any
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
    return (
      <Router history={history}>
        <AuthContext.Provider value={mockAuthContext}>
          <RouteWhenHasClaim {...props} />
        </AuthContext.Provider>
      </Router>
    );
  }

  function renderForTargetClaim(targetClaim: string) {
    const mockAuthContext = getMockAuthContext();
    const jsx = getJsx(mockAuthContext, targetClaim);
    return render(jsx);
  }

  it('renders component when authenticated and matches claim', () => {
    const { queryByTestId } = renderForTargetClaim(Object.keys(userClaims)[0]);
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it('NOT renders component when NOT matches claim', () => {
    const { queryByTestId } = renderForTargetClaim('none');
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('NOT renders component when no claims specified', () => {
    const { queryByTestId } = renderForTargetClaim('');
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it('renders specified Unauthorized component when not auhtorized', () => {
    const mockAuthContext = getMockAuthContext();
    const targetClaim = '';
    const jsx = getJsx(mockAuthContext, targetClaim, RouterCompUnauthorized);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(customUnauthorized)).toBeTruthy();
  });

  it('redircts to Okta login when not authenticated', () => {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = false;
    const targetClaim = Object.keys(userClaims)[0];
    const jsx = getJsx(mockAuthContext, targetClaim);
    render(jsx);
    expect(mockAuthContextLogin).toBeCalledTimes(1);
  });
});
