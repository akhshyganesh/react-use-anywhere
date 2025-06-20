import type { HookService } from '../types';

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
 * 🚀 RECOMMENDED: Create or get a singleton service
 * 
 * This is the standard way to create services in react-use-anywhere.
 * Benefits:
 * - ✅ Shared state across your entire app
 * - ✅ Better performance (no duplicate instances)
 * - ✅ Consistent behavior across components
 * - ✅ Memory efficient
 * 
 * @param serviceId - Unique identifier for the service
 */
export function createSingletonService<T = any>(serviceId: string): HookService<T> {
  if (!singletonServices.has(serviceId)) {
    singletonServices.set(serviceId, createHookService<T>());
  }
  return singletonServices.get(serviceId)!;
}

/**
 * Get an existing singleton service
 */
export function getSingletonService<T = any>(serviceId: string): HookService<T> | null {
  return singletonServices.get(serviceId) || null;
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
