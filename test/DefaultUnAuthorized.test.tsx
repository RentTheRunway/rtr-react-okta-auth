import { render } from '@testing-library/react';
import React from 'react';
import DefaultUnauthorized from '../src/DefaultUnauthorized';

describe('<DefaultUnAuthorized />', () => {
  const defaultUnathorized = 'default-unauthorized';

  it('renders', () => {
    const { getByTestId } = render(<DefaultUnauthorized />);
    expect(getByTestId(defaultUnathorized)).toBeTruthy();
  });
});
