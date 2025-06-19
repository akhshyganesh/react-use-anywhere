import { useEffect } from 'react';
import { useHookContext } from '../providers/HookInjectionProvider';
import type { HookService } from '../types';

/**
 * Hook to connect a service to a hook value from the context
 * Use this in React components to make hook values available in services
 */
export function useHookService<T = any>(service: HookService<T>, hookName: string): void {
  const context = useHookContext();
  
  useEffect(() => {
    const hookValue = context[hookName];
    if (hookValue !== undefined) {
      service._setValue(hookValue);
    }
  }, [context, hookName, service]);
}

/**
 * Hook to get a hook value directly from the context
 * Use this in React components when you want to use hook values directly
 */
export function useHook<T = any>(hookName: string): T | undefined {
  const context = useHookContext();
  return context[hookName] as T;
}

/**
 * Hook to get all hook values from the context
 */
export function useAllHooks(): Record<string, any> {
  return useHookContext();
}
