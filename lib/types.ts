import { ReactNode } from 'react';

/**
 * Generic hook function type - can be any function returned by a hook
 */
export type HookFunction<T = any> = T;

/**
 * Generic hook type - any React hook that returns a value
 */
export type ReactHook<T = any> = () => T;

/**
 * Legacy navigation function type for backwards compatibility
 * @deprecated Use HookFunction<NavigationFunction> instead
 */
export type NavigationFunction = (path: string, options?: any) => void;

/**
 * Legacy navigation hook type for backwards compatibility
 * @deprecated Use ReactHook<NavigationFunction> instead
 */
export type NavigationHook = () => NavigationFunction;

/**
 * Context type for hook injection - supports any number of hooks
 */
export interface HookInjectionContext {
  [hookName: string]: any;
}

/**
 * Props for the HookInjectionProvider component
 */
export interface HookInjectionProviderProps {
  children: ReactNode;
  hooks?: Record<string, ReactHook<any>>;
  // Legacy support for navigationHook
  navigationHook?: NavigationHook;
  // Legacy support for customHooks
  customHooks?: Record<string, any>;
}

/**
 * Generic service interface that can work with any hook
 */
export interface HookServiceInterface<T = any> {
  setHook(hook: T): void;
  getHook(): T | null;
  isReady(): boolean;
  execute<R = any>(callback: (hook: T) => R): R | null;
  reset?(): void;
}

/**
 * Legacy interface for navigation service (backwards compatibility)
 * @deprecated Use HookServiceInterface<NavigationFunction> instead
 */
export interface NavigationServiceInterface {
  navigate(path: string, options?: any): void;
  navigateToLogin?(loginPath?: string): void;
  navigateToHome?(homePath?: string): void;
  navigateToError?(errorPath?: string, state?: any): void;
  setNavigate?(fn: NavigationFunction): void;
  goBack?(): void;
  goForward?(): void;
  replace?(path: string, options?: any): void;
  reset?(): void;
  isReady(): boolean;
}

/**
 * Interface for generic hook injection service
 */
export interface HookInjectionServiceInterface<T = any> {
  setHook(hook: T): void;
  getHook(): T | null;
  isReady(): boolean;
  execute<R = any>(callback: (hook: T) => R): R | null;
}

/**
 * Configuration options for creating services
 */
export interface ServiceConfig {
  enableWarnings?: boolean;
  fallbackBehavior?: 'warn' | 'error' | 'silent';
  timeout?: number;
}

/**
 * Hook injection service factory options
 */
export interface HookInjectionServiceOptions<T = any> extends ServiceConfig {
  initialValue?: T;
  validator?: (hook: T) => boolean;
}

/**
 * Generic hook service factory options
 */
export interface HookServiceOptions<T = any> extends ServiceConfig {
  initialValue?: T;
  validator?: (hook: T) => boolean;
}

/**
 * Legacy navigation service factory options (backwards compatibility)
 * @deprecated Use HookServiceOptions instead
 */
export interface NavigationServiceOptions extends ServiceConfig {
  enableBrowserNavigation?: boolean;
  baseUrl?: string;
}
