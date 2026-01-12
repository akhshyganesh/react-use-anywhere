import { useEffect, useRef } from 'react';
import {
  useHookContext,
  isHookRegistered,
  getRegisteredHookNames,
} from '../providers/HookInjectionProvider';
import type { HookService, ReactHook } from '../types';

/**
 * Hook to connect a service to a hook value from the context
 * Use this in React components to make hook values available in services
 */
export function useHookService<T = unknown>(
  service: HookService<T>,
  hookName: string
): void {
  const context = useHookContext();
  const previousValueRef = useRef<T | undefined>(undefined);

  // Validate hook name
  useEffect(() => {
    if (!isHookRegistered(hookName)) {
      const registeredHooks = getRegisteredHookNames();
      const suggestions = registeredHooks
        .filter(
          (name) =>
            name.toLowerCase().includes(hookName.toLowerCase()) ||
            hookName.toLowerCase().includes(name.toLowerCase())
        )
        .slice(0, 3);

      const suggestionText =
        suggestions.length > 0
          ? `\nDid you mean one of these?\n${suggestions.map((s) => `  • "${s}"`).join('\n')}`
          : '';

      if (process.env.NODE_ENV !== 'production') {
        console.error(
          `🚨 useHookService: Hook "${hookName}" is not registered in HookProvider.\n` +
            `Available hooks: ${registeredHooks.map((h) => `"${h}"`).join(', ')}${suggestionText}`
        );
      }
    }
  }, [hookName]);

  useEffect(() => {
    const hookValue = context[hookName] as T;

    // Only update if the value actually changed (reference equality check)
    // For better performance, we use reference equality instead of deep comparison
    // If you need deep comparison, consider using React.memo or custom comparison
    if (hookValue !== previousValueRef.current) {
      service._setValue(hookValue);
      previousValueRef.current = hookValue;
    }
  }, [context[hookName], service, hookName]); // Only depend on the specific hook value, not entire context
}

/**
 * 🆕 TYPE-SAFE VERSION: Connect service with compile-time type checking
 */
export function useTypedHookService<
  THooks extends Record<string, ReactHook<unknown>>,
  K extends keyof THooks,
>(service: HookService<ExtractHookType<THooks[K]>>, hookName: K): void {
  useHookService(service, hookName as string);
}

/**
 * 🆕 STRICT TYPE-SAFE VERSION: Enforces valid hook names at compile time
 * This will show TypeScript errors for invalid hook names
 *
 * Usage:
 * ```typescript
 * // Define your hook types
 * type AppHooks = {
 *   navigate: () => NavigateFunction;
 *   auth: () => AuthState;
 * };
 *
 * // Use with type checking
 * useStrictHookService<AppHooks>(navService, 'navigate'); // ✅ Valid
 * useStrictHookService<AppHooks>(navService, 'invalid');  // ❌ TypeScript Error
 * ```
 */
export function useStrictHookService<
  THooks extends Record<string, ReactHook<unknown>>,
>(
  service: HookService<ExtractHookType<THooks[keyof THooks]>>,
  hookName: keyof THooks & string
): void {
  useHookService(service, hookName);
}

/**
 * 🆕 TYPE-SAFE HOOK ACCESS: Get hook value with compile-time type checking
 */
export function useTypedHook<
  THooks extends Record<string, ReactHook<unknown>>,
  K extends keyof THooks,
>(hookName: K): ExtractHookType<THooks[K]> {
  const context = useHookContext();
  return context[hookName as string] as ExtractHookType<THooks[K]>;
}

/**
 * 🆕 STRICT TYPED HOOK ACCESS: Enforces valid hook names at compile time
 */
export function useStrictHook<
  THooks extends Record<string, ReactHook<unknown>>,
>(hookName: keyof THooks & string): ExtractHookType<THooks[typeof hookName]> {
  return useHook(hookName) as ExtractHookType<THooks[typeof hookName]>;
}

/**
 * Hook to get a hook value directly from the context
 * Use this in React components when you want to use hook values directly
 */
export function useHook<T = unknown>(hookName: string): T | undefined {
  const context = useHookContext();
  return Object.prototype.hasOwnProperty.call(context, hookName)
    ? (context[hookName] as T)
    : undefined;
}

/**
 * Hook to get all hook values from the context
 */
export function useAllHooks(): Record<string, unknown> {
  return useHookContext();
}

// Helper type for extracting hook return types
type ExtractHookType<T> = T extends ReactHook<infer R> ? R : never;
