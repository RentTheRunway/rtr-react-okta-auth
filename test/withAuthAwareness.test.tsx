import React from "react";
import { cleanup, render } from "@testing-library/react";
import { withOktaAuth } from "@okta/okta-react";
import { AuthContext, IAuthContext, withAuthAwareness } from "..";
import { act } from "react-dom/test-utils";

let mockRedirectUrl = "http://localhost/";
let mockAuthStateIsPending = false;
let mockAuthStateIsAuthenticated = true;

jest.mock("@okta/okta-react", () => ({
  withOktaAuth: (Component: any) => (props: any) => <Component {...props} />,
  useOktaAuth: () => ({
    authService: {
      _config: {
        redirectUri: mockRedirectUrl,
      },
    },
    authState: {
      isPending: mockAuthStateIsPending,
      isAuthenticated: mockAuthStateIsAuthenticated,
    },
  }),
}));

const innerCompTestId = "innerComp";
const otherUrl = "/other";
const mockApplyAuthState = jest.fn();

function getMockAuthContext(): IAuthContext {
  return {
    groups: [],
    user: {},
    userDisplayName: "",
    isAuthenticated: true,
    login: (auth: any) => new Promise(() => {}),
    logout: (redirectUrl?: any) => new Promise(() => {}),
    auth: {},
    _applyAuthState: mockApplyAuthState,
  };
}

const InnerComp = () => <div data-testid={innerCompTestId}>Yo!</div>;

describe("withAuthAwarenes", () => {
  beforeEach(() => {
    cleanup();
    jest.restoreAllMocks();
    mockRedirectUrl = "http://localhost/";
    mockAuthStateIsPending = false;
    mockAuthStateIsAuthenticated = true;
  });

  it("should not render when current url is the callback url", (done) => {
    const mockAuthContext = getMockAuthContext();
    const AuthComp = withOktaAuth(InnerComp);
    const AuthAwareComp = withAuthAwareness(AuthComp);
    const jsx = (
      <AuthContext.Provider value={mockAuthContext}>
        <AuthAwareComp />
      </AuthContext.Provider>
    );
    const { container } = render(jsx);
    expect(mockApplyAuthState).toBeCalledTimes(0);
    expect(container.firstChild).toBeNull();
    done();
  });

  it("should not render the comp when authState.isPending", async (done) => {
    mockRedirectUrl = otherUrl;
    mockAuthStateIsPending = true;
    const mockAuthContext = getMockAuthContext();
    const AuthComp = withOktaAuth(InnerComp);
    const AuthAwareComp = withAuthAwareness(AuthComp);
    const jsx = (
      <AuthContext.Provider value={mockAuthContext}>
        <AuthAwareComp />
      </AuthContext.Provider>
    );
    const { container } = render(jsx);
    expect(mockApplyAuthState).toBeCalledTimes(0);
    expect(container.firstChild).toBeNull();
    done();
  });

  interface ISetupProps {
    promiseResolve(): void;
    onAuthKnown?(): void;
    onAuthPending?(): void;
  }

  function getSetup(props: ISetupProps) {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext._applyAuthState = (auth: any) =>
      new Promise((resolve: () => void) => {
        props.promiseResolve = resolve;
      });
    const AuthComp = withOktaAuth(InnerComp);
    const AuthAwareComp = withAuthAwareness(
      AuthComp,
      props.onAuthKnown,
      props.onAuthPending
    );
    const jsx = (
      <AuthContext.Provider value={mockAuthContext}>
        <AuthAwareComp />
      </AuthContext.Provider>
    );

    return {
      jsx,
    };
  }

  it("should render the comp only after the authentication state is known", async (done) => {
    mockRedirectUrl = otherUrl;
    const promiseResolveHolder = {
      promiseResolve: () => {},
    };

    const { jsx } = getSetup(promiseResolveHolder);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerCompTestId)).toBeFalsy();
    await act(async () => {
      promiseResolveHolder.promiseResolve();
    });
    expect(queryByTestId(innerCompTestId)).toBeTruthy();
    done();
  });

  it("should call onAuthKnown() when supplied", async (done) => {
    mockRedirectUrl = otherUrl;
    const onAuthKnown = jest.fn();
    const onAuthPending = jest.fn();
    const promiseResolveHolder = {
      promiseResolve: () => {},
      onAuthKnown,
      onAuthPending,
    };
    const { jsx } = getSetup(promiseResolveHolder);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerCompTestId)).toBeFalsy();
    await act(async () => {
      promiseResolveHolder.promiseResolve();
    });
    expect(queryByTestId(innerCompTestId)).toBeTruthy();
    expect(onAuthKnown).toBeCalledTimes(1);
    expect(onAuthPending).toBeCalledTimes(0);
    done();
  });

  it("should call onAuthPending() when supplied", async (done) => {
    mockRedirectUrl = otherUrl;
    mockAuthStateIsPending = true;
    const onAuthKnown = jest.fn();
    const onAuthPending = jest.fn();
    const promiseResolveHolder = {
      promiseResolve: () => {},
      onAuthKnown,
      onAuthPending,
    };
    const { jsx } = getSetup(promiseResolveHolder);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerCompTestId)).toBeFalsy();
    expect(onAuthKnown).toBeCalledTimes(0);
    expect(onAuthPending).toBeCalledTimes(1);
    done();
  });
});
