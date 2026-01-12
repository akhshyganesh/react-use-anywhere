/**
 * Type-Safe Usage Example
 * 
 * This example demonstrates how to use react-use-anywhere with full TypeScript
 * compile-time validation to prevent invalid hook names.
 */

import React, { useState } from 'react';
import { 
  TypedHookProvider,
  createStrictSingletonService,
  useStrictHookService,
  useStrictHook,
  type ReactHook
} from '../lib';

// =============================================================================
// 1. DEFINE YOUR HOOK TYPES (This enables compile-time checking)
// =============================================================================

// Define the exact shape of your hooks - this is the key to type safety!
type AppHooks = {
  navigate: ReactHook<(path: string) => void>;
  auth: ReactHook<{
    user: { name: string } | null;
    isAuthenticated: boolean;
    login: (name: string) => void;
    logout: () => void;
  }>;
  theme: ReactHook<{
    current: 'light' | 'dark';
    toggle: () => void;
  }>;
};

// =============================================================================
// 2. CREATE TYPE-SAFE SERVICES (Compile-time validated)
// =============================================================================

// ✅ These will show TypeScript errors if hook names are invalid
const navigationService = createStrictSingletonService<AppHooks>('navigate');
const authService = createStrictSingletonService<AppHooks>('auth');
const themeService = createStrictSingletonService<AppHooks>('theme');

// ❌ This would show a TypeScript error:
// const invalidService = createStrictSingletonService<AppHooks>('invalid'); // Error: Argument of type '"invalid"' is not assignable to parameter

// =============================================================================
// 3. IMPLEMENT YOUR HOOKS
// =============================================================================

const useNavigation = (): (path: string) => void => {
  return (path: string) => {
    console.log(`Navigating to: ${path}`);
    // Your navigation logic here
  };
};

const useAuth = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  
  return {
    user,
    isAuthenticated: !!user,
    login: (name: string) => setUser({ name }),
    logout: () => setUser(null),
  };
};

const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return {
    current: theme,
    toggle: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
  };
};

// =============================================================================
// 4. TYPE-SAFE BUSINESS LOGIC
// =============================================================================

// These functions have full type safety and IntelliSense support
export const handleSecureAction = () => {
  // Full type inference - you'll get autocomplete for all methods
  const isAuthenticated = authService.use((auth) => {
    return auth.isAuthenticated; // ✅ TypeScript knows auth has these properties
  });

  if (!isAuthenticated) {
    navigationService.use((navigate) => {
      navigate('/login'); // ✅ TypeScript knows navigate is a function that takes a string
    });
    return;
  }

  console.log('Performing secure action...');
};

export const toggleAppTheme = () => {
  themeService.use((theme) => {
    theme.toggle(); // ✅ Full IntelliSense support
    console.log(`Theme changed to: ${theme.current}`);
  });
};

// =============================================================================
// 5. TYPE-SAFE REACT COMPONENTS
// =============================================================================

const TypeSafeApp: React.FC = () => {
  // ✅ Type-safe hook connections - TypeScript will error on invalid hook names
  useStrictHookService<AppHooks>(navigationService, 'navigate');
  useStrictHookService<AppHooks>(authService, 'auth');
  useStrictHookService<AppHooks>(themeService, 'theme');
  
  // ❌ This would show a TypeScript error:
  // useStrictHookService<AppHooks>(authService, 'invalid'); // Error: Argument of type '"invalid"' is not assignable

  // ✅ Type-safe direct hook access
  const auth = useStrictHook<AppHooks>('auth');
  const theme = useStrictHook<AppHooks>('theme');
  
  // ❌ This would show a TypeScript error:
  // const invalid = useStrictHook<AppHooks>('invalid'); // Error: Argument of type '"invalid"' is not assignable

  return (
    <div style={{
      backgroundColor: theme.current === 'dark' ? '#222' : '#fff',
      color: theme.current === 'dark' ? '#fff' : '#222',
      padding: '2rem',
      minHeight: '100vh'
    }}>
      <h1>🔒 Type-Safe React Use Anywhere</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <p>User: {auth.user?.name || 'Not logged in'}</p>
        <p>Theme: {theme.current}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => auth.login('John Doe')}>
          Login
        </button>
        
        <button onClick={() => auth.logout()}>
          Logout
        </button>
        
        <button onClick={toggleAppTheme}>
          Toggle Theme
        </button>
        
        <button onClick={handleSecureAction}>
          Secure Action
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>✨ Benefits of Type-Safe Approach:</h3>
        <ul>
          <li>🚨 <strong>Compile-time Errors:</strong> Invalid hook names show TypeScript errors</li>
          <li>🧠 <strong>IntelliSense:</strong> Full autocomplete for hook properties and methods</li>
          <li>🔍 <strong>Refactoring Safety:</strong> Rename detection across your entire codebase</li>
          <li>📚 <strong>Self-Documenting:</strong> Types serve as documentation</li>
          <li>🛡️ <strong>Runtime + Compile Safety:</strong> Both TypeScript and runtime validation</li>
        </ul>
      </div>
    </div>
  );
};

// =============================================================================
// 6. MAIN APP WITH TYPE-SAFE PROVIDER
// =============================================================================

const TypeSafeDemo: React.FC = () => {
  // ✅ Hooks object matches the AppHooks type exactly
  const hooks: AppHooks = {
    navigate: useNavigation,
    auth: useAuth,
    theme: useTheme,
  };

  return (
    <TypedHookProvider hooks={hooks}>
      <TypeSafeApp />
    </TypedHookProvider>
  );
};

export default TypeSafeDemo;

// =============================================================================
// 7. USAGE PATTERNS FOR DIFFERENT SCENARIOS
// =============================================================================

/*
// Pattern 1: Global App Types (Recommended)
// Define once in a types file, use everywhere

// types/hooks.ts
export type AppHooks = {
  navigate: ReactHook<NavigateFunction>;
  auth: ReactHook<AuthState>;
  api: ReactHook<ApiClient>;
};

// services/index.ts
export const navService = createStrictSingletonService<AppHooks>('navigate');
export const authService = createStrictSingletonService<AppHooks>('auth');

// Pattern 2: Component-Specific Types
// For component-specific hook requirements

type FeatureHooks = {
  featureAuth: ReactHook<FeatureAuthState>;
  featureData: ReactHook<FeatureData>;
};

const featureService = createStrictSingletonService<FeatureHooks>('featureAuth');

// Pattern 3: Module-Based Types
// For different modules with different hook requirements

// modules/user/types.ts
type UserModuleHooks = {
  userAuth: ReactHook<UserAuth>;
  userProfile: ReactHook<UserProfile>;
};

// modules/admin/types.ts  
type AdminModuleHooks = {
  adminAuth: ReactHook<AdminAuth>;
  adminDashboard: ReactHook<AdminDashboard>;
};
*/
