import React from 'react';
import { render, renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HookProvider } from '../lib/providers/HookInjectionProvider';
import { useHookService, useHook, useAllHooks } from '../lib/hooks/useHookService';
import { createHookService, resetAllServices } from '../lib/services/createHookService';

describe('useHookService', () => {
  beforeEach(() => {
    resetAllServices();
    jest.clearAllMocks();
  });

  it('should connect service to hook value', () => {
    const service = createHookService<string>();
    const mockHook = () => 'test-value';

    const TestComponent = () => {
      useHookService(service, 'test');
      return null;
    };

    render(
      <HookProvider hooks={{ test: mockHook }}>
        <TestComponent />
      </HookProvider>
    );

    expect(service.get()).toBe('test-value');
    expect(service.isReady()).toBe(true);
  });

  it('should update service when hook value changes', () => {
    const service = createHookService<number>();
    let count = 0;
    const mockHook = () => count;

    const TestComponent = () => {
      useHookService(service, 'counter');
      return null;
    };

    const { rerender } = render(
      <HookProvider hooks={{ counter: mockHook }}>
        <TestComponent />
      </HookProvider>
    );

    expect(service.get()).toBe(0);

    count = 5;
    rerender(
      <HookProvider hooks={{ counter: mockHook }}>
        <TestComponent />
      </HookProvider>
    );

    expect(service.get()).toBe(5);
  });

  it('should warn when hook name is not registered', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const service = createHookService();

    const TestComponent = () => {
      useHookService(service, 'nonexistent');
      return null;
    };

    render(
      <HookProvider hooks={{ registered: () => 'value' }}>
        <TestComponent />
      </HookProvider>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Hook "nonexistent" is not registered')
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should suggest similar hook names when not found', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const service = createHookService();

    const TestComponent = () => {
      useHookService(service, 'navig');
      return null;
    };

    render(
      <HookProvider hooks={{ navigate: () => jest.fn(), navigation: () => jest.fn() }}>
        <TestComponent />
      </HookProvider>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Did you mean one of these?')
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should handle object values', () => {
    const service = createHookService<{ name: string; age: number }>();
    const mockHook = () => ({ name: 'John', age: 30 });

    const TestComponent = () => {
      useHookService(service, 'user');
      return null;
    };

    render(
      <HookProvider hooks={{ user: mockHook }}>
        <TestComponent />
      </HookProvider>
    );

    expect(service.get()).toEqual({ name: 'John', age: 30 });
  });

  it('should handle function values', () => {
    const mockNavigate = jest.fn();
    const service = createHookService<typeof mockNavigate>();
    const mockHook = () => mockNavigate;

    const TestComponent = () => {
      useHookService(service, 'navigate');
      return null;
    };

    render(
      <HookProvider hooks={{ navigate: mockHook }}>
        <TestComponent />
      </HookProvider>
    );

    const navigate = service.get();
    expect(navigate).toBe(mockNavigate);
  });

  it('should work with multiple services', () => {
    const authService = createHookService<{ user: string }>();
    const navService = createHookService<() => void>();

    const mockAuth = () => ({ user: 'John' });
    const mockNav = () => jest.fn();

    const TestComponent = () => {
      useHookService(authService, 'auth');
      useHookService(navService, 'navigate');
      return null;
    };

    render(
      <HookProvider hooks={{ auth: mockAuth, navigate: mockNav }}>
        <TestComponent />
      </HookProvider>
    );

    expect(authService.get()).toEqual({ user: 'John' });
    expect(navService.get()).toBeInstanceOf(Function);
  });
});

describe('useHook', () => {
  beforeEach(() => {
    resetAllServices();
  });

  it('should return hook value directly', () => {
    const TestComponent = () => {
      const value = useHook<string>('test');
      return <div data-testid="value">{value}</div>;
    };

    render(
      <HookProvider hooks={{ test: () => 'direct-value' }}>
        <TestComponent />
      </HookProvider>
    );

    const element = document.querySelector('[data-testid="value"]');
    expect(element?.textContent).toBe('direct-value');
  });

  it('should return undefined for non-existent hook', () => {
    const TestComponent = () => {
      const value = useHook('nonexistent');
      return <div data-testid="value">{value === undefined ? 'undefined' : 'defined'}</div>;
    };

    render(
      <HookProvider hooks={{ test: () => 'value' }}>
        <TestComponent />
      </HookProvider>
    );

    const element = document.querySelector('[data-testid="value"]');
    expect(element?.textContent).toBe('undefined');
  });

  it('should work with typed values', () => {
    interface User {
      name: string;
      email: string;
    }

    const TestComponent = () => {
      const user = useHook<User>('user');
      return <div data-testid="user">{user ? user.name : 'no user'}</div>;
    };

    render(
      <HookProvider hooks={{ user: () => ({ name: 'Jane', email: 'jane@example.com' }) }}>
        <TestComponent />
      </HookProvider>
    );

    const element = document.querySelector('[data-testid="user"]');
    expect(element?.textContent).toBe('Jane');
  });
});

describe('useAllHooks', () => {
  it('should return all hook values', () => {
    const TestComponent = () => {
      const allHooks = useAllHooks();
      return <div data-testid="hooks">{JSON.stringify(allHooks)}</div>;
    };

    render(
      <HookProvider
        hooks={{
          hook1: () => 'value1',
          hook2: () => 'value2',
          hook3: () => 42,
        }}
      >
        <TestComponent />
      </HookProvider>
    );

    const element = document.querySelector('[data-testid="hooks"]');
    const parsed = JSON.parse(element?.textContent || '{}');

    expect(parsed).toEqual({
      hook1: 'value1',
      hook2: 'value2',
      hook3: 42,
    });
  });

  it('should return empty object when no hooks', () => {
    const TestComponent = () => {
      const allHooks = useAllHooks();
      return <div data-testid="hooks">{JSON.stringify(allHooks)}</div>;
    };

    render(
      <HookProvider hooks={{}}>
        <TestComponent />
      </HookProvider>
    );

    const element = document.querySelector('[data-testid="hooks"]');
    expect(element?.textContent).toBe('{}');
  });
});
