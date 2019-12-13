import React from "react";
import { WhenMemberOfAny, AuthContext, IAuthContext } from "../index";
import { cleanup, render } from "@testing-library/react";

describe("<WhenMemberOfAny />", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const innerHtmlContent = "innerHtmlContent";
  const defaultAuthenticatedGroups = ["one", "two"];

  function getMockAuthContext(): IAuthContext {
    return {
      groups: defaultAuthenticatedGroups,
      user: {},
      userDisplayName: "",
      isAuthenticated: true,
      login: () => {},
      logout: (redirectUrl?: any) => new Promise(() => {}),
      auth: {},
      _reAuthorize: (auth: any) => new Promise(() => {})
    };
  }

  function getJsx(mockAuthContext: IAuthContext, targetGroups: string[]) {
    return (
      <AuthContext.Provider value={mockAuthContext}>
        <WhenMemberOfAny groups={targetGroups}>
          <div data-testid={innerHtmlContent}>Yo!</div>
        </WhenMemberOfAny>
      </AuthContext.Provider>
    );
  }

  function renderForTargetGroups(targetGroups: string[]) {
    const mockAuthContext = getMockAuthContext();
    const jsx = getJsx(mockAuthContext, targetGroups);
    return render(jsx);
  }

  it("renders content when matches a group", () => {
    const { queryByTestId } = renderForTargetGroups([
      defaultAuthenticatedGroups[0]
    ]);
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it("renders content when matches all groups", () => {
    const { queryByTestId } = renderForTargetGroups(
      defaultAuthenticatedGroups.slice()
    );
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it("NOT renders content on no match", () => {
    const { queryByTestId } = renderForTargetGroups(["none"]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it("NOT renders content on no groups specified", () => {
    const { queryByTestId } = renderForTargetGroups([]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it("NOT renders content when NOT authenticated", () => {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = false;
    const targetGroups = defaultAuthenticatedGroups.slice();
    const jsx = getJsx(mockAuthContext, targetGroups);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });
});
