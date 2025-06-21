# Theme Management

Build a powerful theme system with react-use-anywhere that works across your entire application - from React components to utility functions and API clients.

## 1. Create the Theme Hook

First, let's create a custom hook that manages our theme state:

```ts
// hooks/useTheme.ts
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initialize from localStorage or default to system
    const saved = localStorage.getItem('theme') as Theme | null;
    return saved || 'system';
  });

  const getSystemTheme = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
  const isDark = resolvedTheme === 'dark';

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem('theme', newTheme);

      // Apply to document
      const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    },
    [getSystemTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  // Apply theme on mount and changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.classList.toggle('dark', isDark);
  }, [resolvedTheme, isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = getSystemTheme();
        document.documentElement.setAttribute('data-theme', systemTheme);
        document.documentElement.classList.toggle(
          'dark',
          systemTheme === 'dark'
        );
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, getSystemTheme]);

  return {
    theme,
    resolvedTheme,
    isDark,
    setTheme,
    toggleTheme,
  };
};
```

## 2. Setup with HookProvider

```tsx
// App.tsx
import { HookProvider } from 'react-use-anywhere';
import { useTheme } from './hooks/useTheme';

function App() {
  return (
    <HookProvider hooks={{ theme: useTheme }}>
      <YourApp />
    </HookProvider>
  );
}
```

## 3. Create a Service to Use Anywhere

```ts
// services/themeService.ts
import { createSingletonService } from 'react-use-anywhere';

// Create a singleton service to access the theme hook
export const themeService = createSingletonService('theme');

// Helper functions that can be used anywhere in your app
export const theme = {
  toggle() {
    themeService.use((theme) => {
      theme.toggleTheme();
    });
  },

  setTheme(newTheme: 'light' | 'dark' | 'system') {
    themeService.use((theme) => {
      theme.setTheme(newTheme);
    });
  },

  getCurrent() {
    return themeService.use((theme) => theme.theme);
  },

  isDark() {
    return themeService.use((theme) => theme.isDark);
  },
};
```

## 4. Connect Service in a Component

```tsx
// components/ThemeToggle.tsx
import { useHookService } from 'react-use-anywhere';
import { themeService, theme } from '../services/themeService';

function ThemeToggle() {
  // This connects the service to the hook
  useHookService(themeService, 'theme');

  return (
    <div>
      <button onClick={() => theme.setTheme('light')}>☀️ Light</button>
      <button onClick={() => theme.setTheme('dark')}>🌙 Dark</button>
      <button onClick={() => theme.setTheme('system')}>💻 System</button>
      <button onClick={() => theme.toggle()}>🔄 Toggle</button>
    </div>
  );
}
```

## 5. Use Theme in React Components

```tsx
// Any component can access the theme
import { useHook } from 'react-use-anywhere';

function MyComponent() {
  const themeData = useHook('theme');

  return (
    <div
      style={{
        backgroundColor: themeData?.isDark ? '#1a1a1a' : '#ffffff',
        color: themeData?.isDark ? '#ffffff' : '#000000',
      }}
    >
      Current theme: {themeData?.resolvedTheme}
    </div>
  );
}
```

## 6. Use Theme in Non-React Code

```ts
// utils/apiClient.ts
import { theme } from '../services/themeService';

export const apiClient = {
  async request(url: string) {
    const currentTheme = theme.getCurrent();
    const isDark = theme.isDark();

    return fetch(url, {
      headers: {
        'X-Theme': currentTheme,
        'X-Dark-Mode': isDark.toString(),
      },
    });
  },
};
```

## Advanced Patterns

### Auto Theme Based on Time

```ts
export const autoTheme = {
  setTimeBasedTheme() {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 18;

    theme.setTheme(isDayTime ? 'light' : 'dark');
  },

  startAutoTheme() {
    this.setTimeBasedTheme();

    // Check every hour
    const interval = setInterval(
      () => {
        this.setTimeBasedTheme();
      },
      60 * 60 * 1000
    );

    return () => clearInterval(interval);
  },
};
```

### Theme Persistence with User Preferences

```ts
export const userTheme = {
  async saveToServer(themeValue: 'light' | 'dark' | 'system') {
    try {
      await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeValue }),
      });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  },

  async loadFromServer() {
    try {
      const response = await fetch('/api/user/preferences');
      const prefs = await response.json();

      if (prefs.theme) {
        theme.setTheme(prefs.theme);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  },
};
```

### Global Keyboard Shortcuts

```ts
// utils/shortcuts.ts
import { theme } from '../services/themeService';

// Global keyboard shortcut to toggle theme
document.addEventListener('keydown', (e) => {
  if (e.metaKey && e.key === 'd') {
    e.preventDefault();
    theme.toggle();
  }
});
```

## CSS Integration

### CSS Custom Properties

```css
/* styles/themes.css */
[data-theme='light'] {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  --border-color: #e0e0e0;
}

[data-theme='dark'] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --border-color: #404040;
}

/* Use in components */
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}
```

### Tailwind CSS Integration

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Use class-based dark mode
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
      },
    },
  },
};
```

## Why react-use-anywhere Makes This Easy

1. **One Hook, Use Anywhere**: Create your theme logic once, use it everywhere
2. **No Prop Drilling**: Access theme state in any component without passing props
3. **Non-React Integration**: Use theme in utility functions, API clients, event handlers
4. **Type Safety**: Full TypeScript support with proper typing
5. **Clean Architecture**: Separate concerns with services and hooks

## Complete Working Example

```tsx
// src/App.tsx
import { HookProvider } from 'react-use-anywhere';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import { useHookService } from 'react-use-anywhere';
import { themeService } from './services/themeService';

function AppContent() {
  // Connect the service to enable non-React usage
  useHookService(themeService, 'theme');

  return (
    <div>
      <h1>My App</h1>
      <ThemeToggle />
      {/* Rest of your app */}
    </div>
  );
}

function App() {
  return (
    <HookProvider hooks={{ theme: useTheme }}>
      <AppContent />
    </HookProvider>
  );
}

export default App;
```

That's it! You now have a complete theme system that works across your entire application. The power of react-use-anywhere is that you write your theme logic once and can use it anywhere - React components, utility functions, API clients, or any JavaScript code.

Simple, clean, and powerful theme management that just works! 🎨
