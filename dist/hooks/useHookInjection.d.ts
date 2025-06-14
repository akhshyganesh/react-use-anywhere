import { NavigationServiceInterface, HookServiceInterface } from '../types';

/**
 * Generic hook that automatically injects any hook into a service
 * @param service - The service to inject the hook into
 * @param hookName - The name of the hook in the context
 * @param options - Optional configuration
 */
export declare function useHookInjection<T = any>(service: HookServiceInterface<T>, hookName: string, options?: {
    autoInject?: boolean;
    onReady?: () => void;
    onError?: (error: Error) => void;
}): void;
/**
 * Legacy hook that automatically injects navigation function into a service
 * @param service - The service to inject the navigation function into
 * @param options - Optional configuration
 * @deprecated Use useHookInjection with hookName='navigate' instead
 */
export declare function useHookInjection(service: NavigationServiceInterface, options?: {
    autoInject?: boolean;
    onReady?: () => void;
    onError?: (error: Error) => void;
}): void;
/**
 * Legacy hook that automatically injects navigation function into a service
 * @param service - The service to inject the navigation function into
 * @param options - Optional configuration
 * @deprecated Use useHookInjection with hookName='navigate' instead
 */
export declare function useNavigationInjection(service: NavigationServiceInterface, options?: {
    autoInject?: boolean;
    onReady?: () => void;
    onError?: (error: Error) => void;
}): void;
/**
 * Hook that provides access to a specific hook from context
 */
export declare function useHookFromContext<T = any>(hookName: string): T | undefined;
/**
 * Hook that provides access to the navigation function from context
 * @deprecated Use useHookFromContext('navigate') instead
 */
export declare function useNavigationFromContext(): any;
/**
 * Hook that provides access to custom hooks from context
 * @deprecated Use useHookFromContext instead
 */
export declare function useCustomHook<T = any>(hookName: string): T | undefined;
/**
 * Hook that provides access to all injected hooks
 */
export declare function useAllInjectedHooks(): import('..').HookInjectionContext;
