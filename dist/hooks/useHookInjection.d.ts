import { NavigationServiceInterface } from '../types';

/**
 * Hook that automatically injects navigation function into a service
 * @param service - The service to inject the navigation function into
 * @param options - Optional configuration
 */
export declare function useHookInjection(service: NavigationServiceInterface, options?: {
    autoInject?: boolean;
    onReady?: () => void;
    onError?: (error: Error) => void;
}): void;
/**
 * Hook that provides access to the navigation function from context
 */
export declare function useNavigationFromContext(): import('../types').NavigationFunction | undefined;
/**
 * Hook that provides access to custom hooks from context
 */
export declare function useCustomHook<T = any>(hookName: string): T | undefined;
/**
 * Hook that provides access to all injected hooks
 */
export declare function useAllInjectedHooks(): import('..').HookInjectionContext;
