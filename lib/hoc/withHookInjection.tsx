import React from 'react';
import { useHookInjection } from '../hooks/useHookInjection';
import type { NavigationServiceInterface } from '../types';

/**
 * Higher-order component that automatically injects hooks into a service
 */
export function withHookInjection<P extends object>(
  Component: React.ComponentType<P>,
  service: NavigationServiceInterface,
  options?: {
    onReady?: () => void;
    onError?: (error: Error) => void;
  }
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    useHookInjection(service, options);
    
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withHookInjection(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Factory function to create a HOC with a specific service
 */
export function createHookInjectionHOC(
  service: NavigationServiceInterface,
  options?: {
    onReady?: () => void;
    onError?: (error: Error) => void;
  }
) {
  return function <P extends object>(Component: React.ComponentType<P>): React.FC<P> {
    return withHookInjection(Component, service, options);
  };
}
