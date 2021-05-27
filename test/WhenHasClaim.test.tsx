import React from 'react';
import { WhenHasClaim, AuthContext, IAuthContext } from '../src';
import { cleanup, render } from '@testing-library/react';

describe('<WhenHasClaim />', () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const innerHtmlContent = 'innerHtmlContent';
  const userClaims = { one: true, two: true };

  function getMockAuthContext(): IAuthContext {
    return {
      groups: [],
      user: userClaims,
      userDisplayName: '',
      isAuthenticated: true,
      login: () => {},
      logout: (redirectUrl?: any) => new Promise(() => {}),
      auth: {},
      _applyAuthState: (auth: any) => new Promise(() => {}),
    };
  }

  function getJsx(mockAuthContext: IAuthContext, targetClaim: string) {
    return (
      <AuthContext.Provider value={mockAuthContext}>
        <WhenHasClaim claim={targetClaim}>
          <div data-testid={innerHtmlContent}>Yo!</div>
        </WhenHasClaim>
      </AuthContext.Provider>
    );
  }

  function renderForTargetClaim(targetClaim: string) {
    const mockAuthContext = getMockAuthContext();
    const jsx = getJsx(mockAuthContext, targetClaim);
    return render(jsx);
  }

  it('NOT renders content when unauthenticated', () => {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = false;
    const jsx = getJsx(mockAuthContext, Object.keys(userClaims)[0]);
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it('NOT renders content when authenticated and NOT has claim', () => {
    const { queryByTestId } = renderForTargetClaim('WRONG');
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it('NOT renders content when authenticated and empty claim', () => {
    const { queryByTestId } = renderForTargetClaim('');
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it('Renders content when authenticated and has claim', () => {
    const { queryByTestId } = renderForTargetClaim(Object.keys(userClaims)[0]);
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });
});
