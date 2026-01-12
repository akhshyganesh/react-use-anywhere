# Demo Application

Welcome to the React Use Anywhere demo! 🎮

This interactive demo shows you how to use hooks from anywhere in your codebase.

## 🎯 What You'll Learn

This demo is organized progressively:

### Level 1: Basic Navigation ⭐

**What:** Call navigation from a service  
**Where:** `services/navigationService.ts`  
**Try:** Click "Go to Login" on any page

```typescript
// services/navigationService.ts
export const goToHome = () => {
  navService.use((navigate) => navigate('/'));
};
```

### Level 2: Authentication Flow ⭐⭐

**What:** Login/logout from services  
**Where:** `services/authService.ts`  
**Try:** Fill the login form and submit

```typescript
// services/authService.ts
export const login = (name: string, email: string) => {
  authService.use((auth) => auth.login(name, email));
};
```

### Level 3: Theme Management ⭐⭐⭐

**What:** Toggle theme from services  
**Where:** `services/themeService.ts`  
**Try:** Click "Toggle Theme" on home page

```typescript
// services/themeService.ts
export const toggleTheme = () => {
  themeService.use((theme) => theme.toggle());
};
```

### Level 4: Advanced - Token Expiry ⭐⭐⭐⭐

**What:** Auto-logout and redirect on token expiry  
**Where:** `services/authService.ts` → calls multiple services  
**Try:** Click "Simulate Token Expiry"

```typescript
// services/authService.ts
export const simulateTokenExpiry = () => {
  authService.use((auth) => auth.logout());
  navService.use((nav) => nav('/login'));
  // Multiple services working together!
};
```

## 🚀 Quick Start

### Run the Demo

```bash
npm install
npm run dev
```

Then open http://localhost:5173

### Explore the Code

1. **Start here:** `App.tsx` - See how HookProvider is set up
2. **Then look at:** `components/` - See useHookService connections
3. **Finally check:** `services/` - See service calls from anywhere

## 📂 File Structure

```
demo/
├── App.tsx                      → HookProvider setup
├── main.tsx                     → Entry point
│
├── components/                  → React Components
│   ├── Login.tsx               → Login form (Level 2)
│   ├── Home.tsx                → Dashboard (Levels 1, 3, 4)
│   └── DebugPanel.tsx          → Visual logging
│
└── services/                    → Business Logic (No React!)
    ├── navigationService.ts    → Navigation from anywhere
    ├── authService.ts          → Auth from anywhere
    ├── themeService.ts         → Theme from anywhere
    └── logger.ts               → Demo logging utility
```

## 💡 Key Concepts Demonstrated

### 1. Provider Setup (App.tsx)

```tsx
<HookProvider hooks={{
  navigate: useNavigation,
  auth: useAuth,
  theme: useTheme
}}>
```

**Lesson:** Register all your hooks once at the top level

### 2. Service Creation (services/\*.ts)

```typescript
export const navService = createSingletonService('navigate');
```

**Lesson:** Create singleton services for each hook

### 3. Component Connection (components/\*.tsx)

```tsx
useHookService(navService, 'navigate');
```

**Lesson:** Connect services in components that use them

### 4. Use Anywhere (services/\*.ts)

```typescript
export const goHome = () => {
  navService.use((navigate) => navigate('/'));
};
```

**Lesson:** Call services from any JavaScript file!

## 🎓 Learning Path

**Complete Beginner?**

1. Run the demo
2. Click around and watch the Debug Panel
3. Read `services/navigationService.ts` (simplest)
4. Read `App.tsx` to see setup
5. Read `components/Login.tsx` to see connections

**Already familiar?**

1. Check `services/authService.ts` for multi-service patterns
2. See `components/Home.tsx` for advanced usage
3. Notice how services have zero React dependencies!

**Want to build your own?**

1. Copy the pattern from `App.tsx`
2. Create your own services like `services/authService.ts`
3. Connect in components like `components/Login.tsx`

## 🔍 Debug Panel

The demo includes a visual Debug Panel that shows:

- 🟢 **Service Calls** - When services are invoked
- 🔵 **Context Updates** - When React context changes
- 🟡 **Data Sync** - When data flows between services and context

Watch the panel as you interact with the demo to understand the flow!

## 🧪 Try These Experiments

1. **Remove a useHookService connection** - See what happens!
2. **Add a new service** - Create `notificationService`
3. **Call multiple services** - Combine auth + navigation
4. **Add error handling** - Try/catch in service calls

## 📚 Next Steps

After understanding the demo:

- Read the [Getting Started Guide](../GETTING_STARTED.md)
- Check [Examples](../examples/) for specific patterns
- Explore [Full Documentation](../docs/)

## 💬 Questions?

- How does `useHookService` work? → See [API Docs](../docs/api/hooks.md)
- What's a singleton service? → See [Core Concepts](../docs/guide/core-concepts.md)
- How to test this? → See [Testing Guide](../docs/guide/testing.md)

---

**Ready?** Start with the Login page and watch the magic happen! ✨
