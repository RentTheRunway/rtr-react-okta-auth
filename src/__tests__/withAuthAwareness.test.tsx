import React from "react";
import { cleanup, render } from "@testing-library/react";
import { withAuth } from "@okta/okta-react";
import { AuthContext, IAuthContext, withAuthAwareness } from "../index";
import { act } from "react-dom/test-utils";

jest.mock("@okta/okta-react", () => ({
  withAuth: (Component: any) => (props: any) => <Component {...props} />
}));

const innerCompTestId = "innerComp";
const callbackUrl = "http://localhost/";
const url = "/other";

function getMockAuth(redirectUri: string) {
  return {
    auth: {
      _config: {
        redirectUri: redirectUri
      }
    }
  };
}

const mockReauthorize = jest.fn();

function getMockAuthContext(): IAuthContext {
  return {
    groups: [],
    user: {},
    userDisplayName: "",
    isAuthenticated: true,
    login: (auth: any) => new Promise(() => {}),
    logout: (redirectUrl?: any) => new Promise(() => {}),
    auth: {},
    _reAuthorize: mockReauthorize
  };
}

const InnerComp = () => <div data-testid={innerCompTestId}>Yo!</div>;

describe("withAuthAwarenes", () => {
  beforeEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it("should not render when current url is the callback url", done => {
    const mockAuthContext = getMockAuthContext();
    const mockAuth = getMockAuth(callbackUrl);
    const AuthComp = withAuth(InnerComp);
    const AuthAwareComp = withAuthAwareness(AuthComp);
    const jsx = (
      <AuthContext.Provider value={mockAuthContext}>
        <AuthAwareComp {...mockAuth} />
      </AuthContext.Provider>
    );
    const { container } = render(jsx);
    expect(mockReauthorize).toBeCalledTimes(0);
    expect(container.firstChild).toBeNull();
    done();
  });

  interface ISetupProps {
    promiseResolve(): void;
    onAuthKnown?(): void;
    onAuthPending?(): void;
  }

  function getSetup(props: ISetupProps) {
    const mockAuth = getMockAuth(url);
    const mockAuthContext = getMockAuthContext();
    mockAuthContext._reAuthorize = (auth: any) =>
      new Promise((resolve: () => void) => {
        props.promiseResolve = resolve;
      });
    const AuthComp = withAuth(InnerComp);
    const AuthAwareComp = withAuthAwareness(
      AuthComp,
      props.onAuthKnown,
      props.onAuthPending
    );
    const jsx = (
      <AuthContext.Provider value={mockAuthContext}>
        <AuthAwareComp {...mockAuth} />
      </AuthContext.Provider>
    );

    return {
      jsx
    };
  }

  it("should render the comp only after the authentication state is known", async done => {
    const promiseResolveHolder = {
      promiseResolve: () => {}
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

  it("should call onAuthPending() and onAuthKnown() when supplied", async done => {
    const onAuthKnown = jest.fn();
    const onAuthPending = jest.fn();
    const promiseResolveHolder = {
      promiseResolve: () => {},
      onAuthKnown,
      onAuthPending
    };
    const { jsx } = getSetup(promiseResolveHolder);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerCompTestId)).toBeFalsy();
    await act(async () => {
      promiseResolveHolder.promiseResolve();
    });
    expect(queryByTestId(innerCompTestId)).toBeTruthy();
    expect(onAuthKnown).toBeCalledTimes(1);
    expect(onAuthPending).toBeCalledTimes(1);
    done();
  });
});
