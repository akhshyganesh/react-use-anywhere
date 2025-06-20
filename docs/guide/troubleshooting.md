# Troubleshooting

Common issues and their solutions when using React Use Anywhere.

## Installation Issues

### Module Not Found

**Error:**

```
Module 'react-use-anywhere' not found
```

**Solutions:**

1. **Verify Installation:**

   ```bash
   npm list react-use-anywhere
   ```

2. **Reinstall Package:**

   ```bash
   npm uninstall react-use-anywhere
   npm install react-use-anywhere
   ```

3. **Clear Cache:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### TypeScript Declaration Issues

**Error:**

```
Could not find a declaration file for module 'react-use-anywhere'
```

**Solutions:**

1. **Update TypeScript:**

   ```bash
   npm install -D typescript@latest
   ```

2. **Check Module Resolution:**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true
     }
   }
   ```

## Runtime Errors

### Hook Provider Not Found

**Error:**

```
Error: useHookService must be used within a HookProvider
```

**Cause:** Service called outside of HookProvider context.

**Solutions:**

1. **Ensure Provider Wraps Your App:**

   ```tsx
   // ❌ Wrong
   function App() {
     const service = authService; // Called outside provider
     return <HookProvider>...</HookProvider>;
   }

   // ✅ Correct
   function App() {
     return (
       <HookProvider hooks={...}>
         <ComponentThatUsesServices />
       </HookProvider>
     );
   }
   ```

2. **Check Service Call Location:**

   ```tsx
   // ❌ Wrong - called during module load
   const navigate = useHookService('navigation');

   export const authService = {
     login() {
       navigate('/dashboard'); // Will fail
     },
   };

   // ✅ Correct - called during method execution
   export const authService = {
     login() {
       const navigate = useHookService('navigation');
       navigate('/dashboard'); // Works correctly
     },
   };
   ```

### Hook Not Registered

**Error:**

```
Error: Hook 'navigation' not found in HookProvider
```

**Cause:** Trying to access a hook that wasn't registered.

**Solutions:**

1. **Check Hook Registration:**

   ```tsx
   <HookProvider hooks={{
     // Make sure the hook is registered
     navigation: useNavigate, // ✅ Registered
     auth: useAuth,
   }}>
   ```

2. **Verify Hook Key:**
   ```typescript
   // Make sure the key matches exactly
   const navigate = useHookService('navigation'); // Must match registration key
   ```

### Invalid Hook Call

**Error:**

```
Error: Invalid hook call. Hooks can only be called inside the body of a function component.
```

**Cause:** Hook called outside React component lifecycle.

**Solutions:**

1. **Check Component Structure:**

   ```tsx
   // ❌ Wrong - useNavigate called outside component
   function AppWrapper() {
     const navigate = useNavigate(); // This is outside the provider

     return (
       <HookProvider hooks={{ navigation: () => navigate }}>
         <App />
       </HookProvider>
     );
   }

   // ✅ Correct - useNavigate called inside component
   function AppContent() {
     return (
       <HookProvider hooks={{ navigation: useNavigate }}>
         <App />
       </HookProvider>
     );
   }
   ```

## Performance Issues

### Too Many Re-renders

**Problem:** Services causing excessive re-renders.

**Solutions:**

1. **Memoize Hook Values:**

   ```tsx
   function App() {
     const navigate = useNavigate();
     const auth = useAuth();

     // ✅ Memoize to prevent recreating objects
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

2. **Use Singleton Services:**
   ```typescript
   // ✅ Create singleton to avoid recreating services
   export const authService = createSingletonService('auth', {
     login: async (credentials) => {
       const navigate = useHookService('navigation');
       // Service logic...
     },
   });
   ```

### Memory Leaks

**Problem:** Services holding references to old hook instances.

**Solutions:**

1. **Reset Services on Unmount:**

   ```tsx
   function App() {
     useEffect(() => {
       return () => {
         // Clean up services when app unmounts
         resetAllServices();
       };
     }, []);

     return <HookProvider>...</HookProvider>;
   }
   ```

2. **Avoid Storing Hook References:**

   ```typescript
   // ❌ Wrong - storing hook reference
   class BadService {
     private navigate: NavigateFunction;

     constructor() {
       this.navigate = useHookService('navigation'); // Don't store
     }
   }

   // ✅ Correct - get hook when needed
   class GoodService {
     navigate(path: string) {
       const navigate = useHookService('navigation'); // Get fresh reference
       navigate(path);
     }
   }
   ```

## Type Safety Issues

### Type Inference Problems

**Problem:** TypeScript not inferring types correctly.

**Solutions:**

1. **Explicit Type Annotations:**

   ```typescript
   // ✅ Be explicit about types
   type AppHooks = {
     navigation: () => NavigateFunction;
     auth: () => AuthHook;
   };

   const authService = {
     login(): Promise<void> {
       // Explicit return type
       const navigate = useTypedHookService<AppHooks>('navigation');
       // ...
     },
   };
   ```

2. **Use Type Assertions Carefully:**

   ```typescript
   // ✅ Safe type assertion
   const navigate = useHookService('navigation') as NavigateFunction;

   // ❌ Dangerous - could fail at runtime
   const navigate = useHookService('invalidKey') as NavigateFunction;
   ```

### Generic Type Issues

**Problem:** Complex generic types not working.

**Solutions:**

1. **Simplify Type Definitions:**

   ```typescript
   // ❌ Too complex
   type ComplexHooks<T extends Record<string, unknown>> = {
     [K in keyof T]: () => T[K];
   };

   // ✅ Simpler and clearer
   type AppHooks = {
     navigation: () => NavigateFunction;
     auth: () => AuthHook;
     theme: () => ThemeHook;
   };
   ```

## Testing Issues

### Mocking Problems

**Problem:** Difficulty mocking hook services in tests.

**Solutions:**

1. **Proper Mock Setup:**

   ```typescript
   // test-setup.ts
   import { useHookService } from 'react-use-anywhere';

   jest.mock('react-use-anywhere', () => ({
     useHookService: jest.fn(),
     HookProvider: ({ children }: any) => children,
   }));

   const mockUseHookService = useHookService as jest.MockedFunction<
     typeof useHookService
   >;

   export { mockUseHookService };
   ```

2. **Service-Specific Mocks:**

   ```typescript
   // auth.test.ts
   import { mockUseHookService } from './test-setup';
   import { authService } from '../services/authService';

   describe('authService', () => {
     const mockNavigate = jest.fn();
     const mockLogin = jest.fn();

     beforeEach(() => {
       mockUseHookService.mockImplementation((key) => {
         switch (key) {
           case 'navigation':
             return mockNavigate;
           case 'auth':
             return { login: mockLogin };
           default:
             throw new Error(`Unexpected hook: ${key}`);
         }
       });
     });

     it('should navigate after login', async () => {
       await authService.login('test@example.com', 'password');
       expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
     });
   });
   ```

## Build Issues

### Webpack Configuration

**Problem:** Webpack not resolving the module correctly.

**Solution:**

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: ['node_modules'],
    fallback: {
      // Add fallbacks if needed
    },
  },
};
```

### Vite Configuration

**Problem:** Vite not handling the import correctly.

**Solution:**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['react-use-anywhere'],
  },
  build: {
    commonjsOptions: {
      include: [/react-use-anywhere/, /node_modules/],
    },
  },
});
```

