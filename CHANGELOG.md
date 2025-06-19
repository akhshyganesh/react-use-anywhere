# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-06-19

### Added
- 🚀 **Simplified API**: Streamlined the core API to 3 main functions for better developer experience
- **Enhanced TypeScript Support**: Improved type definitions with better generics and type inference
- **Singleton Services**: Added `createSingletonService` and `getSingletonService` for shared services across your app
- **Service Management**: Added `resetAllServices` function for better testing support
- **Direct Hook Access**: Added `useHook` and `useAllHooks` for direct access to hook values in components
- **Better Error Handling**: Improved error messages and warnings with more context
- **Demo Application**: Complete demo showing auth, navigation, and theme management without any router dependencies

### API Changes
- **Simplified Provider**: `HookProvider` with cleaner `hooks` prop interface
- **Streamlined Service Creation**: `createHookService()` for individual services
- **Enhanced Hook Connection**: `useHookService(service, hookName)` for connecting services to hooks
- **Direct Context Access**: `useHookContext()` for accessing all hook values

### Developer Experience
- ✅ **Cleaner API**: Reduced complexity while maintaining full functionality
- ✅ **Better Documentation**: Updated README with practical examples and clear usage patterns  
- ✅ **Improved Testing**: Better test utilities and service management
- ✅ **Enhanced Type Safety**: Stronger TypeScript support with proper generic constraints

### Performance
- 🚀 **Smaller Bundle**: Removed unnecessary complexity and dependencies
- 🚀 **Optimized Context**: More efficient context updates and hook execution
- 🚀 **Better Tree Shaking**: Cleaner exports for optimal bundle sizes

## [1.0.1] - 2025-06-14

### Fixed
- 🐛 **Package Configuration**: Fixed module exports for both ESM and CommonJS
- 🐛 **Type Definitions**: Corrected TypeScript declaration files
- 🐛 **Build Process**: Improved build configuration for better compatibility

## [1.0.0] - 2025-06-14

### Added
- 🚀 **Complete Router Independence**: Removed React Router DOM dependency
- **Hook-Agnostic Design**: Now works with ANY React hooks, not just navigation
- **Generic Hook Services**: Added `createHookService` for any hook type  
- **Enhanced Provider**: Support for multiple hook types in `HookInjectionProvider`
- **Modular Architecture**: Each service handles one specific concern
- **Router Compatibility**: Works with React Router, TanStack Router, Next.js Router, or no router at all

### Updated  
- **Demo Application**: Now showcases multiple hook types (navigation, auth, theme) without React Router dependency
- **Documentation**: Updated examples to show router-agnostic usage
- **Package Keywords**: Added router-agnostic, hook-agnostic, and framework-specific terms
- **Type Definitions**: Enhanced interfaces for better generic hook support

### Breaking Changes
- 📦 **Removed React Router DOM dependency**: The library no longer depends on any specific router
- 🔧 **Updated Provider API**: `HookInjectionProvider` now uses `hooks` prop instead of just `navigationHook`

### Migration Guide
```typescript
// Old (v1.0.0) - Router specific
<HookInjectionProvider navigationHook={useNavigate}>
  <App />
</HookInjectionProvider>

// New (v1.1.0) - Router agnostic  
<HookInjectionProvider hooks={{ 
  navigation: useNavigate, // or useRouter, or any navigation hook
  auth: useAuth,
  theme: useTheme 
}}>
  <App />
</HookInjectionProvider>
```

### Benefits
- ✅ **Universal Compatibility**: Works with any React router or no router at all
- ✅ **Reduced Bundle Size**: No unnecessary router dependencies  
- ✅ **Greater Flexibility**: Use any hooks in non-React files
- ✅ **Future Proof**: Independent of router library versions and changes

## [0.0.2] - 2025-06-14

### Added
- 🎉 **Production-ready release** of React Hook Injection Pattern library
- **TypeScript Support**: Full TypeScript definitions and type safety
- **React Compatibility**: Support for React 16.8+ (all versions with hooks)
- **Zero Dependencies**: Eliminated multiple React instances issues by using peer dependencies
- **Router Agnostic**: Works with any React router implementation
- **Comprehensive Error Handling**: Custom error classes and fallback mechanisms
- **Multiple Patterns**: Support for singleton, factory, and provider patterns
- **Automatic Injection**: `useHookInjection` hook for seamless dependency injection
- **Tree Shaking**: Optimized bundle size with ES modules

### Components
- `HookInjectionProvider`: Main provider component for context management
- `useHookInjection`: Hook for automatic service injection
- `useNavigationFromContext`: Direct access to navigation from context
- `useCustomHook`: Access to custom hooks by name
- `useAllInjectedHooks`: Access to all injected hooks

### Services
- `NavigationService`: Production-ready navigation service class
- `createNavigationService`: Factory for creating navigation service instances
- `createSingletonNavigationService`: Factory for singleton navigation services
- `createHookInjectionService`: Generic factory for any hook type

### Utilities
- `withHookInjection`: Higher-order component for automatic injection
- `HookInjectionError`: Custom error class with specific error codes
- Comprehensive TypeScript interfaces and types

### Configuration Options
- `enableWarnings`: Toggle for warning messages
- `fallbackBehavior`: Configurable error handling ('warn', 'error', 'silent')
- `timeout`: Configurable timeout for async operations
- `validator`: Custom validation for injected hooks

### Documentation
- **Comprehensive README**: Complete API documentation and examples
- **Migration Guide**: Upgrade path from previous versions
- **Examples**: Multiple working examples for different use cases
- **TypeScript Examples**: Full TypeScript implementation examples

### Build System
- **Dual Format**: ES modules and CommonJS support
- **Source Maps**: Development and debugging support
- **Type Declarations**: Automatic TypeScript declaration generation
- **Tree Shaking**: Optimized for modern bundlers

### Testing
- **Test Setup**: Jest configuration for comprehensive testing
- **Coverage**: Test coverage reporting
- **Mock Support**: Easy mocking for testing services

## [0.0.1] - 2025-06-14

### Added
- Initial proof-of-concept implementation
- Basic navigation service with singleton pattern
- Simple hook injection mechanism
- Demo application with React Router

### Issues Fixed in v1.0.0
- ❌ Multiple React instances error when used as npm package
- ❌ Limited TypeScript support
- ❌ No error handling
- ❌ Hard-coded for navigation only
- ❌ No production optimizations
- ❌ Missing comprehensive documentation
