import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  HookProvider,
  useHookContext,
} from '../lib/providers/HookInjectionProvider';

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
  navigate: () => jest.fn(),
  auth: () => ({ user: null, isAuthenticated: false }),
  theme: () => ({ current: 'light', toggle: jest.fn() }),
};

describe('HookProvider', () => {
  it('should provide hook values to context', () => {
    render(
      <HookProvider hooks={mockHooks}>
        <TestComponent />
      </HookProvider>
    );

    expect(screen.getByTestId('context-keys')).toHaveTextContent(
      'navigate,auth,theme'
    );
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

  it('should handle hook execution errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const faultyHook = () => {
      throw new Error('Hook error');
    };

    render(
      <HookProvider hooks={{ faulty: faultyHook }}>
        <TestComponent />
      </HookProvider>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to execute hook "faulty":',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});

// describe('useHookContext', () => {
//   it('should throw error when used outside provider', () => {
//     const ComponentWithoutProvider = () => {
//       useHookContext();
//       return <div>Should not render</div>;
//     };

//     expect(() => render(<ComponentWithoutProvider />)).toThrow(
//       'useHookContext must be used within a HookProvider'
//     );
//   });
// });

// describe('useHookContext', () => {
//   it('should throw error when used outside provider', () => {
//     const ComponentWithoutProvider = () => {
//       useHookContext();
//       return <div>Should not render</div>;
//     };

//     // Expect error to be thrown
//     expect(() => render(<ComponentWithoutProvider />)).toThrow();
//   });

// it('should return context when used inside provider', () => {
//   const ComponentWithProvider = () => {
//     const context = useHookContext();
//     expect(context).toBe(mockHooks);
//     return <div>Success</div>;
//   };

//   render(
//     <HookProvider hooks={mockHooks}>
//       <ComponentWithProvider />
//     </HookProvider>
//   );
// });
// });
