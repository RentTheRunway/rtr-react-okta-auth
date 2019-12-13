import React from 'react';
import UnAuthenticated from "../UnAuthenticated";
import { cleanup, render } from "@testing-library/react";
import { IAuthContext, AuthContext } from '..';

describe("<UnAuthenticated />", () => {
    afterEach(() => {
        cleanup();
        jest.resetAllMocks();
      });

      function getMockAuthContext(): IAuthContext {
        return {
          groups: [],
          user: {},
          userDisplayName: "",
          isAuthenticated: true,
          login: jest.fn(),
          logout: (redirectUrl?: any) => new Promise(() => {}),
          auth: {},
          _reAuthorize: (auth: any) => new Promise(() => {})
        };
      }
    
      function getJsx(mockAuthContext: IAuthContext) {
        return (
          <AuthContext.Provider value={mockAuthContext}>
            <UnAuthenticated>
              <div>Yo!</div>
            </UnAuthenticated>
          </AuthContext.Provider>
        );
      }

      it("redirects to login when unauthenticated", () => {
          const authContext = getMockAuthContext();
          authContext.isAuthenticated = false;
          const { container } = render(getJsx(authContext));
          expect(authContext.login).toBeCalledTimes(1);
          expect(container.firstChild).toBeNull();
      });

      it("NOT redirects to login when authenticated", () => {
        const authContext = getMockAuthContext();
        const { container } = render(getJsx(authContext));
        expect(authContext.login).toBeCalledTimes(0);
        expect(container.firstChild).toBeNull();
      });

});

