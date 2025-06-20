# Router Integration

Learn how to integrate react-use-anywhere with popular routing libraries.

## Overview

This example shows how to create router-agnostic navigation services that work with React Router, Next.js Router, Reach Router, or any other routing solution.

## React Router Integration

### 1. Create Navigation Service for React Router

```typescript
// services/navigationService.ts
import { NavigateFunction, Location } from 'react-router-dom';

export interface NavigationService {
  navigate: (to: string, options?: { replace?: boolean; state?: any }) => void;
  goBack: () => void;
  goForward: () => void;
  getCurrentPath: () => string;
  getCurrentLocation: () => Location | null;
  isCurrentPath: (path: string) => boolean;
  buildUrl: (path: string, params?: Record<string, string>) => string;
}

export const createReactRouterNavigationService = (): NavigationService => {
  let navigateFunction: NavigateFunction | null = null;
  let currentLocation: Location | null = null;

  const setNavigateFunction = (navigate: NavigateFunction) => {
    navigateFunction = navigate;
  };

  const setCurrentLocation = (location: Location) => {
    currentLocation = location;
  };

  const navigate = (
    to: string,
    options?: { replace?: boolean; state?: any }
  ) => {
    if (!navigateFunction) {
      console.warn('Navigation function not initialized');
      return;
    }
    navigateFunction(to, options);
  };

  const goBack = () => {
    if (!navigateFunction) return;
    navigateFunction(-1);
  };

  const goForward = () => {
    if (!navigateFunction) return;
    navigateFunction(1);
  };

  const getCurrentPath = (): string => {
    return currentLocation?.pathname || '';
  };

  const getCurrentLocation = (): Location | null => {
    return currentLocation;
  };

  const isCurrentPath = (path: string): boolean => {
    return getCurrentPath() === path;
  };

  const buildUrl = (path: string, params?: Record<string, string>): string => {
    if (!params) return path;

    const url = new URL(path, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return url.pathname + url.search;
  };

  return {
    navigate,
    goBack,
    goForward,
    getCurrentPath,
    getCurrentLocation,
    isCurrentPath,
    buildUrl,
    // Internal methods for router integration
    setNavigateFunction,
    setCurrentLocation,
  } as NavigationService & {
    setNavigateFunction: (navigate: NavigateFunction) => void;
    setCurrentLocation: (location: Location) => void;
  };
};
```

### 2. Initialize with React Router

```typescript
// App.tsx
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { HookInjectionProvider, createHookService } from 'react-use-anywhere';
import { createReactRouterNavigationService } from './services/navigationService';

const hookService = createHookService();
const navigationService = createReactRouterNavigationService();

// Register the service
hookService.register('navigation', navigationService);

// Router integration component
const RouterIntegration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    navigationService.setNavigateFunction(navigate);
    navigationService.setCurrentLocation(location);
  }, [navigate, location]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <HookInjectionProvider service={hookService}>
        <RouterIntegration />
        <AppContent />
      </HookInjectionProvider>
    </BrowserRouter>
  );
}
```

### 3. Use in Components

```typescript
// components/Navigation.tsx
import React from 'react';
import { useHookService } from 'react-use-anywhere';
import { NavigationService } from '../services/navigationService';

export const Navigation: React.FC = () => {
  const [navigationService] = useHookService<NavigationService>('navigation');

  return (
    <nav>
      <button onClick={() => navigationService.navigate('/')}>
        Home
      </button>
      <button onClick={() => navigationService.navigate('/about')}>
        About
      </button>
      <button onClick={() => navigationService.navigate('/profile')}>
        Profile
      </button>
      <button onClick={() => navigationService.goBack()}>
        Back
      </button>

      <div>
        Current path: {navigationService.getCurrentPath()}
      </div>
    </nav>
  );
};
```

## Next.js Router Integration

### 1. Create Next.js Navigation Service

