import type { HookService, ReactHook, TypedHookService } from '../types';
import {
  isHookRegistered,
  getRegisteredHookNames,
} from '../providers/HookInjectionProvider';

/**
 * Creates a service that can store and use hook values from anywhere in your code
 *
 * ⚠️ RECOMMENDATION: Use `createSingletonService` instead for better performance and state consistency
 *
 * This creates a NEW instance every time it's called. For most React applications,
 * you want shared state across components, so use `createSingletonService` instead.
 *
 * Only use this if you specifically need multiple independent instances.
 */
export function createHookService<T = unknown>(): HookService<T> {
  let value: T | null = null;
  let ready = false;

  return {
    // Internal method used by useHookService - don't call directly
    _setValue(newValue: T) {
      // Use reference equality for better performance
      // This works well with React's state updates which maintain referential stability
      if (newValue !== value || !ready) {
        value = newValue;
        ready = true;
      }
    },

    // Get the current hook value
    get(): T | null {
      return value;
    },

    // Check if the hook value is available
    isReady(): boolean {
      return ready;
    },

    // Use the hook value in a callback - this is the main way to use hooks in non-React files
    use<R = unknown>(callback: (hookValue: T) => R): R | null {
      if (!ready) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            "Hook service not ready. Make sure you're using useHookService in a React component."
          );
        }
        return null;
      }

      try {
        return callback(value as T);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error using hook service:', error);
        }
        return null;
      }
    },

    // Reset the service (for testing)
    _reset() {
      value = null;
      ready = false;
    },
  };
}

// Store for singleton services
const singletonServices = new Map<string, HookService<unknown>>();

/**
 * Validate that the hook name is registered
 */
function validateHookName(hookName: string): void {
  const registeredHooks = getRegisteredHookNames();

  if (registeredHooks.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `🚨 No hooks registered yet. Make sure to wrap your app with HookProvider first.\n` +
          `Example: <HookProvider hooks={{ ${hookName}: your${hookName.charAt(0).toUpperCase() + hookName.slice(1)}Hook }}>`
      );
    }
    return;
  }

  if (!isHookRegistered(hookName)) {
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
        `🚨 Hook "${hookName}" is not registered in HookProvider.\n` +
          `Available hooks: ${registeredHooks.map((h) => `"${h}"`).join(', ')}${suggestionText}\n\n` +
          `💡 Make sure your HookProvider includes:\n` +
          `<HookProvider hooks={{ ${hookName}: your${hookName.charAt(0).toUpperCase() + hookName.slice(1)}Hook, ...other hooks }}>`
      );
    }
  }
}

/**
 * 🚀 RECOMMENDED: Create or get a singleton service
 *
 * This is the standard way to create services in react-use-anywhere.
 * Benefits:
 * - ✅ Shared state across your entire app
 * - ✅ Better performance (no duplicate instances)
 * - ✅ Consistent behavior across components
 * - ✅ Memory efficient
 *
 * @param hookName - Name of the hook as registered in HookProvider
 */
export function createSingletonService<T = unknown>(
  hookName: string
): HookService<T> {
  if (!singletonServices.has(hookName)) {
    singletonServices.set(hookName, createHookService<T>());
  }
  return singletonServices.get(hookName)! as HookService<T>;
}

/**
 * Get an existing singleton service
 */
export function getSingletonService<T = unknown>(
  hookName: string
): HookService<T> | null {
  const service = singletonServices.get(hookName);
  return service ? (service as HookService<T>) : null;
}

/**
 * Reset all singleton services (useful for testing)
 */
export function resetAllServices(): void {
  singletonServices.forEach((service) => {
    service._reset();
  });
  singletonServices.clear();
}

/**
 * 🆕 TYPE-SAFE VERSION: Create a service with full type safety
 * Use this when you want compile-time checking of hook names
 *
 * @param hookName - Hook name (will be type-checked against registered hooks)
 */
export function createTypedSingletonService<
  THooks extends Record<string, ReactHook<unknown>>,
  K extends keyof THooks,
>(hookName: K): HookService<ExtractHookType<THooks[K]>> {
  return createSingletonService(hookName as string);
}

/**
 * 🆕 STRICT TYPE-SAFE VERSION: Enforces hook name validation at compile time
 * This version will show TypeScript errors if you use invalid hook names
 *
 * Usage:
 * ```typescript
 * // First, define your hooks type
 * type MyHooks = {
 *   navigate: () => NavigateFunction;
 *   auth: () => AuthState;
 * };
 *
 * // Then create services with compile-time validation
 * const navService = createStrictSingletonService<MyHooks>('navigate'); // ✅ Valid
 * const badService = createStrictSingletonService<MyHooks>('invalid'); // ❌ TypeScript Error
 * ```
 */
export function createStrictSingletonService<
  THooks extends Record<string, ReactHook<unknown>>,
>(
  hookName: keyof THooks & string
): HookService<ExtractHookType<THooks[typeof hookName]>> {
  // Runtime validation still happens
  validateHookName(hookName);

  if (!singletonServices.has(hookName)) {
    singletonServices.set(hookName, createHookService());
  }
  return singletonServices.get(hookName)! as HookService<
    ExtractHookType<THooks[typeof hookName]>
  >;
}

/**
 * 🆕 INFERRED TYPE-SAFE VERSION: Automatically infers types from provider
 * This creates services that are automatically typed based on your HookProvider setup
 */
export function createInferredSingletonService<
  THooks extends Record<string, ReactHook<unknown>>,
  K extends keyof THooks,
>(hookName: K): TypedHookService<ExtractHookType<THooks[K]>, THooks> {
  return createSingletonService(hookName as string) as TypedHookService<
    ExtractHookType<THooks[K]>,
    THooks
  >;
}

// Helper type for extracting hook return types
type ExtractHookType<T> = T extends ReactHook<infer R> ? R : never;
