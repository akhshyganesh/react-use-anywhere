import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHookService, useHook, useAllHooks } from '../lib/hooks/useHookService';
import { HookProvider } from '../lib/providers/HookInjectionProvider';
import { createHookService, createSingletonService, resetAllServices } from '../lib/services/createHookService';

// Mock hooks for testing
const mockNavigate = jest.fn();
const mockAuthData = {
  user: { id: 1, name: 'Test User' },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn()
};
const mockAuth = () => mockAuthData;

const TestComponent = ({ service, hookName }: { service: any; hookName: string }) => {
  useHookService(service, hookName);
  return <div data-testid="test-component">Test Component</div>;
};

const DirectHookComponent = ({ hookName }: { hookName: string }) => {
  const hookValue = useHook(hookName);
  return <div data-testid="hook-value">{JSON.stringify(hookValue)}</div>;
};

const AllHooksComponent = () => {
  const allHooks = useAllHooks();
  return <div data-testid="all-hooks">{JSON.stringify(allHooks)}</div>;
};

describe('useHookService', () => {
  let service: ReturnType<typeof createHookService>;

  beforeEach(() => {
    service = createHookService();
    resetAllServices();
    jest.clearAllMocks();
  });

  it('should connect service to hook from provider', () => {
    render(
      <HookProvider hooks={{ navigate: mockNavigate }}>
        <TestComponent service={service} hookName="navigate" />
      </HookProvider>
    );

    expect(service.get()).toBe(mockNavigate);
    expect(service.isReady()).toBe(true);
  });

  it('should handle missing hook from provider', () => {
    render(
      <HookProvider hooks={{}}>
        <TestComponent service={service} hookName="nonexistent" />
      </HookProvider>
    );

    expect(service.get()).toBe(null);
    expect(service.isReady()).toBe(false);
  });

  it('should update service when hook changes', () => {
    const { rerender } = render(
      <HookProvider hooks={{ navigate: mockNavigate }}>
        <TestComponent service={service} hookName="navigate" />
      </HookProvider>
    );

    expect(service.get()).toBe(mockNavigate);

    const newNavigate = jest.fn();
    rerender(
      <HookProvider hooks={{ navigate: newNavigate }}>
        <TestComponent service={service} hookName="navigate" />
      </HookProvider>
    );

    expect(service.get()).toBe(newNavigate);
  });

  it('should handle multiple services', () => {
    const authService = createHookService();
    const navigationService = createHookService();

    const MultiServiceComponent = () => {
      useHookService(authService, 'auth');
      useHookService(navigationService, 'navigate');
      return <div>Multi Service</div>;
    };

    render(
      <HookProvider hooks={{ auth: mockAuth, navigate: mockNavigate }}>
        <MultiServiceComponent />
      </HookProvider>
    );

    expect(authService.get()).toBe(mockAuth);
    expect(navigationService.get()).toBe(mockNavigate);
  });

  it('should work with singleton services', () => {
    const singletonService = createSingletonService('test');

    render(
      <HookProvider hooks={{ navigate: mockNavigate }}>
        <TestComponent service={singletonService} hookName="navigate" />
      </HookProvider>
    );

    expect(singletonService.get()).toBe(mockNavigate);

    // Should maintain state when accessed from different components
    const anotherSingletonService = createSingletonService('test');
    expect(anotherSingletonService.get()).toBe(mockNavigate);
  });
});

describe('useHook', () => {
  it('should return hook value directly', () => {
    const { getByTestId } = render(
      <HookProvider hooks={{ navigate: mockNavigate }}>
        <DirectHookComponent hookName="navigate" />
      </HookProvider>
    );

    const hookValueElement = getByTestId('hook-value');
    expect(hookValueElement).toHaveTextContent(JSON.stringify(mockNavigate));
  });

  it('should return undefined for missing hook', () => {
    const { getByTestId } = render(
      <HookProvider hooks={{}}>
        <DirectHookComponent hookName="nonexistent" />
      </HookProvider>
    );

    const hookValueElement = getByTestId('hook-value');
    expect(hookValueElement).toHaveTextContent('undefined');
  });

  it('should handle complex hook values', () => {
    const { getByTestId } = render(
      <HookProvider hooks={{ auth: mockAuth }}>
        <DirectHookComponent hookName="auth" />
      </HookProvider>
    );

    const hookValueElement = getByTestId('hook-value');
    expect(hookValueElement).toHaveTextContent(JSON.stringify(mockAuth));
  });
});

describe('useAllHooks', () => {
  it('should return all hook values', () => {
    const hooks = { navigate: mockNavigate, auth: mockAuth };
    
    const { getByTestId } = render(
      <HookProvider hooks={hooks}>
        <AllHooksComponent />
      </HookProvider>
    );

    const allHooksElement = getByTestId('all-hooks');
    expect(allHooksElement).toHaveTextContent(JSON.stringify(hooks));
  });

  it('should return empty object when no hooks provided', () => {
    const { getByTestId } = render(
      <HookProvider hooks={{}}>
        <AllHooksComponent />
      </HookProvider>
    );

    const allHooksElement = getByTestId('all-hooks');
    expect(allHooksElement).toHaveTextContent('{}');
  });

  it('should update when hooks change', () => {
    const initialHooks = { navigate: mockNavigate };
    const updatedHooks = { navigate: mockNavigate, auth: mockAuth };

    const { getByTestId, rerender } = render(
      <HookProvider hooks={initialHooks}>
        <AllHooksComponent />
      </HookProvider>
    );

    expect(getByTestId('all-hooks')).toHaveTextContent(JSON.stringify(initialHooks));

    rerender(
      <HookProvider hooks={updatedHooks}>
        <AllHooksComponent />
      </HookProvider>
    );

    expect(getByTestId('all-hooks')).toHaveTextContent(JSON.stringify(updatedHooks));
  });
});

describe('Hook service integration', () => {
  it('should work with real React hooks', () => {
    const useCounter = () => {
      const [count, setCount] = React.useState(0);
      return { count, increment: () => setCount(c => c + 1) };
    };

    const CounterComponent = () => {
      const counter = useCounter();
      return counter;
    };

    const service = createHookService();
    
    const TestApp = () => {
      useHookService(service, 'counter');
      return <div data-testid="app">App</div>;
    };

    render(
      <HookProvider hooks={{ counter: CounterComponent }}>
        <TestApp />
      </HookProvider>
    );

    expect(service.isReady()).toBe(true);
    expect(service.get()).toEqual(expect.objectContaining({
      count: 0,
      increment: expect.any(Function)
    }));
  });

  it('should handle hook updates', () => {
    const service = createHookService();
    let triggerUpdate: () => void;

    const DynamicHookComponent = () => {
      const [value, setValue] = React.useState('initial');
      triggerUpdate = () => setValue('updated');
      return { value };
    };

    const TestApp = () => {
      useHookService(service, 'dynamic');
      return <div data-testid="app">App</div>;
    };

    render(
      <HookProvider hooks={{ dynamic: DynamicHookComponent }}>
        <TestApp />
      </HookProvider>
    );

    expect(service.get()).toEqual({ value: 'initial' });

    act(() => {
      triggerUpdate();
    });

    expect(service.get()).toEqual({ value: 'updated' });
  });
});
