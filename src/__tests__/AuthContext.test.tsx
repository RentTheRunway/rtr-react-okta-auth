import React from "react";
import { cleanup, render, act } from "@testing-library/react";
import { useAuthContextState } from "../AuthContext";
import { IAuthContext } from "..";

describe("AuthContext useAuthContextState()", () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const oktaAuthLogin = jest.fn();
  const oktaAuthLogout = jest.fn();

  let mockIsAuthenticated = true;
  const mockUserObj: {
    given_name: string;
    family_name: string;
    groups: string[] | any;
  } = {
    given_name: "given",
    family_name: "family",
    groups: ["one", "two"]
  };

  const mockOktaAuth = {
    isAuthenticated: () => {
      return new Promise<boolean>(resolve => {
        process.nextTick(() => {
          resolve(mockIsAuthenticated);
        });
      });
    },
    login: oktaAuthLogin,
    logout: oktaAuthLogout,
    getUser: () => {
      return new Promise<any>(resolve => {
        process.nextTick(() => {
          resolve(mockUserObj);
        });
      });
    }
  };

  function getTestableCustomHook(): IAuthContext {
    const hook = {} as IAuthContext;
    function Comp() {
      Object.assign(hook, useAuthContextState());
      return null;
    }
    render(<Comp />);
    return hook;
  }

  it("login accepts redirect string", async () => {
    let authContextState = getTestableCustomHook();

    await act(async () => {
      await authContextState._reAuthorize({ auth: mockOktaAuth });
    });

    act(() => {
      authContextState.login("/elsewhere");
    });

    expect(oktaAuthLogin).toBeCalledWith("/elsewhere");
  });

  it("login handles undefined redirect param", async () => {
    let authContextState = getTestableCustomHook();

    await act(async () => {
      await authContextState._reAuthorize({ auth: mockOktaAuth });
    });

    act(() => {
      authContextState.login();
    });

    expect(oktaAuthLogin).toBeCalledWith("/");
  });

  it("login handles any(obj) redirect param", async () => {
    let authContextState = getTestableCustomHook();

    await act(async () => {
      await authContextState._reAuthorize({ auth: mockOktaAuth });
    });

    act(() => {
      authContextState.login({});
    });

    expect(oktaAuthLogin).toBeCalledWith("/");
  });

  it("login successful sets state accordingly", async () => {
    let authContextState = getTestableCustomHook();

    await act(async () => {
      await authContextState._reAuthorize({ auth: mockOktaAuth });
    });

    act(() => {
      authContextState.login({});
    });

    expect(authContextState.isAuthenticated).toBe(true);
    expect(authContextState.user.family_name).toBe(mockUserObj.family_name);
    expect(authContextState.user.given_name).toBe(mockUserObj.given_name);
    expect(authContextState.groups.join(",")).toBe(
      mockUserObj.groups.join(",")
    );
    expect(authContextState.userDisplayName).toBe(
      `${mockUserObj.given_name} ${mockUserObj.family_name}`
    );
  });

  it("login successful, never null groups array", async () => {
    let authContextState = getTestableCustomHook();
    mockUserObj.groups = null;
    await act(async () => {
      await authContextState._reAuthorize({ auth: mockOktaAuth });
    });

    act(() => {
      authContextState.login("/");
    });

    expect(authContextState.isAuthenticated).toBe(true);
    expect(authContextState.groups).toBeTruthy();
    expect(authContextState.groups).toHaveLength(0);
  });

  it("login unsuccessful clears state accordingly", async () => {
    let authContextState = getTestableCustomHook();
    mockIsAuthenticated = false;

    await act(async () => {
      await authContextState._reAuthorize({ auth: mockOktaAuth });
    });

    act(() => {
      authContextState.login({});
    });

    expect(authContextState.isAuthenticated).toBe(false);
    expect(authContextState.user.family_name).toBeUndefined();
    expect(authContextState.user.given_name).toBeUndefined();
    expect(authContextState.groups).toHaveLength(0);
    expect(authContextState.userDisplayName).toBe("");
  });

  it("logout accepts redirect string", async () => {
    let authContextState = getTestableCustomHook();

    await act(async () => {
      await authContextState._reAuthorize({ auth: mockOktaAuth });
    });

    await act(async () => {
      await authContextState.logout("/elsewhere");
    });

    expect(oktaAuthLogout).toBeCalledWith("/elsewhere");
  });

  it("logout handles undefined redirect param", async () => {
    let authContextState = getTestableCustomHook();

    await act(async () => {
      await authContextState._reAuthorize({ auth: mockOktaAuth });
    });

    await act(async () => {
      await authContextState.logout();
    });

    expect(oktaAuthLogout).toBeCalledWith("/");
  });

  it("logout handles any(obj) redirect param", async () => {
    let authContextState = getTestableCustomHook();

    await act(async () => {
      await authContextState._reAuthorize({ auth: mockOktaAuth });
    });

    await act(async () => {
      await authContextState.logout({});
    });

    expect(oktaAuthLogout).toBeCalledWith("/");
  });

  it("logout resets state accordingly", async () => {
    let authContextState = getTestableCustomHook();

    await act(async () => {
      await authContextState._reAuthorize({ auth: mockOktaAuth });
    });

    await act(async () => {
      await authContextState.logout({});
    });

    expect(authContextState.isAuthenticated).toBe(false);
    expect(authContextState.user.family_name).toBeUndefined();
    expect(authContextState.user.given_name).toBeUndefined();
    expect(authContextState.groups).toHaveLength(0);
    expect(authContextState.userDisplayName).toBe("");
  });

});
