# Providers

Components that make React hooks available throughout your application.

## HookProvider

The basic provider component that registers hooks for use throughout your app.

### Usage

```tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <HookProvider
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      <YourApp />
    </HookProvider>
  );
}
```

### Props

| Prop       | Type                                 | Required | Description                                |
| ---------- | ------------------------------------ | -------- | ------------------------------------------ |
| `hooks`    | `Record<string, ReactHook<unknown>>` | ✅       | Object mapping hook keys to hook functions |
| `children` | `ReactNode`                          | ✅       | Child components that can access the hooks |

### Example

```tsx
import { HookProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

const hooks = {
  navigation: useNavigate,
  auth: useAuth,
  theme: useTheme,
};

function App() {
  return (
    <HookProvider hooks={hooks}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </HookProvider>
  );
}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </HookProvider>
  );
}
```

## TypedHookProvider

A type-safe version of HookProvider that provides compile-time type checking.

### Usage

```tsx
import { TypedHookProvider } from 'react-use-anywhere';

// Define your hook types
type AppHooks = {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
  theme: () => ThemeState;
};

function App() {
  return (
    <TypedHookProvider<AppHooks>
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        theme: useTheme,
      }}
    >
      <YourApp />
    </TypedHookProvider>
  );
}
```

### Props

| Prop       | Type                                           | Required | Description                                      |
| ---------- | ---------------------------------------------- | -------- | ------------------------------------------------ |
| `hooks`    | `T extends Record<string, ReactHook<unknown>>` | ✅       | Typed object mapping hook keys to hook functions |
| `children` | `ReactNode`                                    | ✅       | Child components that can access the hooks       |

### Type Parameter

- `T` - The type interface defining your hook registry

### Benefits

- **Compile-time type checking** - Ensures hook keys and types match
- **IntelliSense support** - Better IDE autocomplete and error detection
- **Refactoring safety** - Prevents breaking changes when renaming hooks

### Example

```tsx
interface AppHooks {
  navigation: () => NavigateFunction;
  auth: () => {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
  };
  theme: () => {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
  };
}

function App() {
  return (
    <TypedHookProvider<AppHooks>
      hooks={{
        navigation: useNavigate,
        auth: useAuth,
        theme: useTheme,
        // TypeScript will error if hooks don't match AppHooks interface
      }}
    >
      <Routes>{/* Your routes */}</Routes>
    </TypedHookProvider>
  );
}
```

## useHookContext

Hook to access the hook context directly. This gives you access to all executed hook values.

### Usage

```tsx
import { useHookContext } from 'react-use-anywhere';

function MyComponent() {
  const context = useHookContext();

  // Context contains all executed hook values
  const navigationValue = context.navigation;
  const authValue = context.auth;

  return <div>{/* Your component */}</div>;
}
```

### Returns

- `HookContext` - Object containing all hook execution results

### Error Handling

Throws an error if used outside of a HookProvider:

```typescript
// This will throw an error
const context = useHookContext(); // Error: useHookContext must be used within a HookProvider
```

## useTypedHookContext

Type-safe version of useHookContext.

### Usage

```tsx
import { useTypedHookContext } from 'react-use-anywhere';

interface AppHooks {
  navigation: () => NavigateFunction;
  auth: () => AuthState;
}

function MyComponent() {
  const context = useTypedHookContext<AppHooks>();

  // Now you have full type safety
  const navigate = context.navigation; // Type: NavigateFunction
  const auth = context.auth; // Type: AuthState

  return <div>{/* Your component */}</div>;
}
```

### Type Parameter

- `T` - The type interface defining your hook registry

### Returns

- Typed hook context with proper TypeScript inference

## Error Handling

### Provider Not Found

If you try to use hook context outside of a provider:

```typescript
// This will throw an error
const context = useHookContext(); // Error: useHookContext must be used within a HookProvider
```

### Hook Access

To access individual hook values, use the `useHook` function or access them directly from the context:

```typescript
import { useHook } from 'react-use-anywhere';

// Access individual hook values
const navigation = useHook<NavigateFunction>('navigation');
const auth = useHook<AuthState>('auth');
```

## Advanced Patterns

### Nested Providers

You can nest providers for different application areas:

```tsx
function App() {
  return (
    <HookProvider hooks={{ global: useGlobalHook }}>
      <Router>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <HookProvider hooks={{ admin: useAdminHook }}>
                <AdminArea />
              </HookProvider>
            }
          />
        </Routes>
      </Router>
    </HookProvider>
  );
}
```

### Conditional Hook Registration

Register hooks conditionally based on environment or feature flags:

```tsx
function App() {
  const hooks = {
    navigation: useNavigate,
    auth: useAuth,
    ...(process.env.NODE_ENV === 'development' && {
      debug: useDebugHook,
    }),
    ...(featureFlags.analytics && {
      analytics: useAnalytics,
    }),
  };

  return (
    <HookProvider hooks={hooks}>
      <YourApp />
    </HookProvider>
  );
}
```

### Dynamic Hook Updates

Update registered hooks dynamically:

```tsx
function App() {
  const [hooks, setHooks] = useState({
    navigation: useNavigate,
    auth: useAuth,
  });

  const addHook = (key: string, hook: ReactHook) => {
    setHooks((prev) => ({ ...prev, [key]: hook }));
  };

  return (
    <HookProvider hooks={hooks}>
      <YourApp />
    </HookProvider>
  );
}
```

## Performance Considerations

### Hook Memoization

Memoize hook provider props to prevent unnecessary re-renders:

```tsx
function App() {
  const navigate = useNavigate();
  const auth = useAuth();

  // Memoize to prevent recreation on every render
  const hooks = useMemo(
    () => ({
      navigation: () => navigate,
      auth: () => auth,
    }),
    [navigate, auth]
  );

  return (
    <HookProvider hooks={hooks}>
      <YourApp />
    </HookProvider>
  );
}
```

### Lazy Hook Registration

Register hooks only when needed:

```tsx
function App() {
  const [adminHooksLoaded, setAdminHooksLoaded] = useState(false);

  const hooks = useMemo(
    () => ({
      navigation: useNavigate,
      auth: useAuth,
      ...(adminHooksLoaded && {
        adminAuth: useAdminAuth,
        adminConfig: useAdminConfig,
      }),
    }),
    [adminHooksLoaded]
  );

  return (
    <HookProvider hooks={hooks}>
      <YourApp />
    </HookProvider>
  );
}
```

## Best Practices

### ✅ Do:

- Use `TypedHookProvider` for type safety in production
- Memoize hook provider props to prevent re-renders
- Register hooks with descriptive, consistent names
- Use nested providers for different application areas
- Handle missing provider errors gracefully

### ❌ Don't:

- Create providers inside render loops
- Register hooks with conflicting names
- Use providers for components that don't need hook access
- Pass unstable objects as hook provider props
- Ignore TypeScript errors with typed providers

## Testing

### Mocking Providers

```tsx
// Test utility for mocking providers
function createMockProvider(mockHooks: Record<string, any>) {
  return ({ children }: { children: React.ReactNode }) => (
    <HookProvider hooks={mockHooks}>{children}</HookProvider>
  );
}

// Usage in tests
const MockProvider = createMockProvider({
  navigation: jest.fn(),
  auth: { user: null, login: jest.fn() },
});

render(
  <MockProvider>
    <ComponentUnderTest />
  </MockProvider>
);
```

### Testing Provider Errors

```tsx
it('should throw error when used outside provider', () => {
  expect(() => {
    render(<ComponentThatUsesHooks />);
  }).toThrow('useHookService must be used within a HookProvider');
});
```
