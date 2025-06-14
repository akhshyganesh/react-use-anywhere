import { HookInjectionError } from '../errors/HookInjectionError';
import type { HookServiceInterface, HookServiceOptions } from '../types';

/**
 * Creates a generic hook service that can store and manage any type of hook
 * This is the main factory function for creating hook services
 */
export function createHookService<T = any>(
  options: HookServiceOptions<T> = {}
): HookServiceInterface<T> {
  const {
    enableWarnings = true,
    fallbackBehavior = 'warn',
    initialValue = null,
    validator,
  } = options;

  let hook: T | null = initialValue;
  let isHookReady = !!initialValue;

  const service: HookServiceInterface<T> = {
    setHook(newHook: T): void {
      // Validate hook if validator is provided
      if (validator && !validator(newHook)) {
        const error = HookInjectionError.invalidHook('hook', 'valid hook function');
        if (fallbackBehavior === 'error') {
          throw error;
        }
        if (fallbackBehavior === 'warn' && enableWarnings) {
          console.warn(error.message);
        }
        return;
      }

      hook = newHook;
      isHookReady = true;
    },

    getHook(): T | null {
      return hook;
    },

    isReady(): boolean {
      return isHookReady;
    },

    execute<R = any>(callback: (hook: T) => R): R | null {
      if (!isHookReady || !hook) {
        const error = HookInjectionError.hookNotSet();
        
        if (fallbackBehavior === 'error') {
          throw error;
        }
        
        if (fallbackBehavior === 'warn' && enableWarnings) {
          console.warn(error.message);
        }
        
        return null;
      }

      try {
        return callback(hook);
      } catch (error) {
        if (enableWarnings) {
          console.warn('Error executing callback with hook:', error);
        }
        return null;
      }
    },

    reset(): void {
      hook = initialValue;
      isHookReady = !!initialValue;
    },
  };

  return service;
}

/**
 * Creates a hook service with timeout support
 */
export function createHookServiceWithTimeout<T = any>(
  options: HookServiceOptions<T> = {}
): HookServiceInterface<T> & { waitForHook(): Promise<T> } {
  const service = createHookService(options);
  const { timeout = 5000 } = options;

  return {
    ...service,
    
    async waitForHook(): Promise<T> {
      if (service.isReady()) {
        const hook = service.getHook();
        if (hook !== null) {
          return hook;
        }
      }

      return new Promise((resolve, reject) => {
        const checkInterval = 50; // Check every 50ms
        let elapsed = 0;

        const timer = setInterval(() => {
          if (service.isReady()) {
            const hook = service.getHook();
            if (hook !== null) {
              clearInterval(timer);
              resolve(hook);
              return;
            }
          }

          elapsed += checkInterval;
          if (elapsed >= timeout) {
            clearInterval(timer);
            reject(new Error(`Hook was not ready within ${timeout}ms timeout`));
          }
        }, checkInterval);
      });
    },
  };
}

/**
 * Create a singleton hook service instance
 * Useful when you want to share the same service across your entire application
 */
const singletonServices = new Map<string, HookServiceInterface<any>>();

export function createSingletonHookService<T = any>(
  serviceId: string,
  options: HookServiceOptions<T> = {}
): HookServiceInterface<T> {
  if (!singletonServices.has(serviceId)) {
    singletonServices.set(serviceId, createHookService(options));
  }
  return singletonServices.get(serviceId)!;
}

/**
 * Get a singleton service instance (if it exists)
 */
export function getSingletonHookService<T = any>(serviceId: string): HookServiceInterface<T> | null {
  return singletonServices.get(serviceId) || null;
}

/**
 * Reset a singleton service instance
 */
export function resetSingletonHookService(serviceId: string): void {
  const service = singletonServices.get(serviceId);
  if (service?.reset) {
    service.reset();
  }
  singletonServices.delete(serviceId);
}

/**
 * Reset all singleton service instances
 */
export function resetAllSingletonHookServices(): void {
  singletonServices.forEach((service, serviceId) => {
    if (service.reset) {
      service.reset();
    }
  });
  singletonServices.clear();
}
