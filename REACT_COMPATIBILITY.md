# React Version Compatibility Guide

## 🎯 Universal React Support

The `react-use-anywhere` library is designed to work with **ALL React versions that support hooks** and beyond. Here's the comprehensive compatibility matrix:

## ✅ Supported React Versions

| React Version | Status | Hook Features | Tested | Notes |
|---------------|--------|---------------|---------|-------|
| **16.8.0** | ✅ Full Support | Initial hooks release | ✅ | Minimum required version |
| **16.8.1 - 16.14.x** | ✅ Full Support | Stable hooks | ✅ | Production ready |
| **17.0.0 - 17.0.x** | ✅ Full Support | Event delegation changes | ✅ | No impact on hooks |
| **18.0.0 - 18.x** | ✅ Full Support | Concurrent features | ✅ | Concurrent mode compatible |
| **19.0.0+** | 🔮 Future Ready | TBD | 🧪 | Will be tested when available |

## 🔄 Router Compatibility Matrix

| Router Library | React Version | Navigation Hook | Status | Example |
|----------------|---------------|-----------------|---------|---------|
| **React Router v5** | 16.8+ | `useHistory` | ✅ | `history.push` |
| **React Router v6** | 16.8+ | `useNavigate` | ✅ | `navigate('/path')` |
| **Reach Router** | 16.8+ | `navigate` | ✅ | `navigate('/path')` |
| **Next.js Router** | 16.8+ | `useRouter` | ✅ | `router.push` |
| **Custom Router** | 16.8+ | Custom hook | ✅ | Any function |

## 🎯 React Features Used

Our library only uses React features that are **universally available** across all hook-supporting versions:

### Core Hooks (16.8.0+)
```typescript
// ✅ Available in ALL React versions with hooks
import { useEffect, useRef, useContext, useMemo } from 'react';
```

### Context API (16.3.0+)
```typescript
// ✅ Available BEFORE hooks were even introduced
import { createContext } from 'react';
```

### TypeScript Types
```typescript
// ✅ Compatible with all @types/react versions
import { ReactNode } from 'react';
```

## 📋 Version-Specific Examples

### React 16.8.x with React Router v5
```tsx
import React from 'react';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { HookInjectionProvider } from 'react-use-anywhere';

function App() {
  const history = useHistory();
  
  return (
    <HookInjectionProvider navigationHook={() => history.push}>
      {/* Your app */}
    </HookInjectionProvider>
  );
}

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### React 17.x with React Router v6
```tsx
import React from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { HookInjectionProvider } from 'react-use-anywhere';

function App() {
  return (
    <HookInjectionProvider navigationHook={useNavigate}>
      {/* Your app */}
    </HookInjectionProvider>
  );
}

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### React 18.x with Concurrent Features
```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { HookInjectionProvider } from 'react-use-anywhere';

function App() {
  return (
    <HookInjectionProvider navigationHook={useNavigate}>
      {/* Your app with concurrent features */}
    </HookInjectionProvider>
  );
}

// React 18 root API
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### Next.js (Any React Version)
```tsx
// pages/_app.tsx
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { HookInjectionProvider } from 'react-use-anywhere';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  return (
    <HookInjectionProvider navigationHook={() => router.push}>
      <Component {...pageProps} />
    </HookInjectionProvider>
  );
}

export default MyApp;
```

## 🔧 Installation by React Version

### For React 16.8+
```bash
npm install react-use-anywhere
# Peer dependencies automatically resolved
```

### For TypeScript Projects
```bash
npm install react-use-anywhere
npm install --save-dev @types/react @types/react-dom
```

## 🧪 Testing Different React Versions

The library includes comprehensive compatibility tests:

```bash
# Run all compatibility tests
npm test

# Run specific compatibility tests
npm test -- --testNamePattern="React Version Compatibility"
```

## 🚨 Migration Between React Versions

### Upgrading React 16.8 → 17.x
```javascript
// No changes needed in your hook injection code
// Library continues to work exactly the same
```

### Upgrading React 17.x → 18.x
```javascript
// No changes needed in hook injection
// Library is concurrent mode compatible
// Optional: Use React 18 createRoot API for better performance
```

## 🔍 Compatibility Verification

You can verify compatibility in your project:

```typescript
import { createNavigationService } from 'react-use-anywhere';

// This should work in any React version with hooks
const service = createNavigationService();
console.log('✅ Library loaded successfully');

// Test with your navigation hook
const mockNavigate = (path: string) => console.log(`Navigate to: ${path}`);
service.setNavigate?.(mockNavigate);
service.navigate('/test');
// Should log: "Navigate to: /test"
```

## 🎉 Benefits of Universal Compatibility

1. **No Version Lock-in**: Upgrade React whenever you want
2. **Team Flexibility**: Different projects can use different React versions
3. **Future Proof**: Ready for upcoming React versions
4. **Backward Compatible**: Works with older React versions
5. **Library Ecosystem**: Compatible with any React-based router or state management

## 📞 Support

If you encounter compatibility issues with any React version:

1. Check our [compatibility tests](../test/ReactCompatibility.test.ts)
2. Open an issue with your React version and error details
3. We'll add specific support and tests for your use case

**The library is designed to be truly universal across all React versions with hooks support!** 🚀
