import type { HookService } from '../types';

/**
 * Creates a service that can store and use hook values from anywhere in your code
 * This is the main function to create services for your hooks
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

      try {
        return callback(value);
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
 * Create or get a singleton service - useful when you want to share the same service across your app
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
