Rent the Runway - rtr-react-okta-auth - Usage and Setup

- [Install <a name="install"></a>](#install)
- [What? <a name="what"></a>](#what)
- [Scope <a name="scope"></a>](#scope)
- [How to use <a name="use"></a>](#how-to-use)
    - [Imports <a name="imports"></a>](#imports)
    - [Imports from `@rent-the-runway/rtr-react-okta-auth` <a name="imports1"></a>](#imports-from-rent-the-runwayrtr-react-okta-auth)
    - [Okta App config <a name="config"></a>](#okta-app-config)
    - [Locking down `<Route />`'s <a name="locking-routes"></a>](#locking-down-route-s)
    - [Custom Unauthorized Component <a name="custom-unauthorized-component"></a>](#custom-unauthorized-component)
    - [withAuthAwareness(...) HOC <a name="withAuthAwareness"></a>](#withauthawareness-hoc)
- [Component Summary <a name="component-summary"></a>](#component-summary)
  - [Locking out Routes based on Groups <a name="locking-out-routes-based-on-groups"></a>](#locking-out-routes-based-on-groups)
  - [Locking out JSX based on Groups <a name="locking-out-jsx-based-on-groups"></a>](#locking-out-jsx-based-on-groups)
  - [Locking out Routes based on Claims <a name="locking-out-routes-based-on-claims"></a>](#locking-out-routes-based-on-claims)
  - [Locking out JSX based on Claims <a name="locking-out-jsx-based-on-claims"></a>](#locking-out-jsx-based-on-claims)
  - [Locking out JSX based on application specific logic such as permissions / RBAC <a name="locking-out-jsx-based-on-rbac"></a>](#locking-out-jsx-based-on-application-specific-logic-such-as-permissions--rbac)
  - [Locking out Routes based on application specific logic such as permissions / RBAC <a name="locking-out-routes-based-on-rbac"></a>](#locking-out-routes-based-on-application-specific-logic-such-as-permissions--rbac)
  - [useWhen() Custom Hook <a name="usewhen"></a>](#usewhen-custom-hook)
  - [API <a name="api"></a>](#api)
  - [withAuthAwareness(...) additional parameters <a name="withAuthAwareness-additional-parameters"></a>](#withauthawareness-additional-parameters)
- [Okta Setup Summary <a name="okta-setup-summary"></a>](#okta-setup-summary)
  - [Groups <a name="groups"></a>](#groups)
  - [Claims <a name="claims"></a>](#claims)
- [Detailed Okta Setup <a name="detailed-okta-setup"></a>](#detailed-okta-setup)
  - [Setting up the Okta Application <a name="okta-app-setup"></a>](#setting-up-the-okta-application)
  - [Getting Okta to supply user groups <a name="okta-supply-user-groups"></a>](#getting-okta-to-supply-user-groups)
  - [Getting Okta to supply Claims <a name="okta-supply-claims"></a>](#getting-okta-to-supply-claims)


## Install <a name="install"></a>
npm install @rent-the-runway/rtr-react-okta-auth @okta/okta-react

-or-

yarn add @rent-the-runway/rtr-react-okta-auth @okta/okta-react

## What? <a name="what"></a>
A library that allows a React application to interact with Okta.
It expands on the functionality of [okta-react](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react). 

`okta-react` is detailed by example [here](https://developer.okta.com/quickstart/#/react/nodejs/express) however it has some deficiencies, specifically, it only handles authentication, it does not provide for authorization.
`@rent-the-runway/rtr-react-okta-auth` provides for group-based authorization.
\
Specifically, access to Routes and JSX can be permitted to users
* who are members of particular Okta user groups or additionally
* who have specific claims or
* any other arbitrary condition such as application specific RBAC

The library can be used for both JavaScript and TypeScript.

## Scope <a name="scope"></a>
This library is concerned with Okta's implicit flow. It's intent is to lock down UI fragments and react `<Route />`'s client side, i.e. within the browser.

This library is not directly concerned with securing server side API end points however it can assist in doing so.

If an API end point needs to be made secure it is the responsibility of the individual developers to make it so.

One option is to use `okta-react`'s [auth](https://developer.okta.com/quickstart-fragments/react/default-example/#use-the-access-token) utility (which is made available in this library). It allows the Access Token and/or the ID Token to be fetched. These tokens can be included in any request for example via a JWT token where they can be parsed server-side to enable security on the route.

More information on this [here](https://github.com/okta/samples-java-spring/blob/master/resource-server/src/main/java/com/okta/spring/example/)


## How to use <a name="use"></a>

> **If using TypeScript** <a name="typescript"></a>and an error relating to `@types/okta__okta-react` occurs, this is because Okta have not provided type definitions for `okta-react` (details [here](https://github.com/okta/okta-auth-js/issues/64)). To solve this simply include a file called `okta-react.d.ts` in the root of your application. The contents of this file is simply: 
```javascript
declare module '@okta/okta-react';
```

Here's some sample code that illustrates the various components and how to use them.
\
This example code assumes two Okta groups namely, "standard" and "admin". It also assumes two claims "CanDoA" and "CanDoB".

#### Imports <a name="imports"></a>
(including imports from `okta-react`)
```javascript
import React, { FC, useContext } from "react";
import { IEmptyProps } from "./models/IEmptyProps";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Security, ImplicitCallback } from "@okta/okta-react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Standard from "./pages/Standard";
```

#### Imports from `@rent-the-runway/rtr-react-okta-auth` <a name="imports1"></a>
typescript permits interface `IAuthContext`. For JavaScript, exclude this.
```javascript
import {
  AuthContext,
  IAuthContext,
  AuthContextProvider,
  useAuthContextState,
  RouteWhenMemberOfAny,
  withAuthAwareness
} from "@rent-the-runway/rtr-react-okta-auth";
```

#### Okta App config <a name="config"></a>
(*insert your own id's as per: https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react*)
```javascript
const authCallbackUrl = "/implicit/callback";
const config = {
  issuer: "https://dev-<id-here>.okta.com/oauth2/default",
  redirectUri: `${window.location.origin}${authCallbackUrl}`,
  clientId: "<client-secret-here>",
  pkce: true
};
```

#### Locking down `<Route />`'s <a name="locking-routes"></a>
In the code snippet below, the `/orders` `<Route />` is only accessible to
1. Authenticated users
2. Users who are members of Okta groups called `standard` OR `admin`

The `/users` `<Route />` is only accessible to:
1. Authenticated users
2. Users who are members of group `admin`

If the user arrives unauthenticated at one of those `<Route />`'s they will be redirected to the Okta login page. Upon successful authentication they will be redirected back to that `<Route />`

```JSX
const AppInner: FC<IEmptyProps> = () => {
  
  return (
    <>
      <div className="container">
        <Route path="/" exact={true} component={Home} />
        <RouteWhenMemberOfAny
          groups={["standard", "admin"]}
          path="/orders"
          exact={true}
          component={Standard}
        />
        <RouteWhenMemberOfAny
          groups={["admin"]}
          path="/users"
          exact={true}
          component={Admin}
        />
      </div>
    </>
  );
};
```

#### Custom Unauthorized Component <a name="custom-unauthorized-component"></a>
Note that all these `<Route />` components can also take an additional optional parameter `unauthorizedComponent` which is a custom `<Component />` that will be rendered when the user is unauthorized. This component can simply return a `<Redirect />` component, e.g.
```javascript
const ToUnauthorized = function() {
  return <Redirect to="/unauthorized" />;
}
```

#### withAuthAwareness(...) HOC <a name="withAuthAwareness"></a>
Next, it is necessary to wrap all this in the `withAuthAwareness` `HOC` to enable the secure part of the application with the necessary utilities to function.

*Note that internally this uses `okta-react`'s `withAuth` `HOC`*

```javascript
const AuthApp = withAuthAwareness(AppInner);
```

```JSX
const App: FC<IEmptyProps> = props => {
  const authContextState = useAuthContextState();

  return (
    <AuthContextProvider value={authContextState}>
      <Router>
        <Security {...config}>
          <AuthApp {...props} />
          <Route path={authCallbackUrl} component={ImplicitCallback} />
        </Security>
      </Router>
    </AuthContextProvider>
  );
};
```

A few  things happen above.
1. The auth `state`/`api` is passed into the `Context API` `Provider`, so now an `API` is available to all components. This API is described below.
2. `<Security />` is from `okta-react` and is necessary.
3. The `<Route />` with the `ImplicitCallback` components is outside of the wrapped `AuthApp` component. This is **important** because this handles the Okta callback. It must be publicly available and not a secure `<Route />`
   
## Component Summary <a name="component-summary"></a>
### Locking out Routes based on Groups <a name="locking-out-routes-based-on-groups"></a>
Authenticated users from groups "standard" OR "admin" will have access to /orders
```JSX
<RouteWhenMemberOfAny
    groups={["standard", "admin"]}
    path="/orders"
    exact={true}
    component={Standard}
/>
```
\
Authenticated users from groups "standard" AND "admin" will have access to /orders
```JSX
<RouteWhenMemberOfAll
    groups={["standard", "admin"]}
    path="/orders"
    exact={true}
    component={Standard}
/>
```

### Locking out JSX based on Groups <a name="locking-out-jsx-based-on-groups"></a>
```JSX
<WhenMemberOfAny groups={["standard", "admin"]}>
    <div>Rendered only when user is authenticated and is a member of "standard" OR "admin"</div>
</WhenMemberOfAny>
```
```JSX
<WhenMemberOfAll groups={["standard", "admin"]}>
    <div>Rendered only when user is authenticated and is a member of "standard" AND "admin"</div>
</WhenMemberOfAll>
```

### Locking out Routes based on Claims <a name="locking-out-routes-based-on-claims"></a>
Authenticated users with claim "CanDoA" will have access to /orders
```JSX
<RouteWhenHasClaim
    claim={"CanDoA"}
    path="/orders"
    exact={true}
    component={Admin}
/>
```

\
Authenticated users with claims "CanDoA" OR "CanDoB" will have access to /orders
```JSX
<RouteWhenHasAnyClaims
    claims={["CanDoA", "CanDoB"]}
    path="/orders"
    exact={true}
    component={Admin}
/>
```

\
Authenticated users with claims "CanDoA" AND "CanDoB" will have access to /orders
```JSX
<RouteWhenHasAllClaims
    claims={["CanDoA", "CanDoB"]}
    path="/orders"
    exact={true}
    component={Admin}
/>
```


### Locking out JSX based on Claims <a name="locking-out-jsx-based-on-claims"></a>
```JSX
<WhenHasClaim claim="CanDoA">
    <div>Will be rendered only when the user is authenticated and has a claim called "CanDoA"</div>
</WhenHasClaim>
```
```JSX
<WhenHasAnyClaims claims={["CanDoA", "CanDoB"]}>
    <div>Will be rendered only when user is authenticated and has claims called "CanDoA" OR "CanDoB"</div>
</WhenHasClaims>
```
```JSX
<WhenHasAllClaims claims={["CanDoA", "CanDoB"]}>
    <div>Will be rendered only when user is authenticated and has claims called "CanDoA" AND "CanDoB"</div>
</WhenHasAllClaims>
```

### Locking out JSX based on application specific logic such as permissions / RBAC <a name="locking-out-jsx-based-on-rbac"></a>
*Note* Okta does not inherently provide any means to achieve RBAC. Permission management must take place in the application code.

With that in mind, this library provide a generic means of locking out Routes and JSX. The following components are authentication aware.

```JSX
<When isTrue={() => hasPermission(permissions.canViewOrder)}>
  <li className="nav-item">
    <Link to="/view-order" className={orderClazz}>
      canViewOrder
    </Link>
  </li>
</When>
```
The above example shows how RBAC can be achieved. `hasPermission` is application code and has nothing to do with this library.

However, `hasPermission` need not be concerned with authentication. It needs to be concerned with authorization only. This is because `isTrue` will first check authentication before invoking `hasPermission()`. If not authenticated `isTrue` returns false. `hasPermission()` must return a boolean.

### Locking out Routes based on application specific logic such as permissions / RBAC <a name="locking-out-routes-based-on-rbac"></a>
```JSX
<RouteWhen
  isTrue={() => hasPermission(permissions.canViewOrder)}
  path="/view-order"
  exact={true}
  component={ViewOrder}
/>
```
Here the `isTrue` will check authentication before invoking `hasPermission()`.  If not authenticated `isTrue` returns false. `hasPermission()` must return a boolean.
`<RouteWhen />` will redirect to the Okta login page is `isTrue` returns false. 

As with the other `<RouteWhenXyZ />` components, `<RouteWhen />` takes an optional `unauthorizedComponent` parameter (Which can render a `<Redirect />` if so desired>).

### useWhen() Custom Hook <a name="usewhen"></a>
If we want to do something like disable a button based on some criteria the `useWhen` custom hook can be used.
```JSX
<button
  disabled={!canIssueRefund}
  className="btn btn-primary"
  onClick={issueRefund}
>
  Refund
</button>
```
```javascript
const { when } = useWhen();
const { groups } = useContext<IAuthContext>(AuthContext);
const canIssueRefund = canRefund();

function canRefund() {
  return when(() => hasPermission(permissions.canRefund));

  function hasPermission(permission: string) {
    const permissions = getPermissions(groups);
    return permissions.includes(permission);
  }
}
```
In this example, `hasPermission` and `canRefund` are arbitrary application code. Nothing to do with this library.

`when()` i.e. `return when(() => hasPermission(permissions.canRefund));` is authentication aware and checks the authentication state before invoking the function argument. If not authenticated the function argument is not invoked. `when(...)` simply returns false. Otherwise it returns the result of the function parameter (which must return a boolean)

`canRefund()` could in this case just return direct from `hasPermission(permissions.canRefund)`. `when(...)`  might seem a little redundant but the key point is that `when()` is authentication aware and factors that into the result. i.e. if not authenticated, `false` is returned.

*Note* The reason for the generic arbitrary nature of...
```JSX
<When />
<RouteWhen />
```
and
```javascript
useWhen()
```
...is to accommodate such things as RBAC. **The application can manually match permissions to Okta groups**. 
These components are authentication state aware.


### API <a name="api"></a>
Passing in the `authContextState` into the Context API `Provider` as so effectively delivers the API to all components.

```JSX
const App: FC<IEmptyProps> = props => {
  const authContextState = useAuthContextState();

  return (
    <AuthContextProvider value={authContextState}>
      <Router>
        <Security {...config}>
          <AuthApp {...props} />
          <Route path={authCallbackUrl} component={ImplicitCallback} />
        </Security>
      </Router>
    </AuthContextProvider>
  );
};
```

Use it as follows:

```javascript
import { AuthContext, IAuthContext } from "@rent-the-runway/rtr-react-okta-auth";
```

TypeScript
```typescript
   const {
     login,
     logout,
     isAuthenticated,
     userDisplayName,
     user,
     groups,
     auth
   } = useContext<IAuthContext>(AuthContext);
```

JavaScript
```javascript
  const {
     login,
     logout,
     isAuthenticated,
     userDisplayName,
     user,
     groups,
     auth
   } = useContext(AuthContext);
```
...where:

1. `login` is a function from `okta-react`
2. `logout` is a function from `okta-react`
3. `isAuthenticated` is a boolean
4. `userDisplayName` is a string
5. `user` is an object, the result of `await auth.getUser()` from `okta-react`
6. `groups` is a string array of the groups the user is a member of
7. `auth` is from `okta-react`

E.g.
```JSX
<button onClick={() => login("/home")} className="btn btn-link">
    Login
</button>
```
   
### withAuthAwareness(...) additional parameters <a name="withAuthAwareness-additional-parameters"></a>
It is necessary to wrap the secure part of the app in `withAuthAwareness`. Part of the reason for this is that the `Component` it wraps will not render until after Okta has been consulted about the authentication state of the user. Once this state is known, the wrapped component will render.
\
`withAuthAwareness` takes two optional additional parameters, two `callback function`s, namely `onAuthKnown` and `onAuthPending` which can be used to show spinning icons or to give some indication to the user that something is happening while Okta is being consulted in the background.

```javascript
const AuthApp = withAuthAwareness(SecureApp, onAuthKnown, onAuthPending);

function onAuthKnown() {
  //clear spinning icon
}

function onAuthPending() {
  //set spinning icon
}

```

## Okta Setup Summary <a name="okta-setup-summary"></a>
Setup your own Okta account as explained here: https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react

You simply need to create `Groups` or `Claims` in Okta and add users to them. This documentation assumes two groups named `admin` and `standard`.

To get Okta to return the groups, you need to add a claim that returns them. There are different ways to do this. A simple way is to:
### Groups <a name="groups"></a>
1. Don't create a new scope
2. Create a new claim as so:
   1. Name: `groups`
   2. Include in token type: `ID Token`, `Always`
   3. Value type: `Groups`
   4. Filter: `Matches regex` `.*`
   5. Include in: `Any scope`
3. Save
4. *More detail below*

### Claims <a name="claims"></a>
1. Create a new Claim giving it a name e.g. `CanDoA`
2. Include in the "ID Token" `Always`
3. Value Type `Groups`
4. Filter "Equals" &lt;_the-group-name_&gt;
5. Include in `Any Scope` or in a designated scope
6. Now these claims will be present in the `user` object (`const { user } = useContext(AuthContext)` details below )

## Detailed Okta Setup <a name="detailed-okta-setup"></a>
### Setting up the Okta Application <a name="okta-app-setup"></a>
Assuming access to an Okta account (you can create a dev account for free by signing up with Okta). 

Within the Okta dashboard, click on the 'Applications' link in the main navigation menu. 

Click the 'Add Application' button.

Choose the 'Single Page App' option and click 'Next'

Give it a suitable name (**My SPA** for now) and update the BaseURIs and Login redirect URIs accordingly. Add URI's for the different environments e.g. dev, staging, prod

For 'Grant type allowed' check the '**Implicit**' option and also check the '**Authorization Code**' option

Click 'Done'.

![alt text](/readme-img/create-new-spa-app.png)

After clicking 'Done' note or copy the Client ID for later.

Observing the 'Assignments' tab it can be noted that the user-group 'Everyone' is associated with the 'My Spa' app. This may not be the situation in a real world application but for illustration purposes its sufficient.

Navigate into 'Authorization Servers' from the main navigation menu
![alt text](/readme-img/authorization-servers.png)


\
In the 'Trusted Origins' tab add the various URL's that will need access to the Okta application. This is necessary in order to facilitate CORS.

![Trusted Origins](/readme-img/trusted-origins.png)
![Trusted Origins](/readme-img/cors.png)

### Getting Okta to supply user groups <a name="okta-supply-user-groups"></a>
Back on the 'Authorization Servers' tab click on 'default' to configure it.

In the 'Claims' tab, add a claim with the following values.
![Okta Claim](/readme-img/claim.png)

\
This will add a default claim called 'groups' that will return a list of Okta user groups for which the user is a member. 

This is not the only way to achieve this but in order to work with the `@rent-the-runway/rtr-react-okta-auth` the claim `groups` should exist and its value should be the group names.


In the 'Access Policies' tab, enable access policy by adding a rule and configuring accordingly
![Add Rule](/readme-img/rule.png)
Now `await auth.getUser()` will include a `groups` property.


### Getting Okta to supply Claims <a name="okta-supply-claims"></a>
In the Okta admin we can create a claim and associate it with a user-group as so.
![Create Claim for Single Group](/readme-img/create_claim_single_group.png)

To associate a Claim with more than one group we can use regular expressions
![Create Claim for Multiple Groups](/readme-img/create_claim_many_groups.png)

Now `await auth.getUser()` will include each claim as an individual property.

While the code for this library keeps `groups` and `claims` separate, setting Okta up this way makes `groups` feel like `roles` and `claims` feel like `permissions` within those `roles`.

