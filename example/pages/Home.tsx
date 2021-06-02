import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  useRtrOktaAuth,
  WhenHasAnyClaims,
  WhenHasClaim,
  WhenMemberOf,
  WhenMemberOfAny,
} from '../../src';
import NavBar from '../components/NavBar';

function BlogLinks() {
  return (
    <p>
      <Link className="mr-1" to="/read">
        Read
      </Link>
      (Okta groups <code>blog_read</code> or <code>blog_admin</code> only)
      <Link className="mx-1" to="/admin">
        Update
      </Link>
      (Okta group <code>blog_admin</code> only)
    </p>
  );
}

function DocLinks() {
  return (
    <div className="alert alert-primary">
      <p>
        Click{' '}
        <a
          href="https://github.com/RentTheRunway/rtr-react-okta-auth#component-summary"
          target="_blank"
        >
          here
        </a>{' '}
        for the full list of components
      </p>
      <p>
        Click{' '}
        <a
          href="https://github.com/RentTheRunway/rtr-react-okta-auth#component-summary"
          target="_blank"
        >
          here
        </a>{' '}
        for the API
      </p>
    </div>
  );
}

const Home = () => {
  const { user, fetchingUserInfo } = useRtrOktaAuth();
  const displayName = getDisplayName(user, fetchingUserInfo);
  const groups = !!user ? user.groups : [];
  const claims = getClaims(user);

  return (
    <>
      <NavBar />

      <div className="container">
        <div className="alert alert-primary my-4">
          <p>
            This app <strong>requires</strong> that an Okta instance be setup
            with the following:
          </p>
          <p>
            <strong>User 1</strong> with both groups: <code>blog_read</code> and{' '}
            <code>blog_admin</code>
          </p>
          <p>
            <strong>User 2</strong> with group: <code>blog_read</code>
          </p>
          <p>
            <strong>Optionally</strong> for the claims aspect of it
          </p>
          <p>
            <strong>User 1</strong> will have both claims: <code>CanDoA</code>{' '}
            and <code>CanDoB</code>
          </p>
          <p>
            <strong>User 2</strong> will have claim: <code>CanDoA</code>
          </p>
          To setup the Okta instance, simply follow these{' '}
          <a
            href="https://github.com/RentTheRunway/rtr-react-okta-auth#okta-setup-summary"
            target="_blank"
          >
            instructions
          </a>
        </div>

        <DocLinks />

        <h1>User Details</h1>
        <table className="table w-auto">
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col">Groups</th>
              <th scope="col">Claims</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{displayName}</td>
              <td>
                {groups.map(g => (
                  <span key={g} className="badge bg-secondary mr-1">
                    {g}
                  </span>
                ))}
              </td>
              <td>
                {claims.map(g => (
                  <span key={g} className="badge bg-secondary mr-1">
                    {g}
                  </span>
                ))}
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="my-4" />

        <h1>Demo App</h1>

        <h2>
          Limit <code>&lt;Route /&gt;</code> access based on Okta User Groups
        </h2>
        <div>
          <ul className="list-group">
            <li className="list-group-item">
              <h4>Blog Title 1</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit......
              </p>
              <BlogLinks />
            </li>
            <li className="list-group-item">
              <h4>Blog Title 2</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit......
              </p>
              <BlogLinks />
            </li>
            <li className="list-group-item">
              <h4>Blog Title 3</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit......
              </p>
              <BlogLinks />
            </li>
          </ul>
        </div>

        <div className="my-4">
          <blockquote className="blockquote">
            <footer className="blockquote-footer">
              Errr... so should we not be hiding the update links?
            </footer>
            <footer className="blockquote-footer">Of course...</footer>
          </blockquote>
        </div>

        <h2 className="mt-4">Show and Hide JSX based on Okta User Groups</h2>
        <div className="card border-primary mb-3">
          <div className="card-header">Read Blog Link</div>
          <div className="card-body">
            <h4 className="card-title">
              (Okta groups <code>blog_read</code> or <code>blog_admin</code>{' '}
              only)
            </h4>
            <p className="card-text">
              Only users in Okta Groups <code>blog_read</code> or{' '}
              <code>blog_admin</code> can see the below link
            </p>
            <div className="card-text">
              <pre>
                <code>
                  {`<WhenMemberOfAny groups={["blog_read", "blog_admin"]}>
    <Link to="/read">Read Blog</Link>
</WhenMemberOfAny>`}
                </code>
              </pre>
            </div>
            <p>
              LINK:{' '}
              <WhenMemberOfAny groups={['blog_read', 'blog_admin']}>
                <Link to="/read">Read Blog</Link>
              </WhenMemberOfAny>
            </p>
          </div>
        </div>

        <div className="card border-danger mb-3">
          <div className="card-header">Update Blog Link</div>
          <div className="card-body">
            <h4 className="card-title">
              (Okta group <code>blog_admin</code> only)
            </h4>
            <p className="card-text">
              Only users in Okta Group <code>blog_admin</code> can see the below
              link
            </p>
            <div className="card-text">
              <pre>
                <code>
                  {`<WhenMemberOf group="blog_admin">
    <Link to="/admin">Update Blog</Link>
</WhenMemberOf>`}
                </code>
              </pre>
            </div>
            <p>
              LINK:{' '}
              <WhenMemberOf group="blog_admin">
                <Link to="/admin">Update Blog</Link>
              </WhenMemberOf>
            </p>
          </div>
        </div>

        <h2 className="mt-4">Show and Hide JSX based on Okta User Claims</h2>
        <div className="card border-primary mb-3">
          <div className="card-header">Read Blog Link</div>
          <div className="card-body">
            <h4 className="card-title">
              (Okta Claim <code>CanDoA</code> or <code>CanDoB</code> only)
            </h4>
            <div className="card-text">
              Only users with Okta Claims <code>CanDoA</code> or{' '}
              <code>CanDoB</code> can see the below link
            </div>
            <div className="card-text">
              <pre>
                <code>
                  {`<WhenHasAnyClaim claims={["CanDoA", "CanDoB"]}>
    <Link to="/read">Read Blog</Link>
</WhenHasAnyClaim>`}
                </code>
              </pre>
            </div>
            <p>
              LINK:{' '}
              <WhenHasAnyClaims claims={['CanDoA', 'CanDoB']}>
                <Link to="/read">Read Blog</Link>
              </WhenHasAnyClaims>
            </p>
          </div>
        </div>

        <div className="card border-danger mb-3">
          <div className="card-header">Update Blog Link</div>
          <div className="card-body">
            <h4 className="card-title">
              (Okta Claim <code>blog_admin</code> only)
            </h4>
            <div className="card-text">
              Only users with Okta Claim <code>blog_admin</code> can see the
              below link
            </div>
            <div className="card-text">
              <pre>
                <code>
                  {`<WhenHasClaim claim="CanDoB">
    <Link to="/admin">Update Blog</Link>
</WhenHasClaim>`}
                </code>
              </pre>
            </div>
            <p>
              LINK:{' '}
              <WhenHasClaim claim="CanDoB">
                <Link to="/admin">Update Blog</Link>
              </WhenHasClaim>
            </p>
          </div>
        </div>

        <hr className="my-4" />

        <DocLinks />
      </div>
    </>
  );

  function getDisplayName(user: any | null, fetchingUserInfo: boolean) {
    const displayName = fetchingUserInfo
      ? '...'
      : !!user
      ? `${user.given_name} ${user.family_name}`
      : '';
    return displayName;
  }

  function getClaims(user: any): string[] {
    const claims: string[] = [];
    if (!user) return claims;

    const ents = Object.entries(user);
    ents.forEach(([key, value]) => {
      if (Array.isArray(value) && key !== 'groups') {
        claims.push(key);
      }
    });

    return claims;
  }
};

export default Home;
