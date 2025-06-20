# Data Fetching

Learn how to implement a data fetching hook that can be used throughout your application with react-use-anywhere.

## Overview

This example demonstrates how to create a data fetching hook and make it available via the HookProvider so it can be accessed from services and other parts of your application.

## Implementation

### 1. Create the Data Fetching Hook

```typescript
// hooks/useApi.ts
import { useState, useCallback } from 'react';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends ApiState<T> {
  fetchData: (url: string, options?: RequestInit) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useApi = <T = unknown>(): UseApiReturn<T> => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async (url: string, options?: RequestInit) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    fetchData,
    clearError,
    reset,
  };
};
```

### 2. Register the Hook with HookProvider

```typescript
// App.tsx
import { HookProvider } from 'react-use-anywhere';
import { useApi } from './hooks/useApi';

function App() {
  return (
    <HookProvider
      hooks={{
        api: useApi,
      }}
    >
      <AppContent />
    </HookProvider>
  );
}
```

### 3. Create Services to Use the Hook

```typescript
// services/apiService.ts
import { createSingletonService } from 'react-use-anywhere';
import type { UseApiReturn } from '../hooks/useApi';

// Create a singleton service to access the API hook
export const apiService = createSingletonService<UseApiReturn<any>>('api');

// Helper functions that can be used anywhere in your app
export const fetchUsers = async () => {
  return apiService.use(async (api) => {
    await api.fetchData('/api/users');
    return api.data;
  });
};

export const fetchUserById = async (id: string) => {
  return apiService.use(async (api) => {
    await api.fetchData(`/api/users/${id}`);
    return api.data;
  });
};

export const createUser = async (userData: any) => {
  return apiService.use(async (api) => {
    await api.fetchData('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return api.data;
  });
};
```

### 4. Connect the Service to the Hook in a React Component

```typescript
// components/ApiProvider.tsx
import React from 'react';
import { useHookService } from 'react-use-anywhere';
import { apiService } from '../services/apiService';

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Connect the service to the hook - this makes the hook available to the service
  useHookService(apiService, 'api');

  return <>{children}</>;
};
```

### 5. Use in React Components

```typescript
// components/UserList.tsx
import React, { useEffect, useState } from 'react';
import { useHook } from 'react-use-anywhere';
import { fetchUsers } from '../services/apiService';
import type { UseApiReturn } from '../hooks/useApi';

export const UserList: React.FC = () => {
  const api = useHook<UseApiReturn<any>>('api');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // You can use the hook directly in components
    if (api) {
      api.fetchData('/api/users');
    }
  }, [api]);

  // Or use the service functions
  const handleRefresh = async () => {
    const userData = await fetchUsers();
    setUsers(userData || []);
  };

  if (api?.loading) return <div>Loading...</div>;
  if (api?.error) return <div>Error: {api.error}</div>;

  return (
    <div>
      <h2>Users</h2>
      <button onClick={handleRefresh}>Refresh</button>
      {api?.data && (
        <ul>
          {api.data.map((user: any) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### 6. Use in Non-React Code

```typescript
// utils/exportData.ts
import { fetchUsers, fetchUserById } from '../services/apiService';

export const exportUserData = async (userId?: string): Promise<Blob> => {
  try {
    let data;
    if (userId) {
      data = await fetchUserById(userId);
    } else {
      data = await fetchUsers();
    }

    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: 'application/json' });
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};
```

## Complete App Setup

```typescript
// App.tsx - Complete setup
import React from 'react';
import { HookProvider } from 'react-use-anywhere';
import { useApi } from './hooks/useApi';
import { ApiProvider } from './components/ApiProvider';
import { UserList } from './components/UserList';

// Define hook types for type safety
type AppHooks = {
  api: () => UseApiReturn<any>;
};

function App() {
  return (
    <HookProvider<AppHooks>
      hooks={{
        api: useApi,
      }}
    >
      <ApiProvider>
        <div className="App">
          <h1>Data Fetching Demo</h1>
          <UserList />
        </div>
      </ApiProvider>
    </HookProvider>
  );
}

export default App;
```

## Type-Safe Version

For better type safety, you can use the typed versions:

```typescript
// services/typedApiService.ts
import { createTypedSingletonService } from 'react-use-anywhere';
import type { UseApiReturn } from '../hooks/useApi';
import type { AppHooks } from '../App';

// Type-safe service creation
export const typedApiService = createTypedSingletonService<AppHooks, 'api'>(
  'api'
);

export const fetchUsersTyped = async () => {
  return typedApiService.use(async (api) => {
    await api.fetchData('/api/users');
    return api.data;
  });
};
```

## Testing

```typescript
// __tests__/apiService.test.ts
import { apiService, fetchUsers } from '../services/apiService';
import { resetAllServices } from 'react-use-anywhere';

// Mock fetch
global.fetch = jest.fn();
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('API Service', () => {
  beforeEach(() => {
    resetAllServices();
    mockedFetch.mockClear();
  });

  it('should fetch users successfully', async () => {
    const mockUsers = [{ id: 1, name: 'John' }];
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    } as Response);

    // Mock the service to have the hook available
    apiService._setValue({
      data: null,
      loading: false,
      error: null,
      fetchData: jest.fn().mockImplementation(async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        apiService._setValue({
          data,
          loading: false,
          error: null,
          fetchData: jest.fn(),
          clearError: jest.fn(),
          reset: jest.fn(),
        });
      }),
      clearError: jest.fn(),
      reset: jest.fn(),
    });

    const result = await fetchUsers();
    expect(result).toEqual(mockUsers);
  });
});
```

## Best Practices

1. **Hook Design**: Create hooks that return all the state and functions you need
2. **Service Layer**: Use services to encapsulate business logic that uses hooks
3. **Type Safety**: Use TypeScript interfaces for your hook return types
4. **Error Handling**: Always handle loading and error states in your hooks
5. **Testing**: Mock services and reset them between tests
6. **Provider Setup**: Connect services to hooks using `useHookService` in a provider component

## Key Differences from Traditional Patterns

✅ **Hooks stay in React** - Your hooks follow React rules  
✅ **Services access hooks** - Business logic can use hook values via services  
✅ **Type-safe throughout** - Full TypeScript support  
✅ **Testable services** - Services can be tested independently  
✅ **Clean separation** - UI logic separate from business logic

This pattern enables you to use React hooks in service layers while maintaining clean architecture and testability.
