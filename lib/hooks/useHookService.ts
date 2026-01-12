import { useEffect, useRef } from 'react';
import * as React from 'react';
import {
  useHookContext,
  isHookRegistered,
  getRegisteredHookNames,
} from '../providers/HookInjectionProvider';
import type { HookService, ReactHook } from '../types';
import { logger } from '../utils/logger';

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
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  logger.log(
    `🔌 useHookService: Connecting service to hook "${hookName}"`,
    context[hookName]
  );

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

      logger.error(
        `🚨 useHookService: Hook "${hookName}" is not registered in HookProvider.\n` +
          `Available hooks: ${registeredHooks.map((h) => `"${h}"`).join(', ')}${suggestionText}`
      );
    }
  }, [hookName]);

  // Set the initial value synchronously during render
  const hookValue = context[hookName] as T;

  if (hookValue !== previousValueRef.current) {
    service._setValue(hookValue);
    previousValueRef.current = hookValue;

    logger.log(
      `✅ useHookService: Value set for "${hookName}" during render. Service ready:`,
      service.isReady()
    );
  }

  useEffect(() => {
    const currentHookValue = context[hookName] as T;

    logger.log(
      `📝 useHookService: Effect running for "${hookName}"`,
      currentHookValue
    );

    // Update if value changed
    if (currentHookValue !== previousValueRef.current) {
      service._setValue(currentHookValue);
      previousValueRef.current = currentHookValue;

      logger.log(
        `✅ useHookService: Value updated for "${hookName}" in effect`
      );

      // Force a re-render so components using service.get() see the new value
      forceUpdate();
    }
  }, [context, service, hookName, forceUpdate]);
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
