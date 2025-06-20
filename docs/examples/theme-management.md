# Theme Management

Learn how to implement a theme management system using react-use-anywhere.

## Overview

This example demonstrates how to create a theme service that can be accessed from anywhere in your application, including non-React contexts.

## Implementation

### 1. Create the Theme Service

```typescript
// services/themeService.ts
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeService {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  getSystemTheme: () => 'light' | 'dark';
}

export const createThemeService = (): ThemeService => {
  let currentTheme: Theme = 'system';
  let listeners: Array<() => void> = [];

  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const resolveTheme = (): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme as 'light' | 'dark';
  };

  const notifyListeners = () => {
    listeners.forEach((listener) => listener());
  };

  const setTheme = (theme: Theme) => {
    currentTheme = theme;

    // Apply theme to document
    const resolvedTheme = resolveTheme();
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');

    // Store in localStorage
    localStorage.setItem('theme', theme);

    notifyListeners();
  };

  const toggleTheme = () => {
    const resolved = resolveTheme();
    setTheme(resolved === 'light' ? 'dark' : 'light');
  };

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme('system');
  }

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (currentTheme === 'system') {
      setTheme('system'); // Re-trigger to apply system theme
    }
  });

  return {
    get currentTheme() {
      return currentTheme;
    },
    setTheme,
    toggleTheme,
    get isDark() {
      return resolveTheme() === 'dark';
    },
    getSystemTheme,
  };
};
```

### 2. Register the Service

```typescript
// App.tsx
import { HookInjectionProvider, createHookService } from 'react-use-anywhere';
import { createThemeService } from './services/themeService';

const hookService = createHookService();

// Register theme service
hookService.register('theme', createThemeService());

function App() {
  return (
    <HookInjectionProvider service={hookService}>
      <AppContent />
    </HookInjectionProvider>
  );
}
```

### 3. Use in React Components

```typescript
// components/ThemeToggle.tsx
import { useHookService } from 'react-use-anywhere';
import { ThemeService } from '../services/themeService';

export const ThemeToggle = () => {
  const [themeService] = useHookService<ThemeService>('theme');

  return (
    <div className="theme-toggle">
      <button
        onClick={() => themeService.toggleTheme()}
        aria-label="Toggle theme"
      >
        {themeService.isDark ? '🌙' : '☀️'}
      </button>

      <select
        value={themeService.currentTheme}
        onChange={(e) => themeService.setTheme(e.target.value as any)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>

      <span>Current: {themeService.isDark ? 'Dark' : 'Light'}</span>
    </div>
  );
};
```

### 4. Use in Non-React Code

```typescript
// utils/api.ts
import { getHookService } from 'react-use-anywhere';
import { ThemeService } from '../services/themeService';

export const apiClient = {
  async makeRequest(url: string) {
    const hookService = getHookService();
    const themeService = hookService.get<ThemeService>('theme');

    // Include theme preference in API requests
    const headers = {
      'Content-Type': 'application/json',
      'X-Theme-Preference': themeService.currentTheme,
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
