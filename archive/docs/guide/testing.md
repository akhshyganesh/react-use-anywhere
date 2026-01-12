# Testing with React Use Anywhere

Learn how to effectively test React components that use the `react-use-anywhere` library.

## Overview

Testing components that use `react-use-anywhere` requires understanding how the library manages hook injection and service-component communication. This guide covers best practices for testing these components.

## Basic Testing Setup

### Testing Dependencies

First, ensure you have the necessary testing dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
```

### Test Environment Configuration

For Vitest, configure your test environment in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

## Testing Components with HookProvider and Services

### Basic Service Testing

Here's how to test a component that uses `HookProvider` and services:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HookProvider, createHookService, useHookService, useHook } from 'react-use-anywhere'
import { useState } from 'react'

// Create a simple service
const notificationService = createHookService<string | null>(null)

// Component that uses the service
const NotificationComponent = () => {
  useHookService(notificationService, 'notification')

  const handleShowNotification = () => {
    notificationService.setValue('Hello from service!')
  }

  return <button onClick={handleShowNotification}>Show Notification</button>
}

// Component that displays the notification
const NotificationDisplay = () => {
  const notification = useHook<string | null>('notification')

  if (!notification) return null

  return <div data-testid="notification">{notification}</div>
}

// Test component that combines both
const TestApp = () => {
  return (
    <HookProvider hooks={{
      notification: () => useState<string | null>(null)
    }}>
      <NotificationComponent />
      <NotificationDisplay />
    </HookProvider>
  )
}

describe('NotificationComponent', () => {
  it('should update notification through service', async () => {
    render(<TestApp />)

    // Initially no notification
    expect(screen.queryByTestId('notification')).not.toBeInTheDocument()

    // Trigger notification
    const button = screen.getByRole('button', { name: /show notification/i })
    fireEvent.click(button)

    // Notification should appear
    expect(await screen.findByTestId('notification')).toBeInTheDocument()
    expect(screen.getByTestId('notification')).toHaveTextContent('Hello from service!')
  })
})
```

### Testing with Multiple Services

When testing components that use multiple services:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { HookProvider, createHookService, useHookService, useHook } from 'react-use-anywhere'
import { useState } from 'react'

// Create services
const counterService = createHookService<number>(0)
const messageService = createHookService<string>('')

const CounterComponent = () => {
  useHookService(counterService, 'counter')

  const handleIncrement = () => {
    const current = counterService.getValue()
    counterService.setValue((current || 0) + 1)
  }

  return <button onClick={handleIncrement}>Increment</button>
}

const DisplayComponent = () => {
  const counter = useHook<number>('counter')
  const message = useHook<string>('message')

  return (
    <div>
      <div data-testid="counter">{counter}</div>
      <div data-testid="message">{message}</div>
    </div>
  )
}

const TestApp = () => {
  return (
    <HookProvider hooks={{
      counter: () => useState<number>(0),
      message: () => useState<string>('Hello')
    }}>
      <CounterComponent />
      <DisplayComponent />
    </HookProvider>
  )
}

describe('MultipleServicesComponent', () => {
  beforeEach(() => {
    // Reset services before each test
    counterService.setValue(0)
    messageService.setValue('')
  })

  it('should handle multiple services', async () => {
    render(<TestApp />)

    // Check initial values
    expect(screen.getByTestId('counter')).toHaveTextContent('0')
    expect(screen.getByTestId('message')).toHaveTextContent('Hello')

    // Update counter
    const button = screen.getByRole('button', { name: /increment/i })
    fireEvent.click(button)

    // Counter should update
    expect(screen.getByTestId('counter')).toHaveTextContent('1')
  })
})
```

## Testing Hook Services

### Testing Singleton Services

When using singleton services across components:

```typescript
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  HookProvider,
  createSingletonService,
  getSingletonService,
  resetAllServices,
  useHookService,
  useHook
} from 'react-use-anywhere'
import { useState } from 'react'

