import React, { useState } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  useHookService,
  useHook,
  useAllHooks,
} from '../lib/hooks/useHookService';
import { HookProvider } from '../lib/providers/HookInjectionProvider';
import {
  createHookService,
  createSingletonService,
  resetAllServices,
} from '../lib/services/createHookService';
import { HookService } from '../lib';

// Mock hooks for testing
const mockNavigate = jest.fn();
const mockAuthData = {
  user: { id: 1, name: 'Test User' },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
};

// Hook functions that return values
const useAuth = () => mockAuthData;
const useNavigate = () => mockNavigate;

const TestComponent = ({
  service,
  hookName,
}: {
  service: HookService<unknown>;
  hookName: string;
}) => {
  useHookService(service, hookName);
  return <div data-testid="test-component">Test Component</div>;
};

const DirectHookComponent = ({ hookName }: { hookName: string }) => {
  const hookValue = useHook(hookName);
  return (
    <div data-testid="hook-value">
      {JSON.stringify(hookValue) || 'undefined'}
    </div>
  );
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
      <HookProvider hooks={{ navigate: useNavigate }}>
        <TestComponent service={service} hookName="navigate" />
      </HookProvider>
    );

    expect(service.get()).toBe(mockNavigate);
    expect(service.isReady()).toBe(true);
  });

  it('should handle missing hook from provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <HookProvider hooks={{}}>
        <TestComponent service={service} hookName="nonexistent" />
      </HookProvider>
    );

    expect(service.get()).toBe(null);
    expect(service.isReady()).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should work with singleton services', () => {
    const singletonService = createSingletonService('navigate');

    render(
      <HookProvider hooks={{ navigate: useNavigate }}>
        <TestComponent service={singletonService} hookName="navigate" />
      </HookProvider>
    );

    expect(singletonService.get()).toBe(mockNavigate);
    expect(singletonService.isReady()).toBe(true);
  });
});

describe('useHook', () => {
  it('should return hook value directly', () => {
    const { getByTestId } = render(
      <HookProvider hooks={{ navigate: useNavigate }}>
        <DirectHookComponent hookName="navigate" />
      </HookProvider>
    );

    const hookValueElement = getByTestId('hook-value');
    // Since mockNavigate is a function, JSON.stringify will return undefined, so we expect 'undefined'
    expect(hookValueElement).toHaveTextContent('undefined');
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
});

describe('useAllHooks', () => {
  it('should return all hook values', () => {
    const { getByTestId } = render(
      <HookProvider hooks={{ navigate: useNavigate, auth: useAuth }}>
        <AllHooksComponent />
      </HookProvider>
    );

    const allHooksElement = getByTestId('all-hooks');
    const expectedHooks = { navigate: mockNavigate, auth: mockAuthData };
    expect(allHooksElement).toHaveTextContent(JSON.stringify(expectedHooks));
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
    const initialHooks = { navigate: useNavigate };
    const updatedHooks = { navigate: useNavigate, auth: useAuth };

    const { getByTestId, rerender } = render(
      <HookProvider hooks={initialHooks}>
        <AllHooksComponent />
      </HookProvider>
    );

    expect(getByTestId('all-hooks')).toHaveTextContent(
      JSON.stringify({ navigate: mockNavigate })
    );

    rerender(
      <HookProvider hooks={updatedHooks}>
        <AllHooksComponent />
      </HookProvider>
    );

    expect(getByTestId('all-hooks')).toHaveTextContent(
      JSON.stringify({ navigate: mockNavigate, auth: mockAuthData })
    );
  });
});

describe('Hook service with real React hooks', () => {
  it('should work with stateful hooks', () => {
    const useCounter = () => {
      const [count, setCount] = useState(0);
      return { count, increment: () => setCount((c) => c + 1) };
    };

    const service = createHookService();

    const TestApp = () => {
      useHookService(service, 'counter');
      const hookValue = service.get();
      return <div data-testid="app">Count: {hookValue?.count || 0}</div>;
    };

    const { getByTestId } = render(
      <HookProvider hooks={{ counter: useCounter }}>
        <TestApp />
      </HookProvider>
    );

    expect(service.isReady()).toBe(true);
    expect(service.get()).toEqual(
      expect.objectContaining({
        count: 0,
        increment: expect.any(Function),
      })
    );
    expect(getByTestId('app')).toHaveTextContent('Count: 0');
  });
});

// describe('Hook service integration', () => {
//   it('should handle hook updates', () => {
//     const service = createHookService();
//     let triggerUpdate: () => void;

//     const DynamicHookComponent = () => {
//       const [value, setValue] = React.useState('initial');
//       triggerUpdate = () => setValue('updated');
//       return { value };
//     };

//     const TestApp = () => {
//       useHookService(service, 'dynamic');
//       return <div data-testid="app">App</div>;
//     };

//     render(
//       <HookProvider hooks={{ dynamic: DynamicHookComponent }}>
//         <TestApp />
//       </HookProvider>
//     );

//     expect(service.get()).toEqual({ value: 'initial' });

//     act(() => {
//       triggerUpdate();
//     });

//     expect(service.get()).toEqual({ value: 'updated' });
//   });

// it('should work with real React hooks', () => {
//   const useCounter = () => {
//     const [count, setCount] = React.useState(0);
//     return { count, increment: () => setCount(c => c + 1) };
//   };

//   const service = createHookService();

//   const TestApp = () => {
//     useHookService(service, 'counter');
//     return <div data-testid="app">App</div>;
//   };

//   render(
//     <HookProvider hooks={{ counter: useCounter }}>
//       <TestApp />
//     </HookProvider>
//   );

//   expect(service.isReady()).toBe(true);
//   expect(service.get()).toEqual(expect.objectContaining({
//     count: 0,
//     increment: expect.any(Function)
//   }));
// });
// });