```typescript
// services/nextNavigationService.ts
import { NextRouter } from 'next/router';

export interface NextNavigationService {
  navigate: (
    url: string,
    options?: { shallow?: boolean; scroll?: boolean }
  ) => Promise<boolean>;
  replace: (
    url: string,
    options?: { shallow?: boolean; scroll?: boolean }
  ) => Promise<boolean>;
  back: () => void;
  reload: () => void;
  getCurrentPath: () => string;
  getCurrentQuery: () => Record<string, string | string[]>;
  isReady: () => boolean;
  buildUrl: (pathname: string, query?: Record<string, any>) => string;
}

export const createNextNavigationService = (): NextNavigationService => {
  let router: NextRouter | null = null;

  const setRouter = (nextRouter: NextRouter) => {
    router = nextRouter;
  };

  const navigate = async (
    url: string,
    options?: { shallow?: boolean; scroll?: boolean }
  ) => {
    if (!router) {
      console.warn('Next.js router not initialized');
      return false;
    }
    return router.push(url, undefined, options);
  };

  const replace = async (
    url: string,
    options?: { shallow?: boolean; scroll?: boolean }
  ) => {
    if (!router) return false;
    return router.replace(url, undefined, options);
  };

  const back = () => {
    if (!router) return;
    router.back();
  };

  const reload = () => {
    if (!router) return;
    router.reload();
  };

  const getCurrentPath = (): string => {
    return router?.pathname || '';
  };

  const getCurrentQuery = (): Record<string, string | string[]> => {
    return router?.query || {};
  };

  const isReady = (): boolean => {
    return router?.isReady || false;
  };

  const buildUrl = (pathname: string, query?: Record<string, any>): string => {
    if (!query) return pathname;

    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    });

    return `${pathname}?${searchParams.toString()}`;
  };

  return {
    navigate,
    replace,
    back,
    reload,
    getCurrentPath,
    getCurrentQuery,
    isReady,
    buildUrl,
    // Internal method
    setRouter,
  } as NextNavigationService & {
    setRouter: (router: NextRouter) => void;
  };
};
```

### 2. Initialize in Next.js App

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { HookInjectionProvider, createHookService } from 'react-use-anywhere';
import { createNextNavigationService } from '../services/nextNavigationService';

const hookService = createHookService();
const navigationService = createNextNavigationService();

hookService.register('navigation', navigationService);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    navigationService.setRouter(router);
  }, [router]);

  return (
    <HookInjectionProvider service={hookService}>
      <Component {...pageProps} />
    </HookInjectionProvider>
  );
}
```

## Universal Router Service

### 1. Router-Agnostic Service

```typescript
// services/universalNavigationService.ts
export type NavigationOptions = {
  replace?: boolean;
  state?: any;
  shallow?: boolean;
  scroll?: boolean;
};

export interface UniversalNavigationService {
  navigate: (
    to: string,
    options?: NavigationOptions
  ) => void | Promise<boolean>;
  back: () => void;
  forward?: () => void;
  getCurrentPath: () => string;
  getCurrentSearch: () => string;
  buildUrl: (path: string, params?: Record<string, any>) => string;
  isActive: (path: string) => boolean;
}

export const createUniversalNavigationService = (
  adapter: NavigationAdapter
): UniversalNavigationService => {
  return {
    navigate: (to, options) => adapter.navigate(to, options),
    back: () => adapter.back(),
    forward: () => adapter.forward?.(),
    getCurrentPath: () => adapter.getCurrentPath(),
    getCurrentSearch: () => adapter.getCurrentSearch(),
    buildUrl: (path, params) => adapter.buildUrl(path, params),
    isActive: (path) => adapter.isActive(path),
  };
};

// Adapter interface
export interface NavigationAdapter {
  navigate: (
    to: string,
    options?: NavigationOptions
  ) => void | Promise<boolean>;
  back: () => void;
  forward?: () => void;
  getCurrentPath: () => string;
  getCurrentSearch: () => string;
  buildUrl: (path: string, params?: Record<string, any>) => string;
  isActive: (path: string) => boolean;
}
```

### 2. React Router Adapter

```typescript
// adapters/reactRouterAdapter.ts
import { NavigateFunction, Location } from 'react-router-dom';
import {
  NavigationAdapter,
  NavigationOptions,
} from '../services/universalNavigationService';

