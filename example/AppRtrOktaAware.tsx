import * as React from 'react';
import { Route } from 'react-router';
import { RouteWhenMemberOf, RouteWhenMemberOfAny } from '../src';
import AdminBlog from './pages/AdminBlog';
import Home from './pages/Home';
import ReadBlog from './pages/ReadBlog';

interface Props {}

const AppRtrOktaAware: React.FC<Props> = () => {
  return (
    <>
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
    </>
  );
};

export default AppRtrOktaAware;
