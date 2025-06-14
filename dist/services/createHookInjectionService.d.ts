import { HookInjectionServiceInterface, HookInjectionServiceOptions } from '../types';

/**
 * Creates a generic hook injection service that can store and manage any type of hook
 */
export declare function createHookInjectionService<T = any>(options?: HookInjectionServiceOptions<T>): HookInjectionServiceInterface<T>;
/**
 * Creates a hook injection service with timeout support
 */
export declare function createHookInjectionServiceWithTimeout<T = any>(options?: HookInjectionServiceOptions<T>): HookInjectionServiceInterface<T> & {
    waitForHook(): Promise<T>;
};
