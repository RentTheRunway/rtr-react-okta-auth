import React, { FC } from 'react';
import { RouteWhenMemberOfAll } from '.';
import IRouteWhenMemberOfGroupProps from './models/IRouteWhenMemberOfGroupProps';

const RouteWhenMemberOf: FC<IRouteWhenMemberOfGroupProps> = props => {
  const { group, ...rest } = props;
  return <RouteWhenMemberOfAll groups={[group]} {...rest} />;
};

export default RouteWhenMemberOf;
