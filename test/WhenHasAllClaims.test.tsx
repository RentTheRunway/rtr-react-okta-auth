import React from 'react';
import { WhenHasAllClaims, AuthContext, IAuthContext } from '../src';
import { cleanup, render } from '@testing-library/react';

describe('<WhenHasAllClaims />', () => {
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

  function getJsx(mockAuthContext: IAuthContext, targetClaims: string[]) {
    return (
      <AuthContext.Provider value={mockAuthContext}>
        <WhenHasAllClaims claims={targetClaims}>
          <div data-testid={innerHtmlContent}>Yo!</div>
        </WhenHasAllClaims>
      </AuthContext.Provider>
    );
  }

  function renderForTargetClaims(targetClaims: string[]) {
    const mockAuthContext = getMockAuthContext();
    const jsx = getJsx(mockAuthContext, targetClaims);
    return render(jsx);
  }

  it('renders content when matches all claims', () => {
    const { queryByTestId } = renderForTargetClaims(Object.keys(userClaims));
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it('NOT renders content when NOT matches all claims', () => {
    const { queryByTestId } = renderForTargetClaims(
      Object.keys(userClaims).concat(['none'])
    );
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it('NOT renders content when NOT matches all claims and empty claim', () => {
    const { queryByTestId } = renderForTargetClaims(
      Object.keys(userClaims).concat([''])
    );
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it('NOT renders content on no claims specified', () => {
    const { queryByTestId } = renderForTargetClaims([]);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it('NOT renders content when NOT authenticated', () => {
    const mockAuthContext = getMockAuthContext();
    mockAuthContext.isAuthenticated = false;
    const jsx = getJsx(mockAuthContext, Object.keys(userClaims));
    const { queryByTestId } = render(jsx);
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });
});