// Create singleton service
const counterSingleton = createSingletonService<number>('counter', 0)

const CounterButton = () => {
  const counterService = getSingletonService<number>('counter')
  useHookService(counterService, 'counter')

  const handleIncrement = () => {
    const current = counterService.getValue()
    counterService.setValue((current || 0) + 1)
  }

  return <button onClick={handleIncrement}>Increment</button>
}

const CounterDisplay = () => {
  const counter = useHook<number>('counter')
  return <div data-testid="counter">{counter || 0}</div>
}

const TestApp = () => {
  return (
    <HookProvider hooks={{
      counter: () => useState<number>(0)
    }}>
      <CounterButton />
      <CounterDisplay />
    </HookProvider>
  )
}

describe('Singleton Services', () => {
  beforeEach(() => {
    resetAllServices()
  })

  afterEach(() => {
    cleanup()
    resetAllServices()
  })

  it('should maintain state across components', async () => {
    render(<TestApp />)

    expect(screen.getByTestId('counter')).toHaveTextContent('0')

    const button = screen.getByRole('button', { name: /increment/i })
    fireEvent.click(button)

    expect(screen.getByTestId('counter')).toHaveTextContent('1')
  })
})
```

## Advanced Testing Patterns

### Testing Type-Safe Hooks

When using typed hooks for better type safety:

```typescript
import { TypedHookProvider, useTypedHookService, useTypedHook } from 'react-use-anywhere'

type AppHooks = {
  user: () => [User | null, (user: User | null) => void]
  theme: () => [Theme, (theme: Theme) => void]
}

const userService = createHookService<User | null>(null)

const UserComponent = () => {
  useTypedHookService<AppHooks, 'user'>(userService, 'user')

  const handleLogin = () => {
    userService.setValue({ id: 1, name: 'John Doe' })
  }

  return <button onClick={handleLogin}>Login</button>
}

const UserDisplay = () => {
  const user = useTypedHook<AppHooks, 'user'>('user')

  if (!user) return <div data-testid="no-user">Not logged in</div>

  return <div data-testid="user-name">{user.name}</div>
}

const TypedTestApp = () => {
  return (
    <TypedHookProvider<AppHooks> hooks={{
      user: () => useState<User | null>(null),
      theme: () => useState<Theme>('light')
    }}>
      <UserComponent />
      <UserDisplay />
    </TypedHookProvider>
  )
}

describe('TypedHooks', () => {
  it('should work with type-safe hooks', async () => {
    render(<TypedTestApp />)

    expect(screen.getByTestId('no-user')).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /login/i })
    fireEvent.click(button)

    expect(await screen.findByTestId('user-name')).toHaveTextContent('John Doe')
  })
})
```

### Testing Error Handling

```typescript
const ErrorComponent = () => {
  const [counter, setCounter] = useState(0)
  const counterService = createHookService<number>(0)

  useHookService(counterService, 'counter')

  const handleIncrement = () => {
    try {
      const current = counterService.getValue()
      counterService.setValue((current || 0) + 1)
    } catch (error) {
      console.error('Failed to increment:', error)
    }
  }

  return <button onClick={handleIncrement}>Increment</button>
}

