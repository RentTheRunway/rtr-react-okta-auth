import { cleanup, render } from "@testing-library/react";
import React from "react";
import { AuthContext, IAuthContext, IUseWhen, useWhen } from "..";


describe("AuthContext useAuthContextState()", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const mockWhenFn = jest.fn();

  function getMockAuthContext(): IAuthContext {
    return {
      groups: [],
      user: {},
      userDisplayName: "",
      isAuthenticated: true,
      login: (redirectUrl?: any) => new Promise(() => {}),
      logout: (redirectUrl?: any) => new Promise(() => {}),
      auth: {},
      _reAuthorize: (auth: any) => new Promise(() => {})
    };
  }

  function getTestableCustomHook(mockAuthContext: IAuthContext): IUseWhen {
    const hook = {} as IUseWhen;
    function Comp() {
      Object.assign(hook, useWhen());
      return null;
    }
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Comp />
      </AuthContext.Provider>
    );
    return hook;
  }

  it("when() parameter fn is invoked and returns correct value when authenticated ", () => {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = true;
    mockWhenFn.mockReturnValueOnce(true);
    let useWhenHook = getTestableCustomHook(mockAuthContext);
    expect(useWhenHook.when(mockWhenFn)).toBeTruthy();
    expect(mockWhenFn).toBeCalledTimes(1);
  });

  it("lwhen() parameter fn is NOT invoked. Returns false when NOT authenticated", () => {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = false;
    mockWhenFn.mockReturnValueOnce(true);
    let useWhenHook = getTestableCustomHook(mockAuthContext);
    expect(useWhenHook.when(mockWhenFn)).toBeFalsy();
    expect(mockWhenFn).toBeCalledTimes(0);
  });

});
