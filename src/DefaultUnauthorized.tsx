import React, { FC } from "react";

const DefaultUnauthorized: FC = () => {
  return (
    <div data-testid="default-unauthorized">
      <div className="rtr-react-okta-auth-unauthorized">Unauthorized</div>
    </div>
  );
};

export default DefaultUnauthorized;
