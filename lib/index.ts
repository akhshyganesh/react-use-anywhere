// Core exports
export { HookProvider, TypedHookProvider, useHookContext, useTypedHookContext } from './providers/HookInjectionProvider';
export { 
  useHookService, 
  useTypedHookService, 
  useStrictHookService, 
  useHook, 
  useTypedHook, 
  useStrictHook, 
  useAllHooks 
} from './hooks/useHookService';
export { 
  createHookService, 
  createSingletonService, 
  getSingletonService, 
  resetAllServices,
  createTypedSingletonService,
  createStrictSingletonService,
  createInferredSingletonService
} from './services/createHookService';

// Type exports
export type {
  ReactHook,
  HookService,
  TypedHookService,
  HookContext,
  HookRegistry,
  HookProviderProps,
  TypedHookProviderProps,
  ExtractHookType,
  HookReturnTypes,
  ServiceFactory,
  TypedServiceFactory
} from './types';
