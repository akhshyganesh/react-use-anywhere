import { ReactNode } from 'react';

/**
 * Generic navigation function type that can work with any router
 */
export type NavigationFunction = (path: string, options?: any) => void;

/**
 * Generic navigation hook type (e.g., useNavigate from react-router-dom)
 */
export type NavigationHook = () => NavigationFunction;

/**
 * Context type for hook injection
 */
export interface HookInjectionContext {
  navigate?: NavigationFunction;
  [key: string]: any;
}

/**
 * Props for the HookInjectionProvider component
 */
export interface HookInjectionProviderProps {
  children: ReactNode;
  navigationHook?: NavigationHook;
  customHooks?: Record<string, any>;
}

/**
 * Interface for navigation service
 */
export interface NavigationServiceInterface {
  navigate(path: string, options?: any): void;
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
 * Navigation service factory options
 */
export interface NavigationServiceOptions extends ServiceConfig {
  enableBrowserNavigation?: boolean;
  baseUrl?: string;
}
