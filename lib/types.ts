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
export interface HookProviderProps {
  children: ReactNode;
  hooks: Record<string, ReactHook<any>>;
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
