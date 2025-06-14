import React, { createContext, useContext, useMemo } from 'react';
import { HookInjectionError } from '../errors/HookInjectionError';
import type { HookInjectionContext, HookInjectionProviderProps } from '../types';

// Create the context with default values
const HookInjectionContextValue = createContext<HookInjectionContext | null>(null);

/**
 * Provider component that injects hooks into the context
 * This component should wrap your app or the part of your app that needs hook injection
 */
export const HookInjectionProvider: React.FC<HookInjectionProviderProps> = ({
  children,
  hooks = {},
  navigationHook, // Legacy support
  customHooks = {}, // Legacy support
}) => {
  // Build the context value from the new hooks prop
  const hookValues = useMemo(() => {
    const values: Record<string, any> = {};
    
    // Process the new hooks prop
    Object.entries(hooks).forEach(([name, hook]) => {
      try {
        values[name] = hook();
      } catch (error) {
        console.warn(`Failed to call hook "${name}":`, error);
      }
    });
    
    return values;
  }, [hooks]);

  // Legacy support: Get the navigation function if navigationHook is provided
  const navigate = useMemo(() => {
    if (navigationHook) {
      try {
        return navigationHook();
      } catch (error) {
        console.warn('Failed to call navigationHook:', error);
        return undefined;
      }
    }
    return undefined;
  }, [navigationHook]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo((): HookInjectionContext => ({
    ...hookValues,
    // Legacy support
    ...(navigate && { navigate }),
    ...customHooks,
  }), [hookValues, navigate, customHooks]);

  return (
    <HookInjectionContextValue.Provider value={contextValue}>
      {children}
    </HookInjectionContextValue.Provider>
  );
};

/**
 * Hook to access the injection context
 * Throws an error if used outside of HookInjectionProvider
 */
export const useHookInjectionContext = (): HookInjectionContext => {
  const context = useContext(HookInjectionContextValue);
  
  if (context === null) {
    throw HookInjectionError.providerNotFound();
  }
  
  return context;
};

/**
 * Higher-order component that provides hook injection context to class components
 */
export function withHookInjectionContext<P extends object>(
  Component: React.ComponentType<P & { hookInjection: HookInjectionContext }>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    const hookInjection = useHookInjectionContext();
    
    return <Component {...props} hookInjection={hookInjection} />;
  };

  WrappedComponent.displayName = `withHookInjectionContext(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