describe('ErrorComponent', () => {
  it('should handle errors gracefully', () => {
    // Mock console.error to suppress error logs in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <HookProvider hooks={{ counter: () => useState<number>(0) }}>
        <ErrorComponent />
      </HookProvider>
    )

    const button = screen.getByRole('button')

    // Should not throw and crash the test
    expect(() => fireEvent.click(button)).not.toThrow()

    consoleSpy.mockRestore()
  })
})
```

## Testing Best Practices

### 1. Clean Up After Tests

Always clean up services to prevent test interference:

```typescript
afterEach(() => {
  // Reset all singleton services
  resetAllServices();
});
```

### 2. Use Data Test IDs

Use `data-testid` attributes for reliable element selection:

```typescript
const MyComponent = () => {
  const notification = useHook<string>('notification')

  return (
    <div data-testid="my-component">
      <h1 data-testid="title">Title</h1>
      {notification && (
        <div data-testid="notification">{notification}</div>
      )}
    </div>
  )
}
```

### 3. Test Accessibility

Ensure your components remain accessible:

```typescript
it('should maintain accessibility', async () => {
  render(<MyComponent />)

  // Trigger rendering
  fireEvent.click(screen.getByRole('button'))

  // Check for proper ARIA attributes
  const modal = await screen.findByRole('dialog')
  expect(modal).toHaveAttribute('aria-labelledby')
  expect(modal).toHaveAttribute('aria-describedby')
})
```

### 4. Mock External Dependencies

Mock any external dependencies that might interfere with testing:

```typescript
vi.mock('some-external-library', () => ({
  externalFunction: vi.fn(() => 'mocked result'),
}));
```

## Common Testing Scenarios

### Testing Service Communication

```typescript
const ServiceCommunicationTest = () => {
  const [counter, setCounter] = useState(0)
  const counterService = createHookService<number>(0)

  useHookService(counterService, 'counter')

  const handleIncrement = () => {
    const current = counterService.getValue()
    counterService.setValue((current || 0) + 1)
  }

  return (
    <div>
      <div data-testid="counter-display">{counter}</div>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  )
}

describe('ServiceCommunicationTest', () => {
  it('should communicate between services and components', async () => {
    render(
      <HookProvider hooks={{ counter: () => useState<number>(0) }}>
        <ServiceCommunicationTest />
      </HookProvider>
    )

    expect(screen.getByTestId('counter-display')).toHaveTextContent('0')

    const button = screen.getByRole('button', { name: /increment/i })
    fireEvent.click(button)

    expect(screen.getByTestId('counter-display')).toHaveTextContent('1')
  })
})
```

### Testing with HookProvider Hook Access

```typescript
const HookAccessComponent = () => {
  const counter = useHook<number>('counter')
  const [localState, setLocalState] = useState(0)

  const handleUpdate = () => {
    setLocalState(current => current + 1)
  }

  return (
    <div>
      <div data-testid="hook-counter">{counter || 0}</div>
      <div data-testid="local-state">{localState}</div>
      <button onClick={handleUpdate}>Update Local</button>
    </div>
  )
}

describe('HookAccessComponent', () => {
  it('should access hooks from provider', () => {
    render(
      <HookProvider hooks={{
        counter: () => useState<number>(5)
      }}>
        <HookAccessComponent />
      </HookProvider>
    )

    expect(screen.getByTestId('hook-counter')).toHaveTextContent('5')
    expect(screen.getByTestId('local-state')).toHaveTextContent('0')

    const button = screen.getByRole('button', { name: /update local/i })
    fireEvent.click(button)

    expect(screen.getByTestId('local-state')).toHaveTextContent('1')
  })
})
```

## Debugging Tips

### 1. Visual Debugging

Use `screen.debug()` to see the current DOM state:

```typescript
it('should render content', () => {
  render(<MyComponent />)

  // Debug current DOM
  screen.debug()

  fireEvent.click(screen.getByRole('button'))

  // Debug after interaction
  screen.debug()
})
```

### 2. Check Container Contents

Verify where content is actually rendered:

```typescript
it('should render in correct container', () => {
  render(<MyComponent />)

  fireEvent.click(screen.getByRole('button'))

  // Check document body for rendered content
  console.log('Body contents:', document.body.innerHTML)
})
```

## Conclusion

Testing components that use `react-use-anywhere` requires attention to:

- Proper cleanup after tests
- Understanding hook service communication
- Using appropriate testing utilities
- Maintaining accessibility standards

Follow these patterns to ensure your components are well-tested and reliable.
