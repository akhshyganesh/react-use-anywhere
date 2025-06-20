# Navigation Examples

Advanced navigation patterns using React Use Anywhere for clean, service-driven routing.

## Router-Agnostic Navigation Service

Works with any React router (React Router, Tanstack Router, Next.js, etc.):

```typescript
// services/navigationService.ts
import { useHookService } from 'react-use-anywhere';

export const navigationService = {
  // Basic navigation
  goTo(path: string, options?: NavigateOptions) {
    const navigate = useHookService('navigation');
    navigate(path, options);
  },

  // Conditional navigation based on auth
  goToUserArea() {
    const { isAuthenticated, user } = useHookService('auth');
    const navigate = useHookService('navigation');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Navigate based on user role
    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  },

  // Navigation with state
  goToWithState(path: string, state: any) {
    const navigate = useHookService('navigation');
    navigate(path, { state });
  },

  // Replace current route
  replace(path: string) {
    const navigate = useHookService('navigation');
    navigate(path, { replace: true });
  },

  // Go back
  goBack() {
    const navigate = useHookService('navigation');
    navigate(-1);
  },

  // Go forward
  goForward() {
    const navigate = useHookService('navigation');
    navigate(1);
  },

  // External navigation
  goToExternal(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  },
};
```

## Breadcrumb Service

Automatic breadcrumb management:

```typescript
// services/breadcrumbService.ts
import { useHookService } from 'react-use-anywhere';

export interface Breadcrumb {
  label: string;
  path: string;
  isActive?: boolean;
}

export const breadcrumbService = {
  generateBreadcrumbs(currentPath: string): Breadcrumb[] {
    const pathSegments = currentPath.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [{ label: 'Home', path: '/' }];

    let currentPathBuild = '';

    pathSegments.forEach((segment, index) => {
      currentPathBuild += `/${segment}`;

      // Convert segment to readable label
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        path: currentPathBuild,
        isActive: index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  },

  navigateToBreadcrumb(breadcrumb: Breadcrumb) {
    const navigate = useHookService('navigation');
    navigate(breadcrumb.path);
  },

  updateBreadcrumbLabel(path: string, newLabel: string) {
    const { setBreadcrumbs } = useHookService('breadcrumbs');
    const currentBreadcrumbs = this.generateBreadcrumbs(path);

    const updatedBreadcrumbs = currentBreadcrumbs.map((crumb) =>
      crumb.path === path ? { ...crumb, label: newLabel } : crumb
    );

    setBreadcrumbs(updatedBreadcrumbs);
  },
};
```

## Deep Linking Service

Handle complex URL parameters and deep linking:

```typescript
// services/deepLinkService.ts
import { useHookService } from 'react-use-anywhere';

export const deepLinkService = {
  // Parse and handle deep links
  handleDeepLink(url: string) {
    const navigate = useHookService('navigation');
    const { isAuthenticated } = useHookService('auth');
    const { addNotification } = useHookService('notifications');

    try {
      const urlObj = new URL(url, window.location.origin);
      const path = urlObj.pathname;
      const params = Object.fromEntries(urlObj.searchParams);

      // Handle special deep link cases
      if (path.startsWith('/invite/')) {
        this.handleInviteLink(path, params);
        return;
      }

      if (path.startsWith('/reset-password/')) {
        this.handlePasswordResetLink(path, params);
        return;
      }

      if (path.startsWith('/share/')) {
        this.handleShareLink(path, params);
        return;
      }

      // Check if path requires authentication
      const protectedPaths = ['/dashboard', '/profile', '/settings'];
      const requiresAuth = protectedPaths.some((protected) =>
        path.startsWith(protected)
      );

      if (requiresAuth && !isAuthenticated) {
        // Store intended destination
        localStorage.setItem('intendedDestination', url);
        navigate('/login');
        addNotification({
          type: 'info',
          message: 'Please log in to access this page',
        });
        return;
      }

      // Navigate to the deep link
      navigate(path + urlObj.search);
    } catch (error) {
      console.error('Invalid deep link:', error);
      navigate('/');
    }
  },

  handleInviteLink(path: string, params: Record<string, string>) {
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');

    const inviteToken = path.split('/')[2];

    if (!inviteToken) {
      addNotification({
        type: 'error',
        message: 'Invalid invite link',
      });
      navigate('/');
      return;
    }

    // Navigate to invitation acceptance page
    navigate('/accept-invite', {
      state: {
        token: inviteToken,
        ...params,
      },
    });
  },

  handlePasswordResetLink(path: string, params: Record<string, string>) {
    const navigate = useHookService('navigation');
    const token = path.split('/')[2];

    navigate('/reset-password', {
      state: { token, ...params },
    });
  },

  handleShareLink(path: string, params: Record<string, string>) {
    const navigate = useHookService('navigation');
    const shareId = path.split('/')[2];

    navigate('/shared-content', {
      state: { shareId, ...params },
    });
  },

  // Redirect to intended destination after login
  redirectToIntendedDestination() {
    const navigate = useHookService('navigation');
    const intendedDestination = localStorage.getItem('intendedDestination');

    if (intendedDestination) {
      localStorage.removeItem('intendedDestination');
      this.handleDeepLink(intendedDestination);
    } else {
      navigate('/dashboard');
    }
  },

  // Generate shareable links
  generateShareLink(contentType: string, contentId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${contentType}/${contentId}`;
  },
};
```

## Tab Management Service

Handle complex tab navigation:

```typescript
// services/tabService.ts
import { useHookService } from 'react-use-anywhere';

