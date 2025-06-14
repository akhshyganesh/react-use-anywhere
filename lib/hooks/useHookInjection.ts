import { useEffect, useRef } from 'react';
import { useHookInjectionContext } from '../provider/HookInjectionProvider';
import type { NavigationServiceInterface, HookServiceInterface } from '../types';

/**
 * Generic hook that automatically injects any hook into a service
 * @param service - The service to inject the hook into
 * @param hookName - The name of the hook in the context
 * @param options - Optional configuration
 */
export function useHookInjection<T = any>(
  service: HookServiceInterface<T>,
  hookName: string,
  options?: {
    autoInject?: boolean;
    onReady?: () => void;
    onError?: (error: Error) => void;
  }
): void;

/**
 * Legacy hook that automatically injects navigation function into a service
 * @param service - The service to inject the navigation function into
 * @param options - Optional configuration
 * @deprecated Use useHookInjection with hookName='navigate' instead
 */
export function useHookInjection(
  service: NavigationServiceInterface,
  options?: {
    autoInject?: boolean;
    onReady?: () => void;
    onError?: (error: Error) => void;
  }
): void;

/**
 * Implementation of useHookInjection with overloads
 */
export function useHookInjection<T = any>(
  service: HookServiceInterface<T> | NavigationServiceInterface,
  hookNameOrOptions?: string | {
    autoInject?: boolean;
    onReady?: () => void;
    onError?: (error: Error) => void;
  },
  options: {
    autoInject?: boolean;
    onReady?: () => void;
    onError?: (error: Error) => void;
  } = {}
): void {
  const context = useHookInjectionContext();
  const serviceRef = useRef(service);
  
  // Determine if this is the legacy call or the new generic call
  const isLegacyCall = typeof hookNameOrOptions !== 'string';
  const hookName = isLegacyCall ? 'navigation' : hookNameOrOptions as string;
  const finalOptions = isLegacyCall ? (hookNameOrOptions as any) || {} : options;
  
  const { autoInject = true, onReady, onError } = finalOptions;
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);

  // Update refs
  serviceRef.current = service;
  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!autoInject) {
      return;
    }

    const hookValue = isLegacyCall ? context.navigate : context[hookName];
    
    if (!hookValue) {
      return;
    }

    try {
      if (isLegacyCall) {
        // Legacy navigation service
        const navService = service as NavigationServiceInterface;
        navService.setNavigate?.(hookValue);
      } else {
        // Generic hook service
        const hookService = service as HookServiceInterface<T>;
        hookService.setHook(hookValue);
      }
      onReadyRef.current?.();
    } catch (error) {
      onErrorRef.current?.(error as Error);
    }

    // Cleanup function
    return () => {
      if ('reset' in serviceRef.current && serviceRef.current.reset) {
        serviceRef.current.reset();
      }
    };
  }, [context[hookName], context.navigate, hookName, autoInject, isLegacyCall]);
}

/**
 * Legacy hook that automatically injects navigation function into a service
 * @param service - The service to inject the navigation function into
 * @param options - Optional configuration
 * @deprecated Use useHookInjection with hookName='navigate' instead
 */
export function useNavigationInjection(
  service: NavigationServiceInterface,
  options: {
    autoInject?: boolean;
    onReady?: () => void;
    onError?: (error: Error) => void;
  } = {}
): void {
  const { autoInject = true, onReady, onError } = options;
  const context = useHookInjectionContext();
  const serviceRef = useRef(service);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);

  // Update refs
  serviceRef.current = service;
  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!autoInject || !context.navigate) {
      return;
    }

    try {
      serviceRef.current.setNavigate?.(context.navigate);
      onReadyRef.current?.();
    } catch (error) {
      onErrorRef.current?.(error as Error);
    }

    // Cleanup function
    return () => {
      if (serviceRef.current.reset) {
        serviceRef.current.reset();
      }
    };
  }, [context.navigate, autoInject]);
}

/**
 * Hook that provides access to a specific hook from context
 */
export function useHookFromContext<T = any>(hookName: string): T | undefined {
  const context = useHookInjectionContext();
  return context[hookName] as T;
}

/**
 * Hook that provides access to the navigation function from context
 * @deprecated Use useHookFromContext('navigate') instead
 */
export function useNavigationFromContext() {
  const context = useHookInjectionContext();
  return context.navigate;
}

/**
 * Hook that provides access to custom hooks from context
 * @deprecated Use useHookFromContext instead
 */
export function useCustomHook<T = any>(hookName: string): T | undefined {
  const context = useHookInjectionContext();
  return context[hookName] as T;
}

/**
 * Hook that provides access to all injected hooks
 */
export function useAllInjectedHooks() {
  return useHookInjectionContext();
}
