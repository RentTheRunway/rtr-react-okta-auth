import * as React from 'react';
import { useOktaAuth } from '@okta/okta-react';

interface Props {}

const NavBar = (props: Props) => {
  const { authState, oktaAuth } = useOktaAuth();

  const { isAuthenticated } = authState;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Home
                <span className="visually-hidden">(current)</span>
              </a>
            </li>
          </ul>
          <div>
            {isAuthenticated && (
              <>
                <span className="text-white mr-4">????</span>
                <button
                  className="p-0 text-white btn btn-link"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <button className="p-0 text-white btn btn-link" onClick={login}>
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  function login() {
    oktaAuth.signInWithRedirect();
  }

  function logout() {
    oktaAuth.signOut({});
  }
};

export default NavBar;
