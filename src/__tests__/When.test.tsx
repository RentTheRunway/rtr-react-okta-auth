import { cleanup, render } from "@testing-library/react";
import React from "react";
import { AuthContext, IAuthContext, When } from "../index";

describe("<When />", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const innerHtmlContent = "innerHtmlContent";
  const userClaims = { one: true, two: true };

  const mockIsTrue = jest.fn();

  function getMockAuthContext(): IAuthContext {
    return {
      groups: [],
      user: userClaims,
      userDisplayName: "",
      isAuthenticated: true,
      login: () => {},
      logout: (redirectUrl?: any) => new Promise(() => {}),
      auth: {},
      _applyAuthState: (auth: any) => new Promise(() => {}),
    };
  }

  function getJsx(mockAuthContext: IAuthContext) {
    return (
      <AuthContext.Provider value={mockAuthContext}>
        <When isTrue={mockIsTrue}>
          <div data-testid={innerHtmlContent}>Yo!</div>
        </When>
      </AuthContext.Provider>
    );
  }

  it("renders content when isAuthenticated & isTrue() returns true", () => {
    mockIsTrue.mockReturnValueOnce(true);
    const authContext = getMockAuthContext();
    authContext.isAuthenticated = true;
    const jsx = getJsx(authContext);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it("NOT renders content when isAuthenticated & isTrue() returns false", () => {
    mockIsTrue.mockReturnValueOnce(false);
    const authContext = getMockAuthContext();
    authContext.isAuthenticated = true;
    const jsx = getJsx(authContext);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it("NOT renders content when NOT isAuthenticated & isTrue() returns true", () => {
    mockIsTrue.mockReturnValueOnce(true);
    const authContext = getMockAuthContext();
    authContext.isAuthenticated = false;
    const jsx = getJsx(authContext);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it("NOT renders content when NOT isAuthenticated & isTrue() returns false", () => {
    mockIsTrue.mockReturnValueOnce(false);
    const authContext = getMockAuthContext();
    authContext.isAuthenticated = false;
    const jsx = getJsx(authContext);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });
});
