import type { HookService } from '../types';
import { isHookRegistered, getRegisteredHookNames } from '../providers/HookInjectionProvider';

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
export function createHookService<T = any>(): HookService<T> {
  let value: T | null = null;
  let ready = false;

  return {
    // Internal method used by useHookService - don't call directly
    _setValue(newValue: T) {
      value = newValue;
      ready = true;
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
    use<R = any>(callback: (hookValue: T) => R): R | null {
      if (!ready || !value) {
        console.warn('Hook service not ready. Make sure you\'re using useHookService in a React component.');
        return null;
      }

      // Allow null/undefined values when service is ready
      try {
        return callback(value as T);
      } catch (error) {
        console.error('Error using hook service:', error);
        return null;
      }
    },

    // Reset the service (for testing)
    _reset() {
      value = null;
      ready = false;
    }
  };
}

// Store for singleton services
const singletonServices = new Map<string, HookService<any>>();

/**
 * Validate that the hook name is registered
 */
function validateHookName(hookName: string): void {
  const registeredHooks = getRegisteredHookNames();
  
  if (registeredHooks.length === 0) {
    console.warn(
      `🚨 No hooks registered yet. Make sure to wrap your app with HookProvider first.\n` +
      `Example: <HookProvider hooks={{ ${hookName}: your${hookName.charAt(0).toUpperCase() + hookName.slice(1)}Hook }}>`
    );
    return;
  }
  
  if (!isHookRegistered(hookName)) {
    const suggestions = registeredHooks
      .filter(name => name.toLowerCase().includes(hookName.toLowerCase()) || 
                     hookName.toLowerCase().includes(name.toLowerCase()))
      .slice(0, 3);
    
    const suggestionText = suggestions.length > 0 
      ? `\nDid you mean one of these?\n${suggestions.map(s => `  • "${s}"`).join('\n')}`
      : '';
    
    console.error(
      `🚨 Hook "${hookName}" is not registered in HookProvider.\n` +
      `Available hooks: ${registeredHooks.map(h => `"${h}"`).join(', ')}${suggestionText}\n\n` +
      `💡 Make sure your HookProvider includes:\n` +
      `<HookProvider hooks={{ ${hookName}: your${hookName.charAt(0).toUpperCase() + hookName.slice(1)}Hook, ...other hooks }}>`
    );
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
export function createSingletonService<T = any>(hookName: string): HookService<T> {
  // Validate hook name at runtime
  validateHookName(hookName);
  
  if (!singletonServices.has(hookName)) {
    singletonServices.set(hookName, createHookService<T>());
  }
  return singletonServices.get(hookName)!;
}

/**
 * Get an existing singleton service
 */
export function getSingletonService<T = any>(hookName: string): HookService<T> | null {
  validateHookName(hookName);
  return singletonServices.get(hookName) || null;
}

/**
 * Reset all singleton services (useful for testing)
 */
export function resetAllServices(): void {
  singletonServices.forEach(service => {
    (service as any)._reset();
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
  THooks extends Record<string, any>,
  K extends keyof THooks
>(hookName: K): HookService<THooks[K] extends () => infer R ? R : never> {
  return createSingletonService(hookName as string);
}