## Debugging Tips

### Enable Debug Mode

```typescript
// Enable detailed logging
if (process.env.NODE_ENV === 'development') {
  window.__REACT_USE_ANYWHERE_DEBUG__ = true;
}
```

### Service Debugging

```typescript
export const debugService = {
  testHooks() {
    try {
      const hooks = ['navigation', 'auth', 'theme'];

      hooks.forEach((hookKey) => {
        try {
          const hook = useHookService(hookKey);
          console.log(`✅ ${hookKey}:`, typeof hook);
        } catch (error) {
          console.error(`❌ ${hookKey}:`, error.message);
        }
      });
    } catch (error) {
      console.error('Debug service error:', error);
    }
  },
};
```

### Hook Provider Debugging

```tsx
function DebugHookProvider({ children, hooks }: HookProviderProps) {
  console.log('HookProvider mounted with hooks:', Object.keys(hooks));

  useEffect(() => {
    console.log('HookProvider effect, available hooks:', Object.keys(hooks));
  }, [hooks]);

  return <HookProvider hooks={hooks}>{children}</HookProvider>;
}
```

## Getting Help

If you're still having issues:

1. **Check the [GitHub Issues](https://github.com/akhshyganesh/react-use-anywhere/issues)**
2. **Create a minimal reproduction** of your issue
3. **Include environment details:**

   - React version
   - TypeScript version (if using)
   - Build tool (Vite, Webpack, etc.)
   - Node.js version

4. **Open a new issue** with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Code examples

## Common Solutions Summary

| Issue               | Quick Fix                                    |
| ------------------- | -------------------------------------------- |
| Module not found    | `npm install react-use-anywhere`             |
| Provider not found  | Wrap app with `HookProvider`                 |
| Hook not registered | Add hook to provider `hooks` prop            |
| Invalid hook call   | Call `useHookService` inside service methods |
| Too many re-renders | Memoize hook provider props                  |
| Type errors         | Use `TypedHookProvider` and explicit types   |
| Test failures       | Mock `useHookService` properly               |

Still need help? Check our [examples](/examples/basic-usage) or [API documentation](/api/overview)!
