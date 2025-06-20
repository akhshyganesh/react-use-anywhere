import { ReactNode } from 'react';

/**
 * A React hook that returns a value
 */
export type ReactHook<T = any> = () => T;

/**
 * Context that holds all registered hooks
 */
export interface HookContext {
  [hookName: string]: any;
}

/**
 * Props for the HookProvider component
 */
export interface HookProviderProps<T extends Record<string, ReactHook<any>> = Record<string, ReactHook<any>>> {
  children: ReactNode;
  hooks: T;
}

/**
 * Service interface for managing hook values
 */
export interface HookService<T = any> {
  // Internal method used by useHookService
  _setValue(newValue: T): void;
  // Get the current hook value
  get(): T | null;
  // Check if the hook value is available
  isReady(): boolean;
  // Use the hook value in a callback
  use<R = any>(callback: (value: T) => R): R | null;
  // Reset the service (for testing)
  _reset(): void;
}

/**
 * Global hook registry to track registered hooks
 */
export interface HookRegistry {
  [key: string]: ReactHook<any>;
}

/**
 * Type to extract hook names from a hooks object
 */
export type HookNames<T extends Record<string, ReactHook<any>>> = keyof T;

/**
 * Type to extract the return type of a hook by name
 */
export type HookReturnType<T extends Record<string, ReactHook<any>>, K extends keyof T> = 
  T[K] extends ReactHook<infer R> ? R : never;
