import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { WhenAuthStatePending } from '../src';

let mockAuthKnown = false;
jest.mock('../src/useRtrOktaAuth', () => ({
  __esModule: true,
  default: () => ({
    authorizationStateKnown: mockAuthKnown,
  }),
}));

describe('<WhenAuthStatePending />', () => {
  const innerHtmlContent = 'innerHtmlContent';

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  function getJsx() {
    return (
      <WhenAuthStatePending>
        <div data-testid={innerHtmlContent}>Yo!</div>
      </WhenAuthStatePending>
    );
  }

  it('renders content when authorizationStateKnown', async () => {
    mockAuthKnown = true;
    const { queryByTestId } = render(getJsx());
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it('NOT renders content when authorizationStateKnown', async () => {
    mockAuthKnown = false;
    const { queryByTestId } = render(getJsx());
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });
});
