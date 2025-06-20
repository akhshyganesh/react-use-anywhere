import React, { createContext, useContext } from 'react';
import type { HookContext, HookProviderProps, HookRegistry } from '../types';

// Create the context
const HookContextValue = createContext<HookContext | null>(null);

// Global hook registry to track registered hooks
let globalHookRegistry: HookRegistry = {};

/**
 * Provider component that makes hooks available throughout your app
 * Wrap your app with this provider and pass in your hooks
 */
export const HookProvider = <T extends Record<string, any>>(
  { children, hooks }: HookProviderProps<T>
): JSX.Element => {
  // Register hooks globally for type checking
  globalHookRegistry = hooks;
  
  // Execute all hooks at the top level - we can't use useMemo here because it would violate Rules of Hooks
  const hookValues: Record<string, any> = {};
  
  Object.entries(hooks).forEach(([name, hook]) => {
    try {
      hookValues[name] = hook();
    } catch (error) {
      console.warn(`Failed to execute hook "${name}":`, error);
      hookValues[name] = undefined; // Fallback to undefined if hook fails
    }
  });

  return (
    <HookContextValue.Provider value={hookValues}>
      {children}
    </HookContextValue.Provider>
  );
};

/**
 * Hook to access the hook context
 * Use this inside React components to get hook values
 */
export const useHookContext = (): HookContext => {
  const context = useContext(HookContextValue);
  
  if (context === null) {
    throw new Error('useHookContext must be used within a HookProvider');
  }
  
  return context;
};

/**
 * Get the current hook registry (for internal use)
 */
export const getHookRegistry = (): HookRegistry => globalHookRegistry;

/**
 * Check if a hook name is registered
 */
export const isHookRegistered = (hookName: string): boolean => {
  return hookName in globalHookRegistry;
};

/**
 * Get all registered hook names
 */
export const getRegisteredHookNames = (): string[] => {
  return Object.keys(globalHookRegistry);
};
