import { useOktaAuth } from '@okta/okta-react';
import * as React from 'react';
import { Route } from 'react-router';
//import { Route, Switch } from 'react-router-dom';
import { RouteWhenMemberOf, RouteWhenMemberOfAny, RtrOktaAuth } from '../src/.';
import AdminBlog from './pages/AdminBlog';
import Home from './pages/Home';
import ReadBlog from './pages/ReadBlog';

interface Props {}

const AppRoutes: React.FC<Props> = () => {
  const authCtx = useOktaAuth();

  return (
    <RtrOktaAuth authCtx={authCtx}>
      <Route path="/" component={Home} exact />
      <RouteWhenMemberOf
        group="blog_Admin"
        component={AdminBlog}
        path="/admin"
        exact
      />
      <RouteWhenMemberOfAny
        groups={['blog_read', 'blog_Admin']}
        component={ReadBlog}
        path="/read"
        exact
      />
    </RtrOktaAuth>
  );
};

export default AppRoutes;
