# Theme Management

Learn how to implement a theme management hook using react-use-anywhere.

## Overview

This example demonstrates how to create a theme hook that can be accessed from anywhere in your application through services.

## Implementation

### 1. Create the Theme Hook

```typescript
// hooks/useTheme.ts
import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  getSystemTheme: () => 'light' | 'dark';
}

export const useTheme = (): ThemeState => {
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    return saved || 'system';
  });

  const resolveTheme = useCallback((): 'light' | 'dark' => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme as 'light' | 'dark';
  }, [theme, getSystemTheme]);

  const isDark = resolveTheme() === 'dark';

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);

      // Apply theme to document
      const resolvedTheme = newTheme === 'system' ? getSystemTheme() : newTheme;
      document.documentElement.setAttribute('data-theme', resolvedTheme);
      document.documentElement.classList.toggle(
        'dark',
        resolvedTheme === 'dark'
      );

      // Store in localStorage
      localStorage.setItem('theme', newTheme);
    },
    [getSystemTheme]
  );

  const toggleTheme = useCallback(() => {
    const resolved = resolveTheme();
    setTheme(resolved === 'light' ? 'dark' : 'light');
  }, [resolveTheme, setTheme]);

  // Apply theme on mount and theme changes
  useEffect(() => {
    const resolvedTheme = resolveTheme();
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolveTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const resolvedTheme = getSystemTheme();
        document.documentElement.setAttribute('data-theme', resolvedTheme);
        document.documentElement.classList.toggle(
          'dark',
          resolvedTheme === 'dark'
        );
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, getSystemTheme]);

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    getSystemTheme,
  };
};
```

### 2. Register the Hook with HookProvider

```typescript
// App.tsx
import { HookProvider } from 'react-use-anywhere';
import { useTheme } from './hooks/useTheme';

function App() {
  return (
    <HookProvider
      hooks={{
        theme: useTheme,
      }}
    >
      <AppContent />
    </HookProvider>
  );
}
```

### 3. Create Services to Use the Theme

```typescript
// services/themeService.ts
import { createSingletonService } from 'react-use-anywhere';
import type { ThemeState } from '../hooks/useTheme';

// Create a singleton service to access the theme hook
export const themeService = createSingletonService<ThemeState>('theme');

// Helper functions that can be used anywhere in your app
export const toggleTheme = () => {
  return themeService.use((theme) => {
    theme.toggleTheme();
  });
};

export const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
  return themeService.use((theme) => {
    theme.setTheme(newTheme);
  });
};

export const getCurrentTheme = () => {
  return themeService.use((theme) => theme.theme);
};

export const isDarkMode = () => {
  return themeService.use((theme) => theme.isDark);
};
```

### 4. Connect the Service in a React Component

```typescript
// components/ThemeProvider.tsx
import React from 'react';
import { useHookService } from 'react-use-anywhere';
import { themeService } from '../services/themeService';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Connect the service to the hook
  useHookService(themeService, 'theme');

  return <>{children}</>;
};
```

### 5. Use in React Components

```typescript
// components/ThemeToggle.tsx
import React from 'react';
import { useHook } from 'react-use-anywhere';
import { toggleTheme, setTheme } from '../services/themeService';
import type { ThemeState } from '../hooks/useTheme';

export const ThemeToggle = () => {
  const theme = useHook<ThemeState>('theme');

  if (!theme) return null;

  return (
    <div className="theme-toggle">
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme.isDark ? '🌙' : '☀️'}
      </button>

      <select
        value={theme.theme}
        onChange={(e) => setTheme(e.target.value as any)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>

      <span>Current: {theme.isDark ? 'Dark' : 'Light'}</span>
    </div>
  );
};
```

### 6. Use in Non-React Code

```typescript
// utils/api.ts
import { getCurrentTheme, isDarkMode } from '../services/themeService';

export const apiClient = {
  async makeRequest(url: string) {
    const currentTheme = getCurrentTheme();
    const isDark = isDarkMode();

    // Include theme preference in API requests
    const headers = {
      'Content-Type': 'application/json',
      'X-Theme-Preference': currentTheme || 'system',
      'X-Dark-Mode': isDark ? 'true' : 'false',
    };

    const response = await fetch(url, { headers });
    return response.json();
  },
};
```

## CSS Integration

### CSS Variables Approach

```css
/* styles/themes.css */
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
}

[data-theme='dark'] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #333333;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
```

### Tailwind CSS Integration

```typescript
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

## Advanced Features

### Theme Persistence

```typescript
// Enhanced theme service with persistence
export const createThemeService = (): ThemeService => {
  // ... previous implementation ...

  const saveTheme = (theme: Theme) => {
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Could not save theme to localStorage:', error);
    }
  };

  const loadTheme = (): Theme | null => {
    try {
      return localStorage.getItem('theme') as Theme | null;
    } catch (error) {
      console.warn('Could not load theme from localStorage:', error);
      return null;
    }
  };

  // ... rest of implementation
};
```

### Theme Animations

```css
/* Smooth theme transitions */
* {
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

## Testing

```typescript
// __tests__/themeService.test.ts
import { createThemeService } from '../services/themeService';

describe('ThemeService', () => {
  let themeService: ReturnType<typeof createThemeService>;

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    themeService = createThemeService();
  });

  it('should initialize with system theme', () => {
    expect(themeService.currentTheme).toBe('system');
  });

  it('should toggle between light and dark themes', () => {
    themeService.setTheme('light');
    expect(themeService.isDark).toBe(false);

    themeService.toggleTheme();
    expect(themeService.isDark).toBe(true);
  });

  it('should persist theme to localStorage', () => {
    themeService.setTheme('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});
```

## Best Practices

1. **Performance**: Use CSS custom properties for theme values to avoid JavaScript-heavy theme switching
2. **Accessibility**: Respect `prefers-reduced-motion` and `prefers-color-scheme` media queries
3. **Persistence**: Always handle localStorage errors gracefully
4. **Transitions**: Use smooth transitions but allow users to disable them
5. **Testing**: Mock browser APIs in tests for consistent behavior

## Common Patterns

### Theme Context Hook

```typescript
// hooks/useTheme.ts
import { useHookService } from 'react-use-anywhere';
import { ThemeService } from '../services/themeService';

export const useTheme = () => {
  const [themeService] = useHookService<ThemeService>('theme');

  return {
    theme: themeService.currentTheme,
    isDark: themeService.isDark,
    setTheme: themeService.setTheme,
    toggleTheme: themeService.toggleTheme,
  };
};
```

### Theme Provider Component

```typescript
// components/ThemeProvider.tsx
import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return <>{children}</>;
};
```

This example shows how react-use-anywhere enables clean theme management across your entire application, from React components to utility functions and API clients.
