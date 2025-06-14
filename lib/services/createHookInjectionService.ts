import { HookInjectionError } from '../errors/HookInjectionError';
import type { HookInjectionServiceInterface, HookInjectionServiceOptions } from '../types';

/**
 * Creates a generic hook injection service that can store and manage any type of hook
 */
export function createHookInjectionService<T = any>(
  options: HookInjectionServiceOptions<T> = {}
): HookInjectionServiceInterface<T> {
  const {
    enableWarnings = true,
    fallbackBehavior = 'warn',
    timeout = 5000, // eslint-disable-line @typescript-eslint/no-unused-vars
    initialValue = null,
    validator,
  } = options;

  let hook: T | null = initialValue;
  let isHookReady = !!initialValue;

  console.log('Creating HookInjectionService with options:', {
    enableWarnings,
    fallbackBehavior,
    timeout,
    initialValue,
    validator,
  });

  const service: HookInjectionServiceInterface<T> = {
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
          console.error('Error executing hook callback:', error);
        }
        return null;
      }
    },
  };

  return service;
}

/**
 * Creates a hook injection service with timeout support
 */
export function createHookInjectionServiceWithTimeout<T = any>(
  options: HookInjectionServiceOptions<T> = {}
): HookInjectionServiceInterface<T> & { waitForHook(): Promise<T> } {
  const service = createHookInjectionService(options);
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
            reject(HookInjectionError.timeout('waitForHook', timeout));
          }
        }, checkInterval);
      });
    },
  };
}