export interface Tab {
  id: string;
  label: string;
  path: string;
  closable?: boolean;
  modified?: boolean;
}

export const tabService = {
  openTab(tab: Tab) {
    const { addTab } = useHookService('tabs');
    const navigate = useHookService('navigation');

    addTab(tab);
    navigate(tab.path);
  },

  closeTab(tabId: string) {
    const { removeTab, tabs, activeTabId } = useHookService('tabs');
    const navigate = useHookService('navigation');

    const tab = tabs.find((t) => t.id === tabId);

    // Check if tab has unsaved changes
    if (tab?.modified) {
      const confirmed = window.confirm(
        'This tab has unsaved changes. Are you sure you want to close it?'
      );
      if (!confirmed) return;
    }

    removeTab(tabId);

    // Navigate to adjacent tab if closing active tab
    if (tabId === activeTabId) {
      const remainingTabs = tabs.filter((t) => t.id !== tabId);
      if (remainingTabs.length > 0) {
        navigate(remainingTabs[0].path);
      } else {
        navigate('/');
      }
    }
  },

  switchToTab(tabId: string) {
    const { setActiveTab, tabs } = useHookService('tabs');
    const navigate = useHookService('navigation');

    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      setActiveTab(tabId);
      navigate(tab.path);
    }
  },

  closeAllTabs() {
    const { clearTabs } = useHookService('tabs');
    const navigate = useHookService('navigation');

    clearTabs();
    navigate('/');
  },

  closeOtherTabs(keepTabId: string) {
    const { tabs, setTabs } = useHookService('tabs');
    const navigate = useHookService('navigation');

    const tabToKeep = tabs.find((t) => t.id === keepTabId);
    if (tabToKeep) {
      setTabs([tabToKeep]);
      navigate(tabToKeep.path);
    }
  },
};
```

## Route Guard Service

Implement route protection and permissions:

```typescript
// services/routeGuardService.ts
import { useHookService } from 'react-use-anywhere';

export const routeGuardService = {
  canActivate(path: string): boolean {
    const { isAuthenticated, user } = useHookService('auth');
    const navigate = useHookService('navigation');
    const { addNotification } = useHookService('notifications');

    // Define route permissions
    const routePermissions: Record<string, string[]> = {
      '/admin': ['admin'],
      '/admin/*': ['admin'],
      '/users': ['admin', 'manager'],
      '/reports': ['admin', 'manager', 'analyst'],
      '/profile': ['user', 'admin', 'manager', 'analyst'],
    };

    // Check authentication
    if (!isAuthenticated) {
      localStorage.setItem('intendedDestination', path);
      navigate('/login');
      addNotification({
        type: 'info',
        message: 'Please log in to access this page',
      });
      return false;
    }

    // Check permissions
    const requiredRoles = this.getRequiredRoles(path, routePermissions);

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      navigate('/unauthorized');
      addNotification({
        type: 'error',
        message: 'Access denied. Insufficient permissions.',
      });
      return false;
    }

    return true;
  },

  getRequiredRoles(
    path: string,
    permissions: Record<string, string[]>
  ): string[] {
    // Exact match first
    if (permissions[path]) {
      return permissions[path];
    }

    // Wildcard match
    for (const [route, roles] of Object.entries(permissions)) {
      if (route.endsWith('/*')) {
        const basePath = route.slice(0, -2);
        if (path.startsWith(basePath)) {
          return roles;
        }
      }
    }

    return [];
  },

  canDeactivate(currentPath: string): boolean {
    const { isFormDirty } = useHookService('forms') || { isFormDirty: false };

    if (isFormDirty) {
      return window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
    }

    return true;
  },
};
```

## Navigation Analytics

Track navigation for analytics:

```typescript
// services/navigationAnalyticsService.ts
import { useHookService } from 'react-use-anywhere';

