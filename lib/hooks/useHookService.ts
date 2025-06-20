import { useEffect } from 'react';
import { useHookContext, isHookRegistered, getRegisteredHookNames } from '../providers/HookInjectionProvider';
import type { HookService } from '../types';

/**
 * Hook to connect a service to a hook value from the context
 * Use this in React components to make hook values available in services
 */
export function useHookService<T = any>(service: HookService<T>, hookName: string): void {
  const context = useHookContext();
  
  // Validate hook name
  useEffect(() => {
    if (!isHookRegistered(hookName)) {
      const registeredHooks = getRegisteredHookNames();
      const suggestions = registeredHooks
        .filter(name => name.toLowerCase().includes(hookName.toLowerCase()) || 
                       hookName.toLowerCase().includes(name.toLowerCase()))
        .slice(0, 3);
      
      const suggestionText = suggestions.length > 0 
        ? `\nDid you mean one of these?\n${suggestions.map(s => `  • "${s}"`).join('\n')}`
        : '';
      
      console.error(
        `🚨 useHookService: Hook "${hookName}" is not registered in HookProvider.\n` +
        `Available hooks: ${registeredHooks.map(h => `"${h}"`).join(', ')}${suggestionText}`
      );
    }
  }, [hookName]);
  
  useEffect(() => {
    const hookValue = context[hookName];
    if (hookValue !== undefined) {
      service._setValue(hookValue);
    }
  }, [context, hookName, service]);
}

/**
 * 🆕 TYPE-SAFE VERSION: Connect service with compile-time type checking
 */
export function useTypedHookService<
  THooks extends Record<string, any>,
  K extends keyof THooks
>(
  service: HookService<THooks[K] extends () => infer R ? R : never>,
  hookName: K
): void {
  useHookService(service, hookName as string);
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
