import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import {
  RouteWhenHasAnyClaims,
  IRouteWhenHasClaimsProps,
  IAuthContext,
  AuthContext
} from "../index";
import { cleanup, render } from "@testing-library/react";

describe("<RouteWhenHasAnyClaims />", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const innerHtmlContent = "innerHtmlContent";
  const userClaims = { one: true, two: true };
  const defaultUnauthorized = "default-unauthorized";
  const customUnauthorized = "custom-unauthorized";
  const mockAuthContextLogin = jest.fn();

  function getMockAuthContext(): IAuthContext {
    return {
      groups: [],
      user: userClaims,
      userDisplayName: "",
      isAuthenticated: true,
      login: mockAuthContextLogin,
      logout: (redirectUrl?: any) => new Promise(() => {}),
      auth: {},
      _reAuthorize: (auth: any) => new Promise(() => {})
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
    targetClaims: string[],
    unauthorizedComponent?: any
  ) {
    const history = createMemoryHistory();
    const props: IRouteWhenHasClaimsProps = {
      claims: targetClaims,
      path: "/",
      exact: true,
      component: RouterComp
    };
    if (unauthorizedComponent) {
      props.unauthorizedComponent = unauthorizedComponent;
    }
    return (
      <Router history={history}>
        <AuthContext.Provider value={mockAuthContext}>
          <RouteWhenHasAnyClaims {...props} />
        </AuthContext.Provider>
      </Router>
    );
  }

  function renderForTargetClaims(targetClaims: string[]) {
    const mockAuthContext = getMockAuthContext();
    const jsx = getJsx(mockAuthContext, targetClaims);
    return render(jsx);
  }

  it("renders component when authenticated and matches claim", () => {
    const { queryByTestId } = renderForTargetClaims(Object.keys(userClaims));
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it("NOT renders component when NOT matches claim", () => {
    const { queryByTestId } = renderForTargetClaims(["none"]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it("NOT renders component when no claims specified", () => {
    const { queryByTestId } = renderForTargetClaims([]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it("renders specified Unauthorized component when not auhtorized", () => {
    const mockAuthContext = getMockAuthContext();
    const targetClaims: string[] = [];
    const jsx = getJsx(mockAuthContext, targetClaims, RouterCompUnauthorized);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(customUnauthorized)).toBeTruthy();
  });

  it("redircts to Okta login when not authenticated", () => {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = false;
    const targetClaims: string[] = Object.keys(userClaims);
    const jsx = getJsx(mockAuthContext, targetClaims);
    render(jsx);
    expect(mockAuthContextLogin).toBeCalledTimes(1);
  });
});
