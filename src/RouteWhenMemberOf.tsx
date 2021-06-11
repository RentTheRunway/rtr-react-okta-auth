import React, { FC } from 'react';
import IRouteWhenMemberOfGroupProps from './models/IRouteWhenMemberOfGroupProps';
import RouteWhenMemberOfAll from './RouteWhenMemberOfAll';

const RouteWhenMemberOf: FC<IRouteWhenMemberOfGroupProps> = props => {
  const { group, ...rest } = props;
  return <RouteWhenMemberOfAll groups={[group]} {...rest} />;
};

export default RouteWhenMemberOf;
