import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  HookProvider,
  useHookContext,
  getRegisteredHookNames,
  isHookRegistered,
} from '../lib/providers/HookInjectionProvider';

// Test component that uses the context
const TestComponent = () => {
  const context = useHookContext();
  return (
    <div>
      {Object.entries(context).map(([key, value]) => (
        <div key={key} data-testid={`hook-${key}`}>
          {JSON.stringify(value)}
        </div>
      ))}
    </div>
  );
};

describe('HookProvider', () => {
  describe('basic rendering', () => {
    it('should render children', () => {
      render(
        <HookProvider hooks={{}}>
          <div data-testid="child">Test Child</div>
        </HookProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should provide empty context when no hooks passed', () => {
      render(
        <HookProvider hooks={{}}>
          <TestComponent />
        </HookProvider>
      );

      const elements = screen.queryAllByTestId(/hook-/);
      expect(elements).toHaveLength(0);
    });
  });

  describe('hook execution', () => {
    it('should execute hooks and provide values', () => {
      const mockHook = jest.fn(() => 'hook-value');

      render(
        <HookProvider hooks={{ test: mockHook }}>
          <TestComponent />
        </HookProvider>
      );

      expect(mockHook).toHaveBeenCalled();
      expect(screen.getByTestId('hook-test')).toHaveTextContent('"hook-value"');
    });

    it('should execute multiple hooks', () => {
      const hook1 = () => 'value1';
      const hook2 = () => 'value2';
      const hook3 = () => 'value3';

      render(
        <HookProvider
          hooks={{
            hook1,
            hook2,
            hook3,
          }}
        >
          <TestComponent />
        </HookProvider>
      );

      expect(screen.getByTestId('hook-hook1')).toHaveTextContent('"value1"');
      expect(screen.getByTestId('hook-hook2')).toHaveTextContent('"value2"');
      expect(screen.getByTestId('hook-hook3')).toHaveTextContent('"value3"');
    });

    it('should handle hooks returning objects', () => {
      const hook = () => ({ name: 'test', count: 42 });

      render(
        <HookProvider hooks={{ obj: hook }}>
          <TestComponent />
        </HookProvider>
      );

      expect(screen.getByTestId('hook-obj')).toHaveTextContent(
        '{"name":"test","count":42}'
      );
    });

    it('should handle hooks returning functions', () => {
      const mockFn = jest.fn();
      const hook = () => mockFn;

      render(
        <HookProvider hooks={{ fn: hook }}>
          <TestComponent />
        </HookProvider>
      );

      // Function should be in context (can't stringify it meaningfully)
      expect(screen.getByTestId('hook-fn')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should handle hook execution errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const errorHook = () => {
        throw new Error('Hook error');
      };

      render(
        <HookProvider hooks={{ error: errorHook }}>
          <TestComponent />
        </HookProvider>
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to execute hook "error":',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should provide undefined for failed hooks', () => {
      jest.spyOn(console, 'warn').mockImplementation();
      const errorHook = () => {
        throw new Error('Hook error');
      };

      render(
        <HookProvider hooks={{ error: errorHook }}>
          <TestComponent />
        </HookProvider>
      );

      // Component should still render
      expect(screen.getByTestId('hook-error')).toBeInTheDocument();
    });
  });

  describe('hook registry', () => {
    it('should register hooks globally', () => {
      render(
        <HookProvider
          hooks={{
            hook1: () => 'value1',
            hook2: () => 'value2',
          }}
        >
          <div />
        </HookProvider>
      );

      expect(isHookRegistered('hook1')).toBe(true);
      expect(isHookRegistered('hook2')).toBe(true);
    });

    it('should return registered hook names', () => {
      render(
        <HookProvider
          hooks={{
            auth: () => ({}),
            navigate: () => jest.fn(),
            theme: () => ({}),
          }}
        >
          <div />
        </HookProvider>
      );

      const names = getRegisteredHookNames();
      expect(names).toContain('auth');
      expect(names).toContain('navigate');
      expect(names).toContain('theme');
    });

    it('should check if hook is registered', () => {
      render(
        <HookProvider hooks={{ registered: () => 'value' }}>
          <div />
        </HookProvider>
      );

      expect(isHookRegistered('registered')).toBe(true);
      expect(isHookRegistered('notRegistered')).toBe(false);
    });
  });
});

describe('useHookContext', () => {
  it('should throw error when used outside provider', () => {
    const TestComponentWithoutProvider = () => {
      useHookContext();
      return <div />;
    };

    // Suppress error boundary console errors
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow('useHookContext must be used within a HookProvider');

    consoleErrorSpy.mockRestore();
  });

  it('should provide context when used inside provider', () => {
    const TestComponentWithProvider = () => {
      const context = useHookContext();
      return <div data-testid="result">{JSON.stringify(context)}</div>;
    };

    render(
      <HookProvider hooks={{ test: () => 'value' }}>
        <TestComponentWithProvider />
      </HookProvider>
    );

    expect(screen.getByTestId('result')).toHaveTextContent('{"test":"value"}');
  });
});
