# React Use Anywhere

🎯 **Use React hooks anywhere in your codebase** - in services, utilities, and business logic files.

## 🚀 Key Features

- ✅ **Hook-Agnostic**: Works with ANY React hooks (navigation, auth, theme, data fetching, etc.)
- ✅ **Router-Agnostic**: Compatible with React Router, TanStack Router, Next.js Router, or no router at all
- ✅ **Production Ready**: Full TypeScript support, comprehensive error handling, and testing
- ✅ **Zero Dependencies**: No router dependencies, uses peer dependencies only
- ✅ **Modular**: Use only what you need, tree-shakeable
- ✅ **Universal React Support**: Works with React 16.8+ through 18.x

## 🎯 Perfect For

- **Service Layer**: Use hooks in authentication, API, and business logic services
- **Utility Functions**: Access hook functionality in utility libraries  
- **Non-React Files**: Bridge React hooks to plain JavaScript/TypeScript modules
- **Legacy Integration**: Add hook functionality to existing codebases
- **Testing**: Easily mock hook behavior in unit tests

## 📦 Installation

```bash
npm install react-use-anywhere
```

## 🏁 Quick Start

```typescript
import { HookInjectionProvider, createHookService, useHookInjection } from 'react-use-anywhere';

// 1. Create services for any hooks
const authService = createHookService();
const navigationService = createHookService();

// 2. Provide hooks in your app
<HookInjectionProvider hooks={{ 
  auth: useAuth,
  navigation: useNavigate  // works with any router!
}}>
  <App />
</HookInjectionProvider>

// 3. Use hooks in non-React files
export function handleLogin() {
  authService.execute((auth) => auth.login());
  navigationService.execute((nav) => nav('/dashboard'));
}
```

## 🌟 Why Choose react-use-anywhere?

- **Universal Compatibility**: Works with any React setup, router, or hooks
- **Simple API**: Minimal learning curve, intuitive usage
- **Production Tested**: Used in real applications, thoroughly tested
- **Great DX**: Excellent TypeScript support and developer experience
- **Future Proof**: Independent of specific framework versions

---

**Made with ❤️ for the React community**
