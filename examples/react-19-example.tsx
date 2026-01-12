/**
 * React 19 Example
 *
 * This example demonstrates using react-use-anywhere with React 19
 *
 * Key features in React 19:
 * - Actions and useActionState
 * - useOptimistic hook
 * - use() hook for reading promises and context
 * - Form actions
 * - Document metadata support
 * - Asset loading improvements
 *
 * Installation for React 19:
 * npm install react@^19.0.0 react-dom@^19.0.0
 * npm install react-use-anywhere
 */

import React, { useState, useOptimistic, useActionState } from 'react';
import {
  HookInjectionProvider,
  createSingletonService,
  useHookInjection,
} from 'react-use-anywhere';

// =============================================================================
// HOOKS - React 19 Features
// =============================================================================

/**
 * Authentication Hook with React 19 Actions
 * Uses the new action patterns for better form handling
 */
const useAuth = () => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginAction = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const username = formData.get('username') as string;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!username) {
        throw new Error('Username is required');
      }

      setUser({ id: 'user-' + Date.now(), name: username });
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    loginAction,
    logout: () => {
      setUser(null);
      setError(null);
    },
  };
};

/**
 * Theme Hook with React 19 optimistic updates
 */
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(theme);

  const toggleTheme = async () => {
    // React 19: Show optimistic update immediately
    const newTheme = optimisticTheme === 'light' ? 'dark' : 'light';
    setOptimisticTheme(newTheme);

    try {
      // Simulate saving to server
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTheme(newTheme);
      console.log('[React 19] Theme saved to server:', newTheme);
    } catch (error) {
      console.error('[React 19] Failed to save theme:', error);
      // Optimistic update will revert automatically
    }
  };

  return {
    theme: optimisticTheme,
    actualTheme: theme,
    isDark: optimisticTheme === 'dark',
    isPending: theme !== optimisticTheme,
    toggleTheme,
  };
};

/**
 * Todo List Hook with optimistic updates
 * React 19's useOptimistic for instant UI feedback
 */
const useTodos = () => {
  const [todos, setTodos] = useState<
    Array<{ id: string; text: string; completed: boolean }>
  >([]);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: { id: string; text: string; completed: boolean }) => {
      return [...state, newTodo];
    }
  );

  const addTodo = async (text: string) => {
    const newTodo = { id: 'temp-' + Date.now(), text, completed: false };

    // React 19: Show immediately
    addOptimisticTodo(newTodo);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const savedTodo = { ...newTodo, id: 'saved-' + Date.now() };
      setTodos((prev) => [...prev, savedTodo]);
      console.log('[React 19] Todo saved:', savedTodo);
    } catch (error) {
      console.error('[React 19] Failed to save todo:', error);
    }
  };

  return {
    todos: optimisticTodos,
    addTodo,
    isPending: todos.length !== optimisticTodos.length,
  };
};

/**
 * Form Hook with useActionState
 * React 19's new form handling
 */
const useFormActions = () => {
  const submitAction = async (prevState: unknown, formData: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = Object.fromEntries(formData);
    console.log('[React 19] Form submitted:', data);

    return {
      success: true,
      message: 'Form submitted successfully!',
      data,
    };
  };

  const [state, action, isPending] = useActionState(submitAction, null);

  return {
    state,
    action,
    isPending,
  };
};

/**
 * Navigation Hook with React 19 features
 */
const useNavigation = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [history, setHistory] = useState<string[]>(['/']);

  const navigate = async (path: string) => {
    console.log(`[React 19] Navigating to: ${path}`);

    // Simulate async navigation (e.g., checking permissions)
    await new Promise((resolve) => setTimeout(resolve, 100));

    setCurrentPath(path);
    setHistory((prev) => [...prev, path]);
    window.location.hash = path;
  };

  return {
    currentPath,
    history,
    navigate,
    goBack: () => {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentPath(newHistory[newHistory.length - 1] || '/');
      window.history.back();
    },
  };
};

// =============================================================================
// SERVICES
// =============================================================================

const authService = createSingletonService<ReturnType<typeof useAuth>>('auth');
const themeService =
  createSingletonService<ReturnType<typeof useTheme>>('theme');
const todosService =
  createSingletonService<ReturnType<typeof useTodos>>('todos');
const navigationService =
  createSingletonService<ReturnType<typeof useNavigation>>('navigation');

// =============================================================================
// BUSINESS LOGIC - React 19 Patterns
// =============================================================================

export const performOptimisticAction = async (action: string) => {
  console.log(`[React 19] Performing optimistic action: ${action}`);

  const isAuthenticated = authService.use((auth) => auth.isAuthenticated);

  if (!isAuthenticated) {
    await navigationService.use((nav) => nav.navigate('/login'));
    return { success: false, reason: 'Not authenticated' };
  }

  // React 19: Actions can be async and show loading states automatically
  console.log('[React 19] Action completed');
  return { success: true };
};

export const addTodoFromAnywhere = async (text: string) => {
  // React 19: Optimistic updates work from business logic
  await todosService.use((todos) => todos.addTodo(text));

  const isPending = todosService.use((todos) => todos.isPending);
  console.log(`[React 19] Todo add pending: ${isPending}`);
};

export const toggleThemeOptimistically = async () => {
  // React 19: Theme changes are instant with optimistic updates
  await themeService.use((theme) => theme.toggleTheme());

  const isPending = themeService.use((theme) => theme.isPending);
  console.log(`[React 19] Theme change pending: ${isPending}`);
};

