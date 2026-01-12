# React Version Examples

This directory contains comprehensive examples demonstrating how `react-use-anywhere` works seamlessly across different React versions.

## 📋 Available Examples

### React 16.8+ Example

**File:** [`react-16-example.tsx`](./react-16-example.tsx)

Demonstrates compatibility with React 16.8+ (the version that introduced hooks).

**Key Features:**

- Basic hooks (useState, useEffect)
- Fragments and Error Boundaries
- Compatible with React Router v5
- Foundation for all modern React patterns

**Use When:**

- Working with legacy projects
- Need maximum compatibility
- Building libraries that support older versions

---

### React 17 Example

**File:** [`react-17-example.tsx`](./react-17-example.tsx)

Shows features from React 17, the "bridge" release.

**Key Features:**

- New JSX Transform (no React import needed)
- Improved event delegation
- Better effect cleanup
- localStorage persistence example
- System theme detection

**Use When:**

- Transitioning from React 16 to 18
- Need improved cleanup and event handling
- Working with React Router v6

---

### React 18 Example

**File:** [`react-18-example.tsx`](./react-18-example.tsx)

Showcases React 18's concurrent features and performance improvements.

**Key Features:**

- ⚡ Automatic batching (everywhere!)
- 🔄 useTransition for smooth UI updates
- ⏳ useDeferredValue for responsive search
- 🆔 useId for accessible forms
- Concurrent rendering capabilities

**Use When:**

- Building high-performance applications
- Need smooth UI during heavy operations
- Implementing advanced search/filtering
- Using Suspense for data fetching

---

### React 19 Example

**File:** [`react-19-example.tsx`](./react-19-example.tsx)

Demonstrates cutting-edge React 19 features.

**Key Features:**

- 🎬 Actions and useActionState
- ⚡ useOptimistic for instant UI updates
- 🎯 use() hook for reading promises
- 📝 Native form actions
- Better form handling and mutations

**Use When:**

- Building modern, interactive applications
- Need optimistic UI updates
- Working with forms and data mutations
- Want the best user experience

---

## 🎯 Compatibility Matrix

| React Version | Hooks | Concurrent | Actions | Optimistic | Status |
| ------------- | ----- | ---------- | ------- | ---------- | ------ |
| 16.8+         | ✅    | ❌         | ❌      | ❌         | Stable |
| 17.x          | ✅    | ❌         | ❌      | ❌         | Stable |
| 18.x          | ✅    | ✅         | ❌      | ❌         | Stable |
| 19.x          | ✅    | ✅         | ✅      | ✅         | Latest |

## 🚀 Quick Start

### Installation

```bash
# Choose your React version
npm install react@^16.8.0 react-dom@^16.8.0  # React 16
npm install react@^17.0.0 react-dom@^17.0.0  # React 17
npm install react@^18.0.0 react-dom@^18.0.0  # React 18
npm install react@^19.0.0 react-dom@^19.0.0  # React 19

# Install react-use-anywhere (works with all versions!)
npm install react-use-anywhere
```

### Basic Usage (All Versions)

```tsx
import {
  HookInjectionProvider,
  createSingletonService,
  useHookInjection,
} from 'react-use-anywhere';

// 1. Create your hook
const useAuth = () => {
  const [user, setUser] = useState(null);
  return { user, login: setUser, logout: () => setUser(null) };
};

// 2. Create service
const authService = createSingletonService('auth');

// 3. Connect in component
function App() {
  useHookInjection('auth', useAuth);
  return <YourApp />;
}

// 4. Use anywhere in your code!
export const handleLogin = (userData) => {
  authService.use((auth) => auth.login(userData));
};
```

## 📚 Example Features Comparison

### React 16 Example Includes:

- Basic authentication flow
- Theme switching
- Navigation service
- Business logic separation

### React 17 Example Adds:

- localStorage persistence
- System theme detection
- Improved cleanup patterns
- Media query listeners

### React 18 Example Adds:

- Automatic batching demo
- useTransition for navigation
- useDeferredValue for search
- useId for accessibility

### React 19 Example Adds:

- Form actions
- Optimistic updates
- useActionState
- Todo list with instant feedback

## 🎓 Learning Path

1. **Start with React 16 example** - Learn the basics
2. **Move to React 17** - See improved patterns
3. **Explore React 18** - Understand concurrent features
4. **Master React 19** - Use the latest patterns

## 💡 Migration Guide

### From React 16 to 17

- No code changes needed
- Optional: Remove React imports (with new JSX transform)
- Benefit from better event handling

### From React 17 to 18

- Update to `createRoot()` in your index file
- Gradually adopt `useTransition` and `useDeferredValue`
- Enable StrictMode to catch issues

### From React 18 to 19

- Adopt form actions where beneficial
- Use `useOptimistic` for instant UI feedback
- Replace `forwardRef` with `ref` prop
- Simplify `Context.Provider` usage

## 🔍 Testing Each Version

```bash
# Test with specific React version
npm install react@16.8.0 react-dom@16.8.0 --save-exact
npm test

npm install react@17.0.2 react-dom@17.0.2 --save-exact
npm test

npm install react@18.3.1 react-dom@18.3.1 --save-exact
npm test

npm install react@19.0.0 react-dom@19.0.0 --save-exact
npm test
```

## 📖 Additional Examples

- [`router-agnostic-demo.tsx`](./router-agnostic-demo.tsx) - Works with any router
- [`type-safe-usage.tsx`](./type-safe-usage.tsx) - TypeScript type safety

## 🤝 Contributing

Found an issue or have a suggestion? Please open an issue or submit a PR!

## 📄 License

MIT - Same as react-use-anywhere

---

**Note:** All examples use the same `react-use-anywhere` API. The differences showcase version-specific React features, but the library works identically across all versions!
