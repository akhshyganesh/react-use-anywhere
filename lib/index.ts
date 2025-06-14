// Main library exports
export { HookInjectionProvider } from './provider/HookInjectionProvider';
export { 
  useHookInjection, 
  useNavigationFromContext, 
  useCustomHook, 
  useAllInjectedHooks 
} from './hooks/useHookInjection';
export { createHookInjectionService } from './services/createHookInjectionService';
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
  NavigationHook,
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
