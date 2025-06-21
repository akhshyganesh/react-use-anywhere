# Data Fetching with React Use Anywhere

🚀 **Transform your data fetching from complex to simple!** React Use Anywhere makes it incredibly easy to create reusable data fetching patterns that work seamlessly both in React components and in service layers outside of React. Say goodbye to prop drilling, context complexity, and scattered API logic!

## 1. Create Your Data Hooks

First, create hooks for data fetching, loading states, and notifications. We'll create separate hooks for different data types:

```tsx
// hooks/useUsers.ts
import { useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setUsers(data);
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch users';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: Omit<User, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const newUser = await response.json();
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create user';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (userId: string, updates: Partial<User>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const updatedUser = await response.json();
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? updatedUser : user))
        );
        return updatedUser;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to update user';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
  };
};

// hooks/usePosts.ts (separate hook for posts)
import { useState, useCallback } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setPosts(data);
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch posts';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData: Omit<Post, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const newPost = await response.json();
      setPosts((prev) => [...prev, newPost]);
      return newPost;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create post';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
  };
};

// hooks/useNotifications.ts
import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    success: (msg: string) => addNotification(msg, 'success'),
    error: (msg: string) => addNotification(msg, 'error'),
    info: (msg: string) => addNotification(msg, 'info'),
    remove: removeNotification,
  };
};
```

## 2. Setup Your App with HookProvider

Register each specific hook with its own key using the simple HookProvider:

```tsx
// App.tsx
import { HookProvider } from 'react-use-anywhere';
import { useUsers } from './hooks/useUsers';
import { usePosts } from './hooks/usePosts';
import { useNotifications } from './hooks/useNotifications';
import { UserManager } from './components/UserManager';

function App() {
  return (
    <HookProvider
      hooks={{
        users: useUsers, // Separate hook for users
        posts: usePosts, // Separate hook for posts
        notifications: useNotifications,
      }}
    >
      <div className="app">
        <h1>Data Management Demo</h1>
        <UserManager />
      </div>
    </HookProvider>
  );
}

export default App;
```

## 3. Create Services to Access Hooks

Create services that access specific hooks for different data types using the library's singleton service pattern:

```tsx
// services/userService.ts
import { createSingletonService } from 'react-use-anywhere';

// Create services for specific data types with createSingletonService
export const userService = createSingletonService('users');
export const notificationService = createSingletonService('notifications');

// User-specific API functions that access hooks anywhere
export const fetchUsers = async () => {
  return userService.use(async (userHook) => {
    await userHook.fetchUsers();
    return userHook.users;
  });
};

export const createUser = async (userData: { name: string; email: string }) => {
  return userService.use(async (userHook) => {
    const newUser = await userHook.createUser(userData);

    // Access notifications hook from a different service
    notificationService.use((notify) =>
      notify.success('User created successfully!')
    );

    return newUser;
  });
};

export const updateUser = async (
  userId: string,
  updates: { name?: string; email?: string }
) => {
  return userService.use(async (userHook) => {
    const updatedUser = await userHook.updateUser(userId, updates);

    notificationService.use((notify) =>
      notify.success('User updated successfully!')
    );

    return updatedUser;
  });
};

// services/postService.ts
export const postService = createSingletonService('posts');

// Post-specific API functions
export const fetchPosts = async () => {
  return postService.use(async (postHook) => {
    await postHook.fetchPosts();
    return postHook.posts;
  });
};

export const createPost = async (postData: {
  title: string;
  content: string;
  userId: string;
}) => {
  return postService.use(async (postHook) => {
    const newPost = await postHook.createPost(postData);

    notificationService.use((notify) =>
      notify.success('Post created successfully!')
    );

    return newPost;
  });
};
```

## 4. Use in React Components

Access your hooks directly in React components using the `useHook` function:

```tsx
// components/UserManager.tsx
import React, { useEffect, useState } from 'react';
import { useHook } from 'react-use-anywhere';
import { fetchUsers, createUser } from '../services/userService';
import { fetchPosts, createPost } from '../services/postService';

export const UserManager: React.FC = () => {
  // Access separate hooks for different data types
  const userHook = useHook('users');
  const postHook = useHook('posts');
  const notifications = useHook('notifications');

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Load data on mount
  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    try {
      await createUser({
        name: newUserName,
        email: newUserEmail,
      });
      setNewUserName('');
      setNewUserEmail('');
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleCreatePost = async (userId: string) => {
    try {
      await createPost({
        title: 'New Post',
        content: 'This is a new post content',
        userId,
      });
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div>
      <h2>Users</h2>

      {/* User loading state */}
      {userHook?.loading && <div>Loading users...</div>}
      {userHook?.error && <div>User Error: {userHook.error}</div>}

      {/* Create new user form */}
      <form onSubmit={handleCreateUser}>
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Enter user name"
        />
        <input
          type="email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="Enter user email"
        />
        <button type="submit">Add User</button>
      </form>

      {/* Users list */}
      <ul>
        {userHook?.users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => handleCreatePost(user.id)}>Add Post</button>
          </li>
        ))}
      </ul>

      <h2>Posts</h2>

      {/* Post loading state */}
      {postHook?.loading && <div>Loading posts...</div>}
      {postHook?.error && <div>Post Error: {postHook.error}</div>}

      {/* Posts list */}
      <ul>
        {postHook?.posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>: {post.content}
          </li>
        ))}
      </ul>

      {/* Show notifications */}
      <div>
        {notifications?.notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor:
                notification.type === 'error' ? '#ffebee' : '#e8f5e8',
              color: notification.type === 'error' ? '#c62828' : '#2e7d32',
              borderRadius: '4px',
            }}
          >
            {notification.message}
            <button
              onClick={() => notifications.remove(notification.id)}
              style={{ marginLeft: '10px' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 5. Use in Non-React Code

Your services can be used in utility functions, event handlers, or any JavaScript code:

```tsx
// utils/dataExport.ts
import { fetchUsers } from '../services/userService';
import { fetchPosts } from '../services/postService';

export const exportUserData = async (): Promise<Blob> => {
  try {
    const userData = await fetchUsers();
    const json = JSON.stringify(userData, null, 2);
    return new Blob([json], { type: 'application/json' });
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

export const exportPostData = async (): Promise<Blob> => {
  try {
    const postData = await fetchPosts();
    const json = JSON.stringify(postData, null, 2);
    return new Blob([json], { type: 'application/json' });
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

// Can be called from anywhere - event handlers, workers, etc.
export const downloadAllData = async () => {
  const [userBlob, postBlob] = await Promise.all([
    exportUserData(),
    exportPostData(),
  ]);

  // Create zip or handle multiple files as needed
  console.log('Data exported successfully');
};
```

## Key Benefits

✅ **Hooks stay in React** - Your hooks follow React rules and lifecycle  
✅ **Services work anywhere** - Use the same API logic in components, utils, or background tasks  
✅ **Centralized state** - Loading states and data are managed globally  
✅ **Type-safe** - Full TypeScript support with proper typing  
✅ **Easy testing** - Services can be tested independently from React components

This pattern lets you write your data fetching logic once and use it everywhere in your app!

## Real-World Impact

🎯 **Before React Use Anywhere**:

```tsx
// Multiple contexts, prop drilling nightmares
<UserContext>
  <PostContext>
    <NotificationContext>
      <LoadingContext>
        <ErrorContext>
          {/* Finally your app! */}
          <App />
        </ErrorContext>
      </LoadingContext>
    </NotificationContext>
  </PostContext>
</UserContext>;

// Scattered API logic in every component
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  // Duplicate this 50+ times across your app 😱
};
```

🚀 **After React Use Anywhere**:

```tsx
// One provider to rule them all
<HookProvider hooks={{ users: useUsers, posts: usePosts }}>
  <App />
</HookProvider>;

// Clean components focused on UI
const UserList = () => {
  const users = useHook('users');
  // That's it! All logic is in services 🎉
};
```