export const createReactRouterAdapter = (): NavigationAdapter & {
  setNavigate: (navigate: NavigateFunction) => void;
  setLocation: (location: Location) => void;
} => {
  let navigate: NavigateFunction | null = null;
  let location: Location | null = null;

  return {
    setNavigate: (nav) => {
      navigate = nav;
    },
    setLocation: (loc) => {
      location = loc;
    },

    navigate: (to, options) => {
      if (!navigate) return;
      navigate(to, {
        replace: options?.replace,
        state: options?.state,
      });
    },

    back: () => navigate?.(-1),
    forward: () => navigate?.(1),

    getCurrentPath: () => location?.pathname || '',
    getCurrentSearch: () => location?.search || '',

    buildUrl: (path, params) => {
      if (!params) return path;
      const url = new URL(path, 'http://localhost');
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
      return url.pathname + url.search;
    },

    isActive: (path) => location?.pathname === path,
  };
};
```

### 3. Next.js Adapter

```typescript
// adapters/nextRouterAdapter.ts
import { NextRouter } from 'next/router';
import {
  NavigationAdapter,
  NavigationOptions,
} from '../services/universalNavigationService';

export const createNextRouterAdapter = (): NavigationAdapter & {
  setRouter: (router: NextRouter) => void;
} => {
  let router: NextRouter | null = null;

  return {
    setRouter: (nextRouter) => {
      router = nextRouter;
    },

    navigate: async (to, options) => {
      if (!router) return false;
      if (options?.replace) {
        return router.replace(to, undefined, {
          shallow: options?.shallow,
          scroll: options?.scroll,
        });
      }
      return router.push(to, undefined, {
        shallow: options?.shallow,
        scroll: options?.scroll,
      });
    },

    back: () => router?.back(),

    getCurrentPath: () => router?.pathname || '',
    getCurrentSearch: () => {
      const query = router?.query;
      if (!query) return '';
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, String(value));
        }
      });
      return params.toString() ? `?${params.toString()}` : '';
    },

    buildUrl: (path, params) => {
      if (!params) return path;
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, String(value));
      });
      return `${path}?${searchParams.toString()}`;
    },

    isActive: (path) => router?.pathname === path,
  };
};
```

## Advanced Usage Patterns

### 1. Navigation Guards

```typescript
// services/navigationGuardService.ts
import { useHookService } from 'react-use-anywhere';
import { UniversalNavigationService } from './universalNavigationService';

export interface NavigationGuard {
  canNavigate: (to: string, from: string) => boolean | Promise<boolean>;
  beforeNavigate?: (to: string, from: string) => void;
  afterNavigate?: (to: string, from: string) => void;
}

export const createNavigationGuardService = () => {
  const guards: NavigationGuard[] = [];

  const addGuard = (guard: NavigationGuard) => {
    guards.push(guard);
    return () => {
      const index = guards.indexOf(guard);
      if (index > -1) guards.splice(index, 1);
    };
  };

  const canNavigate = async (to: string, from: string): Promise<boolean> => {
    for (const guard of guards) {
      const result = await guard.canNavigate(to, from);
      if (!result) return false;
    }
    return true;
  };

  const guardedNavigate = async (
    navigationService: UniversalNavigationService,
    to: string,
    options?: any
  ) => {
    const from = navigationService.getCurrentPath();

    // Run before navigation guards
    guards.forEach((guard) => guard.beforeNavigate?.(to, from));

    // Check if navigation is allowed
    if (await canNavigate(to, from)) {
      const result = navigationService.navigate(to, options);

      // Run after navigation guards
      guards.forEach((guard) => guard.afterNavigate?.(to, from));

      return result;
    }

    return false;
  };

  return {
    addGuard,
    canNavigate,
    guardedNavigate,
  };
};
```

### 2. Route Parameters Hook

```typescript
// hooks/useRouteParams.ts
import { useHookService } from 'react-use-anywhere';
import { UniversalNavigationService } from '../services/universalNavigationService';

