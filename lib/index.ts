// Provider component to wrap your app
export { HookProvider, useHookContext } from './providers/HookInjectionProvider';

// Create services to use hooks anywhere
export { 
  createHookService, 
  createSingletonService, 
  getSingletonService, 
  resetAllServices 
} from './services/createHookService';

// Connect services to hooks in React components
export { useHookService, useHook, useAllHooks } from './hooks/useHookService';

// Types
export type { HookService, HookContext, HookProviderProps, ReactHook } from './types';
