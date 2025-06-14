import { useEffect, useRef } from 'react';
import { useHookInjectionContext } from '../provider/HookInjectionProvider';
import type { NavigationServiceInterface } from '../types';

/**
 * Hook that automatically injects navigation function into a service
 * @param service - The service to inject the navigation function into
 * @param options - Optional configuration
 */
export function useHookInjection(
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
 * Hook that provides access to the navigation function from context
 */
export function useNavigationFromContext() {
  const context = useHookInjectionContext();
  return context.navigate;
}

/**
 * Hook that provides access to custom hooks from context
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