export const useRouteParams = () => {
  const [navigationService] =
    useHookService<UniversalNavigationService>('navigation');

  const getParam = (key: string): string | null => {
    const search = navigationService.getCurrentSearch();
    const params = new URLSearchParams(search);
    return params.get(key);
  };

  const getAllParams = (): Record<string, string> => {
    const search = navigationService.getCurrentSearch();
    const params = new URLSearchParams(search);
    const result: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      result[key] = value;
    }

    return result;
  };

  const setParam = (key: string, value: string) => {
    const currentPath = navigationService.getCurrentPath();
    const currentParams = getAllParams();
    const newParams = { ...currentParams, [key]: value };
    const newUrl = navigationService.buildUrl(currentPath, newParams);

    navigationService.navigate(newUrl, { replace: true });
  };

  const removeParam = (key: string) => {
    const currentPath = navigationService.getCurrentPath();
    const currentParams = getAllParams();
    delete currentParams[key];
    const newUrl = navigationService.buildUrl(currentPath, currentParams);

    navigationService.navigate(newUrl, { replace: true });
  };

  return {
    getParam,
    getAllParams,
    setParam,
    removeParam,
  };
};
```

### 3. Breadcrumb Service

```typescript
// services/breadcrumbService.ts
export interface Breadcrumb {
  title: string;
  path: string;
  isActive?: boolean;
}

export const createBreadcrumbService = () => {
  let breadcrumbs: Breadcrumb[] = [];
  let listeners: Array<(breadcrumbs: Breadcrumb[]) => void> = [];

  const setBreadcrumbs = (newBreadcrumbs: Breadcrumb[]) => {
    breadcrumbs = newBreadcrumbs;
    listeners.forEach((listener) => listener(breadcrumbs));
  };

  const addBreadcrumb = (breadcrumb: Breadcrumb) => {
    breadcrumbs.push(breadcrumb);
    listeners.forEach((listener) => listener(breadcrumbs));
  };

  const removeBreadcrumb = (path: string) => {
    breadcrumbs = breadcrumbs.filter((b) => b.path !== path);
    listeners.forEach((listener) => listener(breadcrumbs));
  };

  const getBreadcrumbs = () => breadcrumbs;

  const subscribe = (listener: (breadcrumbs: Breadcrumb[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  return {
    setBreadcrumbs,
    addBreadcrumb,
    removeBreadcrumb,
    getBreadcrumbs,
    subscribe,
  };
};
```

## Testing

```typescript
// __tests__/navigationService.test.ts
import {
  createUniversalNavigationService,
  NavigationAdapter,
} from '../services/universalNavigationService';

const createMockAdapter = (): NavigationAdapter => ({
  navigate: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  getCurrentPath: jest.fn(() => '/current'),
  getCurrentSearch: jest.fn(() => '?param=value'),
  buildUrl: jest.fn((path, params) => {
    if (!params) return path;
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => searchParams.set(k, String(v)));
    return `${path}?${searchParams.toString()}`;
  }),
  isActive: jest.fn((path) => path === '/current'),
});

describe('UniversalNavigationService', () => {
  let mockAdapter: NavigationAdapter;
  let navigationService: ReturnType<typeof createUniversalNavigationService>;

  beforeEach(() => {
    mockAdapter = createMockAdapter();
    navigationService = createUniversalNavigationService(mockAdapter);
  });

  it('should navigate using adapter', () => {
    navigationService.navigate('/test', { replace: true });
    expect(mockAdapter.navigate).toHaveBeenCalledWith('/test', {
      replace: true,
    });
  });

  it('should build URLs with parameters', () => {
    const url = navigationService.buildUrl('/test', {
      id: '123',
      type: 'user',
    });
    expect(url).toBe('/test?id=123&type=user');
  });

  it('should check if path is active', () => {
    expect(navigationService.isActive('/current')).toBe(true);
    expect(navigationService.isActive('/other')).toBe(false);
  });
});
```

This comprehensive router integration example shows how react-use-anywhere enables consistent navigation patterns across different routing libraries, making your code more portable and maintainable.
