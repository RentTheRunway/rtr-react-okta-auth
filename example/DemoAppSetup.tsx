import * as React from 'react';
import { IAppSetup } from './useDemoAppSetup';

/*
The purpose of this is to collect the Okta IssuerId and clientId from the user
*/

interface Props {
  demoAppSetup: IAppSetup;
}

const DemoAppSetup: React.FC<Props> = ({ demoAppSetup: appSetup }) => {
  return (
    <div className="container">
      <div>
        <h1 className="display-4">Welcome to the RTR Okta Auth Test App</h1>

        <div className="alert alert-info">
          <strong className="display-4">
            The app needs the Okta Issuer URL and client Id
          </strong>
          <p className="lead">
            Pop them in here and we'll save them in localStorage so you can
            proceed with the example.
            <br />
            Follow the Okta setup docs{' '}
            <a
              target="_blank"
              href="https://github.com/RentTheRunway/rtr-react-okta-auth"
            >
              here
            </a>{' '}
            to setup an instance.
          </p>
        </div>
        <hr className="my-4" />
        <div className="my-1">
          <form onSubmit={appSetup.onSubmit}>
            <div className="form-group">
              <label htmlFor="issuer">Okta Issuer URL</label>
              <input
                type="text"
                className="form-control"
                id="issuer"
                placeholder="https://dev-{issuerId}.okta.com/oauth2/default"
                value={appSetup.issuer}
                onChange={appSetup.setIssuerEvent}
              />
            </div>
            <div className="form-group">
              <label htmlFor="clientid">Okta Client Id</label>
              <input
                type="text"
                className="form-control"
                id="clientid"
                placeholder="0sa5wv09v0jj3YNkG352"
                value={appSetup.clientId}
                onChange={appSetup.setClientIdEvent}
              />
            </div>

            {!appSetup.valid && (
              <div className="alert alert-danger">
                <p>
                  You need to supply an Okta issuer url and a client ID for this
                  to work (and follow the Okta setup docs{' '}
                  <a
                    target="_blank"
                    href="https://github.com/RentTheRunway/rtr-react-okta-auth"
                  >
                    here
                  </a>
                  )
                </p>
                <p>Don't worry, they'll only be popped into localStorage 👍</p>
              </div>
            )}
            <button className="btn btn-warning btn-lg" role="button">
              Save to localStorage and enter main app
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DemoAppSetup;
