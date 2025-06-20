# Data Fetching

Learn how to implement a data fetching service that can be used throughout your application.

## Overview

This example demonstrates how to create a centralized data fetching service with caching, error handling, and loading states that can be accessed from both React components and utility functions.

## Implementation

### 1. Create the Data Fetching Service

```typescript
// services/dataService.ts
export interface DataFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  cache?: boolean;
  timeout?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface DataService {
  fetch<T>(url: string, options?: DataFetchOptions): Promise<T>;
  get<T>(url: string, options?: Omit<DataFetchOptions, 'method'>): Promise<T>;
  post<T>(
    url: string,
    data: any,
    options?: Omit<DataFetchOptions, 'method' | 'body'>
  ): Promise<T>;
  put<T>(
    url: string,
    data: any,
    options?: Omit<DataFetchOptions, 'method' | 'body'>
  ): Promise<T>;
  delete<T>(
    url: string,
    options?: Omit<DataFetchOptions, 'method'>
  ): Promise<T>;
  clearCache(): void;
  getCacheKey(url: string, options?: DataFetchOptions): string;
  invalidateCache(pattern?: string): void;
}

export const createDataService = (baseURL: string = ''): DataService => {
  const cache = new Map<string, CacheEntry<any>>();
  const defaultTimeout = 10000; // 10 seconds
  const defaultCacheDuration = 5 * 60 * 1000; // 5 minutes

  const getCacheKey = (url: string, options?: DataFetchOptions): string => {
    return JSON.stringify({ url, options: options || {} });
  };

  const isValidCacheEntry = <T>(entry: CacheEntry<T>): boolean => {
    return Date.now() < entry.expiresAt;
  };

  const setCache = <T>(
    key: string,
    data: T,
    ttl: number = defaultCacheDuration
  ): void => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  };

  const getFromCache = <T>(key: string): T | null => {
    const entry = cache.get(key);
    if (entry && isValidCacheEntry(entry)) {
      return entry.data;
    }
    if (entry) {
      cache.delete(key); // Remove expired entry
    }
    return null;
  };

  const fetch = async <T>(
    url: string,
    options: DataFetchOptions = {}
  ): Promise<T> => {
    const {
      method = 'GET',
      headers = {},
      body,
      cache: useCache = method === 'GET',
      timeout = defaultTimeout,
    } = options;

    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
    const cacheKey = getCacheKey(fullUrl, options);

    // Check cache for GET requests
    if (useCache && method === 'GET') {
      const cached = getFromCache<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: controller.signal,
      };

      if (body && method !== 'GET') {
        fetchOptions.body =
          typeof body === 'string' ? body : JSON.stringify(body);
      }

      const response = await globalThis.fetch(fullUrl, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      let data: T;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as any;
      }

      // Cache successful GET requests
      if (useCache && method === 'GET') {
        setCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  };

  const get = <T>(
    url: string,
    options?: Omit<DataFetchOptions, 'method'>
  ): Promise<T> => {
    return fetch<T>(url, { ...options, method: 'GET' });
  };

  const post = <T>(
    url: string,
    data: any,
    options?: Omit<DataFetchOptions, 'method' | 'body'>
  ): Promise<T> => {
    return fetch<T>(url, { ...options, method: 'POST', body: data });
  };

  const put = <T>(
    url: string,
    data: any,
    options?: Omit<DataFetchOptions, 'method' | 'body'>
  ): Promise<T> => {
    return fetch<T>(url, { ...options, method: 'PUT', body: data });
  };

  const deleteMethod = <T>(
    url: string,
    options?: Omit<DataFetchOptions, 'method'>
  ): Promise<T> => {
    return fetch<T>(url, { ...options, method: 'DELETE' });
  };

  const clearCache = (): void => {
    cache.clear();
  };

  const invalidateCache = (pattern?: string): void => {
    if (!pattern) {
      clearCache();
      return;
    }

    const keysToDelete: string[] = [];
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => cache.delete(key));
  };

  return {
    fetch,
    get,
    post,
    put,
    delete: deleteMethod,
    clearCache,
    getCacheKey,
    invalidateCache,
  };
};
```

### 2. Register the Service

```typescript
// App.tsx
import { HookInjectionProvider, createHookService } from 'react-use-anywhere';
import { createDataService } from './services/dataService';

const hookService = createHookService();

// Register data service with your API base URL
hookService.register('data', createDataService('https://api.example.com'));

function App() {
  return (
    <HookInjectionProvider service={hookService}>
      <AppContent />
    </HookInjectionProvider>
  );
}
```

### 3. Create React Hook Wrapper

```typescript
// hooks/useData.ts
import { useState, useEffect, useCallback } from 'react';
import { useHookService } from 'react-use-anywhere';
import { DataService, DataFetchOptions } from '../services/dataService';

export interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseDataOptions extends DataFetchOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useData = <T>(
  url: string | null,
  options: UseDataOptions = {}
) => {
  const [dataService] = useHookService<DataService>('data');
  const [state, setState] = useState<UseDataState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { immediate = true, onSuccess, onError, ...fetchOptions } = options;

  const execute = useCallback(async (): Promise<T | null> => {
    if (!url) return null;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await dataService.get<T>(url, fetchOptions);
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: err });
      onError?.(err);
      return null;
    }
  }, [url, dataService, fetchOptions, onSuccess, onError]);

  const refresh = useCallback(() => {
    return execute();
  }, [execute]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [execute, immediate, url]);

  return {
    ...state,
    execute,
    refresh,
  };
};
```

