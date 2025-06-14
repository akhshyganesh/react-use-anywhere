// Main library exports
export { HookInjectionProvider } from './provider/HookInjectionProvider';
export { 
  useHookInjection, 
  useHookFromContext,
  useNavigationInjection, // Legacy
  useNavigationFromContext, // Legacy
  useCustomHook, // Legacy
  useAllInjectedHooks 
} from './hooks/useHookInjection';

// Generic hook services
export { 
  createHookService,
  createHookServiceWithTimeout,
  createSingletonHookService,
  getSingletonHookService,
  resetSingletonHookService,
  resetAllSingletonHookServices
} from './services/createHookService';

// Generic hook injection service
export { createHookInjectionService } from './services/createHookInjectionService';

// Legacy navigation services (for backwards compatibility)
export { NavigationService } from './services/NavigationService';
export { 
  createNavigationService, 
  createSingletonNavigationService,
  getSingletonNavigationService,
  resetSingletonNavigationService 
} from './services/createNavigationService';

// Types
export type {
  HookInjectionContext,
  HookFunction,
  ReactHook,
  HookServiceInterface,
  HookServiceOptions,
  // Legacy types
  NavigationHook,
  NavigationFunction,
  HookInjectionProviderProps,
  NavigationServiceInterface,
  HookInjectionServiceInterface,
} from './types';

// Utilities
export { withHookInjection } from './hoc/withHookInjection';
export { HookInjectionError } from './errors/HookInjectionError';

// Version compatibility utilities
export {
  isReactVersionSupported,
  checkReactVersion,
  getReactVersion,
  getCompatibilityInfo,
  logCompatibilityInfo,
  assertReactCompatibility,
} from './utils/reactVersionCheck';
