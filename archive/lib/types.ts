import React from 'react';

// Core hook type - represents any React hook function
export type ReactHook<T = unknown> = () => T;

/**
 * Context that holds all registered hooks
 */
export interface HookContext {
  [hookName: string]: unknown;
}

/**
 * Props for the HookProvider component
 */
export interface HookProviderProps<
  T extends Record<string, ReactHook<unknown>> = Record<
    string,
    ReactHook<unknown>
  >,
> {
  children: React.ReactNode;
  hooks: T;
}

/**
 * Service interface for managing hook values
 */
export interface HookService<T = unknown> {
  // Internal method used by useHookService
  _setValue(newValue: T): void;
  // Get the current hook value
  get(): T | null;
  // Check if the hook value is available
  isReady(): boolean;
  // Use the hook value in a callback
  use<R = unknown>(callback: (value: T) => R): R | null;
  // Reset the service (for testing)
  _reset(): void;
}

/**
 * Global hook registry to track registered hooks
 */
export interface HookRegistry {
  [key: string]: ReactHook<unknown>;
}

/**
 * Type to extract hook names from a hooks object
 */
export type HookNames<T extends Record<string, ReactHook<unknown>>> = keyof T;

/**
 * Type to extract the return type of a hook by name
 */
export type HookReturnType<
  T extends Record<string, ReactHook<unknown>>,
  K extends keyof T,
> = T[K] extends ReactHook<infer R> ? R : never;

/**
 * Branded type for validated hook names - prevents accidental string usage
 */
export type ValidatedHookName<T extends Record<string, ReactHook<unknown>>> =
  keyof T & string;

/**
 * Type-safe service interface that knows about valid hook names
 */
export interface TypedHookService<
  T = unknown,
  THooks extends Record<string, ReactHook<unknown>> = Record<
    string,
    ReactHook<unknown>
  >,
> extends HookService<T> {
  readonly _hookNames?: THooks; // Phantom property for type information
}

/**
 * Provider props with better type inference
 */
export interface TypedHookProviderProps<
  T extends Record<string, ReactHook<unknown>>,
> {
  children: React.ReactNode;
  hooks: T;
}

/**
 * Utility types for extracting hook return types
 */
export type ExtractHookType<T> = T extends ReactHook<infer R> ? R : never;

export type HookReturnTypes<T extends Record<string, ReactHook<unknown>>> = {
  [K in keyof T]: ExtractHookType<T[K]>;
};

/**
 * Service factory types
 */
export type ServiceFactory<T> = () => HookService<T>;
export type TypedServiceFactory<
  T,
  THooks extends Record<string, ReactHook<unknown>>,
> = () => TypedHookService<T, THooks>;

/**
 * Common hook value types for better type safety
 */
export interface AuthHookValue {
  user: Record<string, unknown> | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  login: (credentials: Record<string, unknown>) => Promise<void> | void;
  logout: () => void;
}

export interface ThemeHookValue {
  theme: string;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
}

export interface NavigationHookValue {
  (path: string, options?: Record<string, unknown>): void;
}

export interface ApiHookValue {
  data: unknown;
  loading: boolean;
  error: string | null;
  fetchData: (url: string) => Promise<void>;
}
