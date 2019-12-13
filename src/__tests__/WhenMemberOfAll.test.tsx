import React from "react";
import { WhenMemberOfAll, AuthContext, IAuthContext } from "../index";
import { cleanup, render } from "@testing-library/react";

describe("<WhenMemberOfAll />", () => {
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
        <WhenMemberOfAll groups={targetGroups}>
          <div data-testid={innerHtmlContent}>Yo!</div>
        </WhenMemberOfAll>
      </AuthContext.Provider>
    );
  }

  function renderForTargetGroups(targetGroups: string[]) {
    const mockAuthContext = getMockAuthContext();
    const jsx = getJsx(mockAuthContext, targetGroups);
    return render(jsx);
  }

  it("renders content when full match", () => {
    const { queryByTestId } = renderForTargetGroups(
      defaultAuthenticatedGroups.slice()
    );
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it("NOT renders content when not full match", () => {
    const { queryByTestId } = renderForTargetGroups([
      defaultAuthenticatedGroups[0],
      "none"
    ]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it("NOT renders content when no groups specified", () => {
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