### 4. Use in React Components

```typescript
// components/UserProfile.tsx
import React from 'react';
import { useData } from '../hooks/useData';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export const UserProfile: React.FC<{ userId: number }> = ({ userId }) => {
  const { data: user, loading, error, refresh } = useData<User>(
    `/users/${userId}`,
    {
      onSuccess: (user) => {
        console.log('User loaded:', user.name);
      },
      onError: (error) => {
        console.error('Failed to load user:', error.message);
      }
    }
  );

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
};
```

### 5. Use in Non-React Code

```typescript
// utils/exportData.ts
import { getHookService } from 'react-use-anywhere';
import { DataService } from '../services/dataService';

export const exportUserData = async (userId: number): Promise<Blob> => {
  const hookService = getHookService();
  const dataService = hookService.get<DataService>('data');

  try {
    // Fetch user data
    const user = await dataService.get(`/users/${userId}`);
    const posts = await dataService.get(`/users/${userId}/posts`);
    const profile = await dataService.get(`/users/${userId}/profile`);

    // Combine data
    const exportData = {
      user,
      posts,
      profile,
      exportedAt: new Date().toISOString(),
    };

    // Create blob
    const json = JSON.stringify(exportData, null, 2);
    return new Blob([json], { type: 'application/json' });
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};
```

## Advanced Patterns

### Mutation Hook

```typescript
// hooks/useMutation.ts
import { useState, useCallback } from 'react';
import { useHookService } from 'react-use-anywhere';
import { DataService, DataFetchOptions } from '../services/dataService';

export interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (
    data: TData | null,
    error: Error | null,
    variables: TVariables
  ) => void;
}

export const useMutation = <TData, TVariables>(
  mutationFn: (
    dataService: DataService,
    variables: TVariables
  ) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
) => {
  const [dataService] = useHookService<DataService>('data');
  const [state, setState] = useState({
    data: null as TData | null,
    loading: false,
    error: null as Error | null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await mutationFn(dataService, variables);
        setState({ data, loading: false, error: null });
        options.onSuccess?.(data, variables);
        options.onSettled?.(data, null, variables);
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: err });
        options.onError?.(err, variables);
        options.onSettled?.(null, err, variables);
        throw err;
      }
    },
    [dataService, mutationFn, options]
  );

  return {
    ...state,
    mutate,
  };
};
```

### Usage with Mutation

```typescript
// components/CreatePost.tsx
import React, { useState } from 'react';
import { useMutation } from '../hooks/useMutation';

interface CreatePostData {
  title: string;
  content: string;
}

export const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const createPostMutation = useMutation(
    (dataService, data: CreatePostData) =>
      dataService.post('/posts', data),
    {
      onSuccess: (post) => {
        console.log('Post created:', post);
        setTitle('');
        setContent('');
      },
      onError: (error) => {
        console.error('Failed to create post:', error);
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate({ title, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post content"
        required
      />
      <button
        type="submit"
        disabled={createPostMutation.loading}
      >
        {createPostMutation.loading ? 'Creating...' : 'Create Post'}
      </button>
      {createPostMutation.error && (
        <div className="error">
          Error: {createPostMutation.error.message}
        </div>
      )}
    </form>
  );
};
```

## Testing

```typescript
// __tests__/dataService.test.ts
import { createDataService } from '../services/dataService';

// Mock fetch
global.fetch = jest.fn();
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('DataService', () => {
  let dataService: ReturnType<typeof createDataService>;

  beforeEach(() => {
    dataService = createDataService('https://api.test.com');
    mockedFetch.mockClear();
  });

  it('should make GET requests', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const result = await dataService.get('/users/1');

    expect(mockedFetch).toHaveBeenCalledWith(
      'https://api.test.com/users/1',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result).toEqual(mockData);
  });

  it('should cache GET requests', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    // First request
    await dataService.get('/users/1');
    // Second request (should use cache)
    await dataService.get('/users/1');

    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle POST requests', async () => {
    const postData = { name: 'New User' };
    const responseData = { id: 2, ...postData };

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => responseData,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response);

    const result = await dataService.post('/users', postData);

    expect(mockedFetch).toHaveBeenCalledWith(
      'https://api.test.com/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData),
      })
    );
    expect(result).toEqual(responseData);
  });
});
```

## Best Practices

1. **Error Handling**: Always handle network errors gracefully
2. **Caching**: Use intelligent caching to reduce API calls
3. **Loading States**: Provide clear loading indicators
4. **Type Safety**: Use TypeScript interfaces for API responses
5. **Timeouts**: Set reasonable timeouts for requests
6. **Retry Logic**: Implement retry mechanisms for failed requests
7. **Cache Invalidation**: Clear stale cache when data changes

## Integration with State Management

```typescript
// With Redux Toolkit
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHookService } from 'react-use-anywhere';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  prepareHeaders: (headers) => {
    const hookService = getHookService();
    const authService = hookService.get('auth');

    if (authService?.token) {
      headers.set('authorization', `Bearer ${authService.token}`);
    }

    return headers;
  },
});

export const api = createApi({
  baseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
    }),
  }),
});
```

This example demonstrates how react-use-anywhere enables centralized data fetching that can be used across your entire application, providing consistent caching, error handling, and loading states.
