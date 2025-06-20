// Provider component to wrap your app
export { HookProvider, useHookContext } from './providers/HookInjectionProvider';

// 🚀 RECOMMENDED: Create singleton services (standard approach)
export { 
  createSingletonService,
  getSingletonService, 
  resetAllServices,
  createTypedSingletonService
} from './services/createHookService';

// ⚠️ ADVANCED: Only use if you need multiple independent instances
export { createHookService } from './services/createHookService';

// Connect services to hooks in React components
export { useHookService, useHook, useAllHooks, useTypedHookService } from './hooks/useHookService';

// Types
export type { HookService, HookContext, HookProviderProps, ReactHook } from './types';