export const navigationAnalyticsService = {
  trackPageView(path: string) {
    const { user } = useHookService('auth');

    // Track with your analytics service
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        user_id: user?.id,
      });
    }

    // Custom analytics
    this.sendAnalyticsEvent('page_view', {
      path,
      userId: user?.id,
      timestamp: Date.now(),
      referrer: document.referrer,
    });
  },

  trackNavigation(from: string, to: string, method: string) {
    const { user } = useHookService('auth');

    this.sendAnalyticsEvent('navigation', {
      from,
      to,
      method, // 'click', 'programmatic', 'browser'
      userId: user?.id,
      timestamp: Date.now(),
    });
  },

  trackSearchNavigation(query: string, results: number) {
    const { user } = useHookService('auth');

    this.sendAnalyticsEvent('search_navigation', {
      query,
      results,
      userId: user?.id,
      timestamp: Date.now(),
    });
  },

  sendAnalyticsEvent(event: string, data: any) {
    // Send to your analytics service
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data }),
    }).catch(console.error);
  },
};
```

## Integration Examples

### React Router Integration

```tsx
// App.tsx with React Router
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { HookProvider } from 'react-use-anywhere';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Track navigation changes
  useEffect(() => {
    navigationAnalyticsService.trackPageView(location.pathname);
  }, [location]);

  return (
    <HookProvider
      hooks={{
        navigation: () => navigate,
        location: () => location,
        // ... other hooks
      }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* ... other routes */}
      </Routes>
    </HookProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
```

### Next.js Integration

```tsx
// pages/_app.tsx
import { useRouter } from 'next/router';
import { HookProvider } from 'react-use-anywhere';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const navigationHook = useCallback(() => {
    return (path: string, options?: any) => {
      if (options?.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    };
  }, [router]);

  return (
    <HookProvider
      hooks={{
        navigation: navigationHook,
        router: () => router,
      }}
    >
      <Component {...pageProps} />
    </HookProvider>
  );
}
```

### Tanstack Router Integration

```tsx
// main.tsx with Tanstack Router
import { Router, useNavigate } from '@tanstack/react-router';
import { HookProvider } from 'react-use-anywhere';

function App() {
  const navigate = useNavigate();

  return (
    <HookProvider
      hooks={{
        navigation: () => navigate,
      }}
    >
      {/* Your app content */}
    </HookProvider>
  );
}
```

## Testing Navigation Services

```typescript
// services/__tests__/navigationService.test.ts
import { useHookService } from 'react-use-anywhere';
import { navigationService } from '../navigationService';

jest.mock('react-use-anywhere');
const mockUseHookService = useHookService as jest.MockedFunction<
  typeof useHookService
>;

describe('navigationService', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHookService.mockImplementation((key) => {
      if (key === 'navigation') return mockNavigate;
      if (key === 'auth')
        return {
          isAuthenticated: true,
          user: { role: 'user' },
        };
      throw new Error(`Unexpected hook: ${key}`);
    });
  });

  describe('goToUserArea', () => {
    it('should navigate to dashboard for regular users', () => {
      navigationService.goToUserArea();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should navigate to admin dashboard for admin users', () => {
      mockUseHookService.mockImplementation((key) => {
        if (key === 'navigation') return mockNavigate;
        if (key === 'auth')
          return {
            isAuthenticated: true,
            user: { role: 'admin' },
          };
        throw new Error(`Unexpected hook: ${key}`);
      });

      navigationService.goToUserArea();
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });
});
```

## Key Features Demonstrated

✅ **Router-agnostic navigation** - Works with any React router  
✅ **Conditional navigation** based on authentication and roles  
✅ **Deep linking support** with parameter handling  
✅ **Route protection** and permission checking  
✅ **Tab management** for complex UIs  
✅ **Navigation analytics** and tracking  
✅ **Breadcrumb generation** and management  
✅ **Comprehensive testing** patterns

These navigation patterns demonstrate the power of service-driven routing with React Use Anywhere!
