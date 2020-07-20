import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import {
  RouteWhen,
  IRouteWhenProps,
  IAuthContext,
  AuthContext,
} from "../index";
import { cleanup, render } from "@testing-library/react";

describe("<RouteWhen />", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const innerHtmlContent = "innerHtmlContent";
  const defaultUnauthorized = "default-unauthorized";
  const customUnauthorized = "custom-unauthorized";
  const mockAuthContextLogin = jest.fn();
  const mockIsTrue = jest.fn();

  function getMockAuthContext(): IAuthContext {
    return {
      groups: [],
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

  function getJsx(mockAuthContext: IAuthContext, unauthorizedComponent?: any) {
    const history = createMemoryHistory();
    const props: IRouteWhenProps = {
      isTrue: mockIsTrue,
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
          <RouteWhen {...props} />
        </AuthContext.Provider>
      </Router>
    );
  }

  function renderWhen() {
    const mockAuthContext = getMockAuthContext();
    const jsx = getJsx(mockAuthContext);
    return render(jsx);
  }

  it("renders component when authenticated and isTrue()", () => {
    mockIsTrue.mockReturnValueOnce(true);
    const { queryByTestId } = renderWhen();
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it("NOT renders component when NOT isTrue()", () => {
    mockIsTrue.mockReturnValueOnce(false);
    const { queryByTestId } = renderWhen();
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeTruthy();
  });

  it("renders specified Unauthorized component when not auhtorized", () => {
    mockIsTrue.mockReturnValueOnce(false);
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = true;
    const jsx = getJsx(mockAuthContext, RouterCompUnauthorized);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
    expect(queryByTestId(defaultUnauthorized)).toBeFalsy();
    expect(queryByTestId(customUnauthorized)).toBeTruthy();
  });

  it("redircts to Okta login when not authenticated", () => {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = false;
    const jsx = getJsx(mockAuthContext);
    render(jsx);
    expect(mockAuthContextLogin).toBeCalledTimes(1);
  });
});