// =============================================================================
// COMPONENTS
// =============================================================================

const HookConnector: React.FC = () => {
  useHookInjection('auth', useAuth);
  useHookInjection('theme', useTheme);
  useHookInjection('todos', useTodos);
  useHookInjection('form', useFormActions);
  useHookInjection('navigation', useNavigation);

  return null;
};

const LoginPage: React.FC = () => {
  const handleFormAction = async (formData: FormData) => {
    const result = await authService.use((auth) => auth.loginAction(formData));

    if (result.success) {
      await navigationService.use((nav) => nav.navigate('/dashboard'));
    }
  };

  return (
    <div
      style={{ padding: '20px', border: '2px solid #149eca', margin: '10px' }}
    >
      <h2>React 19 - Login</h2>

      {/* React 19: Form actions */}
      <form action={handleFormAction}>
        <input
          name="username"
          type="text"
          placeholder="Enter username"
          required
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Login
        </button>
      </form>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        🚀 React 19: Form actions, optimistic updates, and use() hook
      </p>
    </div>
  );
};

const TodoList: React.FC = () => {
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = async () => {
    if (newTodoText.trim()) {
      await addTodoFromAnywhere(newTodoText);
      setNewTodoText('');
    }
  };

  return (
    <div
      style={{ padding: '20px', border: '2px solid #149eca', margin: '10px' }}
    >
      <h3>React 19 - Todo List (Optimistic Updates)</h3>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Enter todo..."
          style={{ padding: '8px', marginRight: '8px', width: '250px' }}
        />
        <button onClick={handleAddTodo} style={{ padding: '8px 16px' }}>
          Add Todo
        </button>
      </div>

      <p style={{ fontSize: '12px', color: '#666' }}>
        <em>Todos appear instantly with optimistic updates!</em>
      </p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div
      style={{ padding: '20px', border: '2px solid #149eca', margin: '10px' }}
    >
      <h2>React 19 - Dashboard</h2>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={() => performOptimisticAction('Process Data')}
          style={{ padding: '8px 16px', marginRight: '8px' }}
        >
          Process Data
        </button>
        <button
          onClick={toggleThemeOptimistically}
          style={{ padding: '8px 16px', marginRight: '8px' }}
        >
          Toggle Theme (Optimistic)
        </button>
        <button
          onClick={() => authService.use((auth) => auth.logout())}
          style={{ padding: '8px 16px' }}
        >
          Logout
        </button>
      </div>

      <TodoList />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HookInjectionProvider>
      <HookConnector />
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h1>⚛️ React 19 Example</h1>
        <p>
          React 19 introduces actions, optimistic updates, use() hook, and
          improved form handling for better user experiences.
        </p>

        <LoginPage />
        <Dashboard />
      </div>
    </HookInjectionProvider>
  );
};

export default App;

// =============================================================================
// REACT 19 SPECIFIC NOTES
// =============================================================================

/**
 * React 19 Key Features:
 *
 * 🎬 Actions:
 * - Functions that handle async operations automatically
 * - Built-in pending, error, and optimistic state management
 * - Work with forms and transitions seamlessly
 * - useActionState replaces useFormState
 *
 * ⚡ useOptimistic Hook:
 * - Show instant UI updates before server confirmation
 * - Automatically reverts on error
 * - Perfect for likes, comments, todos, etc.
 * - Better UX with perceived instant updates
 *
 * 🎯 use() Hook:
 * - Read promises and context directly in render
 * - Suspends while promise is pending
 * - Simpler data fetching patterns
 * - Works with Suspense boundaries
 *
 * 📝 Form Improvements:
 * - Native form actions (action prop)
 * - Automatic loading states
 * - Better error handling
 * - Progressive enhancement support
 *
 * 🎨 Document Metadata:
 * - <title>, <meta> tags can be rendered anywhere
 * - Automatic hoisting to <head>
 * - Better SEO and social sharing
 * - No need for external helmet libraries
 *
 * 🔄 Asset Loading:
 * - <link rel="preload"> for better performance
 * - Automatic resource prioritization
 * - Better Suspense integration
 * - Faster page loads
 *
 * ✨ Other Improvements:
 * - ref as a prop (no need for forwardRef)
 * - Better hydration error messages
 * - Cleanup functions for refs
 * - Improved Context.Provider (just use Context)
 *
 * 📝 Setup:
 * - Use React 19 with latest TypeScript (5.0+)
 * - Update @types/react to match React 19
 * - Test with @testing-library/react@^14.x
 * - Consider using React Server Components
 *
 * 🔄 Migration from 18:
 * - Most code works without changes
 * - Gradually adopt new patterns (actions, optimistic)
 * - ref prop replaces forwardRef
 * - Context.Provider can be simplified
 * - react-use-anywhere works perfectly
 *
 * ⚠️ Breaking Changes:
 * - Some deprecated features removed
 * - StrictMode behavior changes
 * - PropTypes removed from React package
 * - Use legacy builds if needed
 *
 * 🎯 Perfect For:
 * - Apps with lots of user interactions
 * - Forms and data mutations
 * - Real-time collaborative features
 * - Progressive web applications
 * - Modern, responsive UIs
 *
 * 💡 Best Practices:
 * - Use actions for mutations
 * - Use optimistic updates for better UX
 * - Leverage form actions for simpler code
 * - Take advantage of automatic error handling
 * - Use Suspense for data fetching
 */
