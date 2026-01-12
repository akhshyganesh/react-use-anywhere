# Examples

Real-world code examples you can copy and use in your projects. 💡

## 🎯 Start Here

**New to the library?** Start with these in order:

### 1. ⭐ Navigation (Easiest)

**File:** [navigation.md](./navigation.md)  
**Time:** 3 minutes  
**Learn:** Navigate from services

```typescript
export const goHome = () => {
  navService.use((navigate) => navigate('/'));
};
```

### 2. ⭐⭐ Authentication (Common)

**File:** [authentication.md](./authentication.md)  
**Time:** 10 minutes  
**Learn:** Login/logout flows, redirects

```typescript
export const login = async (email, password) => {
  const user = await api.login(email, password);
  authService.use((auth) => auth.setUser(user));
  navService.use((nav) => nav('/dashboard'));
};
```

### 3. ⭐⭐ Theme Management (Visual)

**File:** [theme-management.md](./theme-management.md)  
**Time:** 8 minutes  
**Learn:** Update UI from services

```typescript
export const toggleDarkMode = () => {
  themeService.use((theme) => theme.toggle());
};
```

## 📚 By Use Case

### User Interactions

- **[Authentication](./authentication.md)** - Login, logout, sessions ⭐⭐
- **[Navigation](./navigation.md)** - Routing, redirects ⭐

### UI Updates

- **[Theme Management](./theme-management.md)** - Dark mode, themes ⭐⭐
- **[Notifications](./basic-usage.md#notifications)** - Toasts, alerts ⭐⭐

### Data Operations

- **[Data Fetching](./data-fetching.md)** - APIs, loading states ⭐⭐⭐
- **[Form Handling](./basic-usage.md#forms)** - Form submit, validation ⭐⭐

### Advanced

- **[Router Integration](./router-integration.md)** - Different routers ⭐⭐⭐⭐
- **[Real-time Updates](./basic-usage.md#realtime)** - WebSockets ⭐⭐⭐⭐

## 🎮 Interactive Examples

Want to see it in action? Check out:

- **[Live Demo](../../demo)** - Interactive app with all patterns
- **[Code Examples](../../examples)** - Standalone TypeScript files

## 📋 By Pattern

### Service Creation

```typescript
// Create a service
const myService = createSingletonService('myHook');

// Use in functions
export const myAction = () => {
  myService.use((hook) => hook.doSomething());
};
```

**Examples:** All of them! Start with [Navigation](./navigation.md)

### Multiple Services

```typescript
// Use multiple services together
export const complexAction = () => {
  authService.use((auth) => auth.logout());
  navService.use((nav) => nav('/login'));
  notifyService.use((notify) => notify.info('Logged out'));
};
```

**Example:** [Authentication](./authentication.md)

### Conditional Logic

```typescript
// Make decisions based on state
export const protectedAction = () => {
  const isAuth = authService.use((auth) => auth.isAuthenticated);

  if (!isAuth) {
    navService.use((nav) => nav('/login'));
    return;
  }

  // Continue with action
};
```

**Example:** [Data Fetching](./data-fetching.md)

### Error Handling

```typescript
// Handle errors gracefully
export const fetchData = async () => {
  try {
    return await api.get('/data');
  } catch (error) {
    notifyService.use((notify) => notify.error('Failed to load data'));
    throw error;
  }
};
```

**Example:** [Data Fetching](./data-fetching.md)

## 🚀 Quick Copy-Paste

Need something specific? Copy these snippets:

### Navigate After Action

```typescript
export const submitForm = async (data: FormData) => {
  await api.submit(data);
  navService.use((nav) => nav('/success'));
};
```

### Logout with Cleanup

```typescript
export const logout = () => {
  authService.use((auth) => auth.logout());
  cartService.use((cart) => cart.clear());
  navService.use((nav) => nav('/login'));
};
```

### Show Notification

```typescript
export const notify = (message: string, type: 'success' | 'error') => {
  notifyService.use((notify) => notify[type](message));
};
```

### Handle 401 Error

```typescript
if (error.status === 401) {
  authService.use((auth) => auth.logout());
  navService.use((nav) => nav('/login'));
}
```

## 📖 Full Examples

### Complete Implementations

Each example includes:

- ✅ Full source code
- ✅ Explanation
- ✅ Best practices
- ✅ Common pitfalls

1. **[Navigation](./navigation.md)** - 260 lines, basic patterns
2. **[Authentication](./authentication.md)** - 506 lines, complete auth flow
3. **[Theme Management](./theme-management.md)** - 362 lines, UI updates
4. **[Data Fetching](./data-fetching.md)** - 556 lines, API integration
5. **[Router Integration](./router-integration.md)** - 711 lines, different routers
6. **[Basic Usage](./basic-usage.md)** - 1110 lines, all patterns

## 🎯 Learning Path

**Day 1:** Navigation → Authentication  
**Day 2:** Theme Management → Data Fetching  
**Day 3:** Router Integration → Build your own!

## ❓ Help Choosing

**"I want to navigate from a utility function"**  
→ [Navigation](./navigation.md)

**"I need login/logout functionality"**  
→ [Authentication](./authentication.md)

**"I want to change theme from anywhere"**  
→ [Theme Management](./theme-management.md)

**"I need to fetch data and show loading states"**  
→ [Data Fetching](./data-fetching.md)

**"I use TanStack Router/Remix/Next.js"**  
→ [Router Integration](./router-integration.md)

**"I want to see everything"**  
→ [Basic Usage](./basic-usage.md) (comprehensive)

## 💡 Tips for Learning

✅ **Start simple** - Navigation example first  
✅ **Copy-paste** - All examples are production-ready  
✅ **Modify** - Adapt to your needs  
✅ **Run demo** - See it working  
✅ **Ask questions** - Use GitHub issues

## 🔗 Related Resources

- **[Quick Start](../guide/quick-start.md)** - 5-minute tutorial
- **[Service Patterns](../guide/service-patterns.md)** - Design principles
- **[Live Demo](../../demo)** - Interactive examples
- **[API Reference](../api/overview.md)** - Complete API docs

---

**Ready to code?** Pick an example and start building! 🚀

**Questions?** [Ask on GitHub](https://github.com/akhshyganesh/react-use-anywhere/issues)
