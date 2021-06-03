import {
  cleanup,
  render,
  RenderResult,
  act,
  screen,
} from '@testing-library/react';
import React from 'react';
import { RtrOktaAuth, When } from '../src';
import { IOktaContext } from '@okta/okta-react/bundles/types/OktaContext';

describe('<When />', () => {
  const innerHtmlContent = 'innerHtmlContent';
  let mockIsAuthenticated = true;
  let mockUser = { sub: '', groups: [], one: [], two: [] };
  const mockIsTrue = jest.fn();

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  function getMockUseOktaAuth(): IOktaContext {
    const ctx = {
      _onAuthRequired: jest.fn(),
      authState: {
        isAuthenticated: mockIsAuthenticated,
      },
      oktaAuth: {
        token: {
          getUserInfo: async () => mockUser,
        },
      },
    };
    return (ctx as unknown) as IOktaContext;
  }

  function getJsx(mockAuthContext: IOktaContext) {
    return (
      <RtrOktaAuth authCtx={mockAuthContext}>
        <When isTrue={mockIsTrue}>
          <div data-testid={innerHtmlContent}>Yo!</div>
        </When>
      </RtrOktaAuth>
    );
  }

  async function doRender() {
    const mockAuthContext = getMockUseOktaAuth();
    const jsx = getJsx(mockAuthContext);
    let comp: RenderResult = {} as RenderResult;
    await act(async () => {
      comp = render(jsx);
    });
    return comp;
  }

  it('renders content when isAuthenticated & isTrue() returns true', async () => {
    mockIsTrue.mockReturnValue(true);
    mockIsAuthenticated = true;
    const { queryByTestId } = await doRender();
    expect(queryByTestId(innerHtmlContent)).toBeTruthy();
  });

  it('NOT renders content when isAuthenticated & isTrue() returns false', async () => {
    mockIsTrue.mockReturnValue(false);
    mockIsAuthenticated = false;
    const { queryByTestId } = await doRender();
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it('NOT renders content when NOT isAuthenticated & isTrue() returns true', async () => {
    mockIsTrue.mockReturnValue(true);
    mockIsAuthenticated = false;
    const { queryByTestId } = await doRender();
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });

  it('NOT renders content when NOT isAuthenticated & isTrue() returns false', async () => {
    mockIsTrue.mockReturnValue(false);
    mockIsAuthenticated = false;
    const { queryByTestId } = await doRender();
    expect(queryByTestId(innerHtmlContent)).toBeFalsy();
  });
});
