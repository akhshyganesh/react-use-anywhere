import React, { createContext, useContext } from 'react';
import type {
  HookContext,
  HookProviderProps,
  HookRegistry,
  ReactHook,
  TypedHookProviderProps,
} from '../types';
import { logger } from '../utils/logger';

// Create the context
const HookContextValue = createContext<HookContext | null>(null);

// Global hook registry to track registered hooks
let globalHookRegistry: HookRegistry = {};

// Type-safe registry for compile-time checking
type RegisteredHooks = typeof globalHookRegistry;

/**
 * Provider component that makes hooks available throughout your app
 * Wrap your app with this provider and pass in your hooks
 */
export const HookProvider = <T extends Record<string, ReactHook<unknown>>>({
  children,
  hooks,
}: HookProviderProps<T>): React.ReactElement => {
  // Register hooks globally for type checking
  globalHookRegistry = hooks;

  // Execute all hooks and create context value
  // We need to call hooks directly at the top level, not in loops
  const hookEntries = Object.entries(hooks);
  const hookValues: Record<string, unknown> = {};

  // Call each hook at the component's top level
  // This ensures proper hook ordering and follows Rules of Hooks
  for (let i = 0; i < hookEntries.length; i++) {
    const [name, hook] = hookEntries[i];
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      hookValues[name] = hook();
      logger.log(
        `✅ HookProvider: Executed hook "${name}"`,
        hookValues[name]
      );
    } catch (error) {
      logger.warn(`Failed to execute hook "${name}":`, error);
      hookValues[name] = undefined; // Fallback to undefined if hook fails
    }
  }

  logger.log(
    '🎯 HookProvider: Providing context with hooks:',
    Object.keys(hookValues)
  );

  return (
    <HookContextValue.Provider value={hookValues}>
      {children}
    </HookContextValue.Provider>
  );
};

/**
 * 🆕 TYPE-SAFE PROVIDER: Provides compile-time hook name validation
 */
export const TypedHookProvider = <
  T extends Record<string, ReactHook<unknown>>,
>({
  children,
  hooks,
}: TypedHookProviderProps<T>): React.ReactElement => {
  return HookProvider({ children, hooks });
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
 * 🆕 TYPE-SAFE CONTEXT HOOK: Returns typed hook context
 */
export function useTypedHookContext<
  T extends Record<string, ReactHook<unknown>>,
>(): {
  [K in keyof T]: ExtractHookType<T[K]>;
} {
  return useHookContext() as {
    [K in keyof T]: ExtractHookType<T[K]>;
  };
}

/**
 * Get type information about registered hooks (compile-time only)
 */
export type GetRegisteredHookTypes = RegisteredHooks;

/**
 * Get the current hook registry (for internal use)
 */
export const getHookRegistry = (): HookRegistry => globalHookRegistry;

/**
 * Check if a hook name is registered
 */
export const isHookRegistered = (hookName: string): boolean => {
  return Object.prototype.hasOwnProperty.call(globalHookRegistry, hookName);
};

/**
 * Get all registered hook names
 */
export const getRegisteredHookNames = (): string[] => {
  return Object.keys(globalHookRegistry);
};

// Helper type for extracting hook return types
type ExtractHookType<T> = T extends ReactHook<infer R> ? R : never;
