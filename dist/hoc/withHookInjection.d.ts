import { default as React } from 'react';
import { NavigationServiceInterface } from '../types';

/**
 * Higher-order component that automatically injects hooks into a service
 */
export declare function withHookInjection<P extends object>(Component: React.ComponentType<P>, service: NavigationServiceInterface, options?: {
    onReady?: () => void;
    onError?: (error: Error) => void;
}): React.FC<P>;
/**
 * Factory function to create a HOC with a specific service
 */
export declare function createHookInjectionHOC(service: NavigationServiceInterface, options?: {
    onReady?: () => void;
    onError?: (error: Error) => void;
}): <P extends object>(Component: React.ComponentType<P>) => React.FC<P>;
