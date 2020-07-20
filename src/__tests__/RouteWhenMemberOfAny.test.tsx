import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import {
  RouteWhenMemberOfAny,
  IRouteWhenMemberOfProps,
  IAuthContext,
  AuthContext,
} from "../index";
import { cleanup, render } from "@testing-library/react";

describe("<RouteWhenMemberOfAny />", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const innerHtmlContent = "innerHtmlContent";
  const defaultAuthenticatedGroups = ["one", "two"];
  const defaultUnauthorized = "default-unauthorized";
  const customUnauthorized = "custom-unauthorized";
  const mockAuthContextLogin = jest.fn();

  function getMockAuthContext(): IAuthContext {
    return {
      groups: defaultAuthenticatedGroups,
      user: {},
      userDisplayName: "",
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
      path: "/",
      exact: true,
      component: RouterComp,
    };
    if (unauthorizedComponent) {
      props.unauthorizedComponent = unauthorizedComponent;
    }
    return (
      <Router history={history}>
        <AuthContext.Provider value={mockAuthContext}>
          <RouteWhenMemberOfAny {...props} />
        </AuthContext.Provider>
      </Router>
    );
  }

  function renderForTargetGroups(targetGroups: string[]) {
    const mockAuthContext = getMockAuthContext();
    const jsx = getJsx(mockAuthContext, targetGroups);
    return render(jsx);
  }

  it("renders component when authenticated and matches group", () => {
    const { queryByTestId } = renderForTargetGroups(
      defaultAuthenticatedGroups.slice()
    );
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it("NOT renders component when NOT matches group", () => {
    const { queryByTestId } = renderForTargetGroups(["none"]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it("NOT renders component when no groups specified", () => {
    const { queryByTestId } = renderForTargetGroups([]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it("renders specified Unauthorized component when not auhtorized", () => {
    const mockAuthContext = getMockAuthContext();
    const targetGroups: string[] = [];
    const jsx = getJsx(mockAuthContext, targetGroups, RouterCompUnauthorized);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(customUnauthorized)).toBeTruthy();
  });

  it("redircts to Okta login when no authenticated", () => {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = false;
    const targetGroups: string[] = defaultAuthenticatedGroups.slice();
    const jsx = getJsx(mockAuthContext, targetGroups);
    render(jsx);
    expect(mockAuthContextLogin).toBeCalledTimes(1);
  });
});
