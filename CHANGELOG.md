# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-12

### 🎉 Initial Release

The first production-ready release of `react-use-anywhere` - a library that enables React hooks to be used anywhere in your codebase.

### Features

#### Core Functionality

- **Hook Provider**: `HookProvider` component to register and execute hooks at the top level
- **Service Creation**: `createSingletonService()` for creating shared service instances
- **Hook Connection**: `useHookService()` to connect services to hook values in components
- **Direct Access**: `useHook()` and `useAllHooks()` for direct hook value access

#### Type Safety

- **Full TypeScript Support**: Complete type definitions with generics
- **Type-Safe Variants**: `createTypedSingletonService`, `createStrictSingletonService`
- **Branded Types**: Compile-time hook name validation
- **Type Inference**: Automatic type inference from hook definitions

#### Developer Experience

- **Zero Dependencies**: No external dependencies (React is a peer dependency)
- **Tiny Bundle**: < 2KB gzipped
- **Router Agnostic**: Works with any React router (React Router, TanStack Router, Next.js, etc.)
- **Hook Agnostic**: Compatible with any React hooks (auth, navigation, state, custom hooks)
- **Production Ready**: Comprehensive error handling and validation

#### Testing

- **Test Utilities**: `resetAllServices()` for test isolation
- **Full Coverage**: 50+ tests covering all functionality
- **Integration Tests**: Real-world usage scenarios

#### Performance

- **Singleton Pattern**: Shared state for optimal performance
- **Reference Equality**: Efficient update detection
- **Tree Shakeable**: Optimized exports for minimal bundle size

### Compatibility

- **React**: 16.8+ (all versions with hooks support)
- **React DOM**: 16.8+
- **TypeScript**: 5.0+
- **Node**: 16+

### Documentation

- Comprehensive README with examples
- API documentation with TypeScript signatures
- Contributing guidelines
- Security policy

[1.0.0]: https://github.com/akhshyganesh/react-use-anywhere/releases/tag/v1.0.0
