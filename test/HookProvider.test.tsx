import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HookProvider, useHookContext } from '../lib/providers/HookInjectionProvider';

const TestComponent = () => {
  const context = useHookContext();
  return (
    <div>
      <div data-testid="context-keys">{Object.keys(context).join(',')}</div>
      <div data-testid="context-values">{JSON.stringify(context)}</div>
    </div>
  );
};

const mockHooks = {
  navigate: jest.fn(),
  auth: () => ({ user: null, isAuthenticated: false }),
  theme: () => ({ current: 'light', toggle: jest.fn() })
};

describe('HookProvider', () => {
  it('should provide hooks to context', () => {
    render(
      <HookProvider hooks={mockHooks}>
        <TestComponent />
      </HookProvider>
    );

    expect(screen.getByTestId('context-keys')).toHaveTextContent('navigate,auth,theme');
    expect(screen.getByTestId('context-values')).toHaveTextContent(JSON.stringify(mockHooks));
  });

  it('should handle empty hooks object', () => {
    render(
      <HookProvider hooks={{}}>
        <TestComponent />
      </HookProvider>
    );

    expect(screen.getByTestId('context-keys')).toHaveTextContent('');
    expect(screen.getByTestId('context-values')).toHaveTextContent('{}');
  });

  it('should update context when hooks change', () => {
    const initialHooks = { navigate: jest.fn() };
    const updatedHooks = { navigate: jest.fn(), auth: mockHooks.auth };

    const { rerender } = render(
      <HookProvider hooks={initialHooks}>
        <TestComponent />
      </HookProvider>
    );

    expect(screen.getByTestId('context-keys')).toHaveTextContent('navigate');

    rerender(
      <HookProvider hooks={updatedHooks}>
        <TestComponent />
      </HookProvider>
    );

    expect(screen.getByTestId('context-keys')).toHaveTextContent('navigate,auth');
  });

  it('should handle nested providers', () => {
    const outerHooks = { navigate: jest.fn() };
    const innerHooks = { auth: mockHooks.auth };

    const InnerComponent = () => {
      const context = useHookContext();
      return <div data-testid="inner-context">{JSON.stringify(context)}</div>;
    };

    const OuterComponent = () => {
      const context = useHookContext();
      return (
        <div>
          <div data-testid="outer-context">{JSON.stringify(context)}</div>
          <HookProvider hooks={innerHooks}>
            <InnerComponent />
          </HookProvider>
        </div>
      );
    };

    render(
      <HookProvider hooks={outerHooks}>
        <OuterComponent />
      </HookProvider>
    );

    // Outer provider should have outer hooks
    expect(screen.getByTestId('outer-context')).toHaveTextContent(JSON.stringify(outerHooks));
    
    // Inner provider should have inner hooks (overrides outer)
    expect(screen.getByTestId('inner-context')).toHaveTextContent(JSON.stringify(innerHooks));
  });

  it('should handle empty hook values', () => {
    const hooksWithEmpty = {
      navigate: () => null,
      auth: () => undefined,
      theme: mockHooks.theme
    };

    render(
      <HookProvider hooks={hooksWithEmpty}>
        <TestComponent />
      </HookProvider>
    );

    expect(screen.getByTestId('context-keys')).toHaveTextContent('navigate,auth,theme');
    expect(screen.getByTestId('context-values')).toHaveTextContent(JSON.stringify(hooksWithEmpty));
  });
});

describe('useHookContext', () => {
  it('should throw error when used outside provider', () => {
    const ComponentWithoutProvider = () => {
      useHookContext();
      return <div>Should not render</div>;
    };

    // Expect error to be thrown
    expect(() => render(<ComponentWithoutProvider />)).toThrow();
  });

  it('should return context when used inside provider', () => {
    const ComponentWithProvider = () => {
      const context = useHookContext();
      expect(context).toBe(mockHooks);
      return <div>Success</div>;
    };

    render(
      <HookProvider hooks={mockHooks}>
        <ComponentWithProvider />
      </HookProvider>
    );
  });
});
