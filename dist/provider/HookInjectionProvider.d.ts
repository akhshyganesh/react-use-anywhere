import { default as React } from 'react';
import { HookInjectionContext, HookInjectionProviderProps } from '../types';

/**
 * Provider component that injects hooks into the context
 * This component should wrap your app or the part of your app that needs hook injection
 */
export declare const HookInjectionProvider: React.FC<HookInjectionProviderProps>;
/**
 * Hook to access the injection context
 * Throws an error if used outside of HookInjectionProvider
 */
export declare const useHookInjectionContext: () => HookInjectionContext;
/**
 * Higher-order component that provides hook injection context to class components
 */
export declare function withHookInjectionContext<P extends object>(Component: React.ComponentType<P & {
    hookInjection: HookInjectionContext;
}>): React.FC<P>;
