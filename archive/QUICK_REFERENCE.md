# Quick Reference Card

Fast lookup for common patterns. Print or bookmark! 📌

## Setup (One Time)

```tsx
// App.tsx
import { HookProvider } from 'react-use-anywhere';

<HookProvider
  hooks={{
    navigate: useNavigate,
    auth: useAuth,
    theme: useTheme,
  }}
>
  <YourApp />
</HookProvider>;
```

## Create Service (Once Per Hook)

```typescript
// services/myService.ts
import { createSingletonService } from 'react-use-anywhere';

export const myService = createSingletonService('myHook');
```

## Connect in Component (Required!)

```tsx
// MyComponent.tsx
import { useHookService } from 'react-use-anywhere';
import { myService } from '../services/myService';

function MyComponent() {
  useHookService(myService, 'myHook'); // ⚡ Required!

  return <button onClick={myAction}>Click</button>;
}
```

## Use Anywhere

```typescript
// Any .ts file - services, utils, anywhere!
export const myAction = () => {
  myService.use((hook) => hook.doSomething());
};
```

---

## Common Patterns

### Navigate

```typescript
const navService = createSingletonService('navigate');

export const goHome = () => {
  navService.use((nav) => nav('/'));
};
```

### Logout & Redirect

```typescript
export const logout = () => {
  authService.use((auth) => auth.logout());
  navService.use((nav) => nav('/login'));
};
```

### Multiple Services

```typescript
export const submit = async (data) => {
  await api.post(data);

  authService.use((auth) => auth.update(data));
  notifyService.use((notify) => notify.success('Saved!'));
  navService.use((nav) => nav('/success'));
};
```

### Conditional

```typescript
export const protectedAction = () => {
  const isAuth = authService.use((auth) => auth.isAuthenticated);

  if (!isAuth) {
    navService.use((nav) => nav('/login'));
    return;
  }

  // Do protected thing
};
```

### Error Handling

```typescript
export const fetchData = async () => {
  try {
    return await api.get('/data');
  } catch (error) {
    notifyService.use((notify) => notify.error('Failed'));
    throw error;
  }
};
```

### Get Value

```typescript
// Get current value without calling hook function
const currentUser = authService.use((auth) => auth.user);
```

---

## TypeScript

### Basic Types

```typescript
import { HookService } from 'react-use-anywhere';

type MyHook = () => {
  value: string;
  setValue: (v: string) => void;
};

const myService: HookService<ReturnType<MyHook>> =
  createSingletonService('myHook');
```

### Typed Provider

```typescript
type AppHooks = {
  navigate: () => NavigateFunction;
  auth: () => AuthState;
};

<TypedHookProvider<AppHooks> hooks={{...}}>
```

---

## Testing

### Mock Service

```typescript
import { resetAllServices } from 'react-use-anywhere';

beforeEach(() => {
  resetAllServices(); // Clear all services
});

test('myAction', () => {
  // Mock the service
  const mockNav = jest.fn();
  navService.use = jest.fn((cb) => cb(mockNav));

  myAction();

  expect(mockNav).toHaveBeenCalledWith('/home');
});
```

---

## API Cheat Sheet

| Function                          | Use                     |
| --------------------------------- | ----------------------- |
| `HookProvider`                    | Wrap app (setup)        |
| `createSingletonService('name')`  | Create service          |
| `useHookService(service, 'name')` | Connect in component    |
| `service.use(callback)`           | Call hook from anywhere |
| `resetAllServices()`              | Clear all (testing)     |

---

## File Structure

```
src/
├── App.tsx                      # HookProvider setup
│
├── components/                  # React components
│   └── MyComponent.tsx         # useHookService here
│
├── services/                    # Business logic
│   ├── authService.ts          # createSingletonService
│   ├── navService.ts           # Export functions
│   └── themeService.ts         # No React imports!
│
└── hooks/                       # Custom hooks
    └── useAuth.ts              # Register in provider
```

---

## Troubleshooting

### Service returns null?

→ Did you call `useHookService` in a component?

### Hook not updating?

→ Make sure component using service is mounted

### TypeScript errors?

→ Check hook types match service types

### Import errors?

→ Ensure correct path to `react-use-anywhere`

---

## Next Steps

- Full guide: [Quick Start](./docs/guide/quick-start.md)
- Examples: [Examples](./docs/examples/README.md)
- API docs: [API Reference](./docs/api/overview.md)

---

**Print this card and keep it handy!** 📌
