# Basic Navigation Example

This example demonstrates the simplest usage of the React Hook Injection Pattern for navigation.

## Features Demonstrated

- Basic navigation service setup
- Hook injection with `useHookInjection`
- Navigation from non-React service files
- Error handling and warnings

## Key Files

- `App.tsx` - Main app with provider setup
- `services/navigationService.ts` - Navigation service instance
- `services/userService.ts` - Example service using navigation
- `components/HomePage.tsx` - Component with hook injection

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## Code Walkthrough

### 1. Provider Setup
```tsx
// App.tsx
import { HookInjectionProvider } from 'react-use-anywhere';
import { useNavigate } from 'react-router-dom';

<HookInjectionProvider navigationHook={useNavigate}>
  <Routes>
    {/* Your routes */}
  </Routes>
</HookInjectionProvider>
```

### 2. Service Creation
```typescript
// services/navigationService.ts
import { createSingletonNavigationService } from 'react-use-anywhere';

export const navigationService = createSingletonNavigationService();
```

### 3. Hook Injection
```tsx
// components/HomePage.tsx
import { useHookInjection } from 'react-use-anywhere';

function HomePage() {
  useHookInjection(navigationService);
  // Now navigationService can be used in any service file
}
```

### 4. Usage in Services
```typescript
// services/userService.ts
import { navigationService } from './navigationService';

export function handleLogout() {
  clearUserData();
  navigationService.navigateToLogin();
}
```
