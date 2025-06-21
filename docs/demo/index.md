# Interactive Demo

Experience React Use Anywhere in action! This demo shows how you can use React hooks from service layers to handle authentication, navigation, and theme management.

## Live Demo

<img src="/public/demo-picture.png" alt="react-use-anywhere-demo-picture">

_The demo is running in an embedded iframe above. You can interact with it directly!_

## What You'll See

The demo demonstrates these key features:

### 🔐 **Authentication from Services**

- Login/logout handled completely in service layer
- Automatic navigation after authentication
- User state management across the app

### 🧭 **Navigation from Business Logic**

- Navigate to different pages from service methods
- Conditional routing based on authentication state
- Hash-based routing for demo simplicity

### 🎨 **Theme Management**

- Toggle between light and dark themes
- Theme changes triggered from service layer
- Persistent theme state

## Demo Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Demo App                              │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │   Components    │    │        Services             │ │
│  │                 │    │                             │ │
│  │ • Home          │◄───┤ • authService.ts            │ │
│  │ • Login         │    │ • navigationService.ts      │ │
│  │ • DebugPanel    │    │ • themeService.ts           │ │
│  │                 │    │ • logger.ts                 │ │
│  └─────────────────┘    └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│              HookProvider / TypedHookProvider           │
│          navigation • auth • theme                      │
└─────────────────────────────────────────────────────────┘
```

## Key Demo Services

### Authentication Service

```typescript
// Services can handle login and navigate automatically
export const authService = createSingletonService<AuthHook>('auth');

export const simulateLogin = async (name: string, email: string) => {
  return authService.use(async (auth) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    auth.login(name, email);
    console.log('User logged in successfully');

    // Navigate from service layer! 🎉
    return navigationService.use((navigate) => {
      navigate('/');
    });
  });
};
```

### Theme Service

```typescript
// Theme changes can be triggered from anywhere
export const themeService = createSingletonService<ThemeHook>('theme');

export const toggleTheme = () => {
  return themeService.use((theme) => {
    theme.toggle();
    console.log(`Theme switched to: ${theme.theme}`);
  });
};
```

### Navigation Service

```typescript
// Navigation logic separated from UI
export const navigationService = createSingletonService<NavigateFunction>('navigation');

export const goToLogin = () => {
  return navigationService.use((navigate) => {
    navigate('/login');
    console.log('Navigated to login page');
  });
};
  goToLogin() {
    const navigate = useTypedHookService<AppHooks>('navigation');
    navigate('/login');
    logger.log('Navigated to login page');
  },

  goHome() {
    const navigate = useTypedHookService<AppHooks>('navigation');
    navigate('/');
    logger.log('Navigated to home page');
  },
};
```

## Demo Features

### 🎯 **Try These Actions:**

1. **Login Process:**

   - Click "Go to Login"
   - Enter your name and email
   - Click "Login" - watch the automatic navigation!

2. **Theme Toggle:**

   - Use the theme toggle button
   - Notice the service-driven theme changes
   - Check the debug panel for service logs

3. **Navigation:**

   - Use service-driven navigation buttons
   - Observe how navigation happens from service layer
   - All routing logic is in services, not components

4. **Debug Panel:**
   - Monitor real-time service calls
   - See hook service interactions
   - Watch the separation of concerns in action

### 🔍 **Debug Panel**

The demo includes a debug panel that shows:

- Service method calls in real-time
- Hook service interactions
- Authentication state changes
- Navigation events
- Theme switching events

## Source Code

The complete demo source code is available in the repository:

```
demo/
├── App.tsx              # Main app with providers
├── components/
│   ├── Home.tsx         # Home page component
│   ├── Login.tsx        # Login form component
│   └── DebugPanel.tsx   # Debug logging panel
├── services/
│   ├── authService.ts   # Authentication logic
│   ├── navigationService.ts # Navigation logic
│   ├── themeService.ts  # Theme management
│   └── logger.ts        # Debug logging
└── assets/
    ├── App.css          # Demo styles
    └── index.css        # Base styles
```

## Run Demo Locally

Want to run the demo on your machine?

```bash
# Clone the repository
git clone https://github.com/akhshyganesh/react-use-anywhere.git
cd react-use-anywhere

# Install dependencies
npm install

# Run the demo
npm run demo

# Open http://localhost:5173 in your browser
```

## Key Takeaways

After exploring the demo, you should understand:

✅ **Services can handle complex workflows** - Login → Navigation → State Updates  
✅ **Business logic separated from UI** - Components focus on presentation  
✅ **Type safety throughout** - Full TypeScript support in services  
✅ **Testable architecture** - Services can be tested independently  
✅ **Clean separation of concerns** - Each service has a single responsibility

## What's Next?

- **[Installation Guide](/guide/installation)** - Set up in your project
- **[Quick Start](/guide/quick-start)** - Build your first service
- **[Examples](/examples/basic-usage)** - More real-world patterns
- **[API Reference](/api/overview)** - Complete documentation

Ready to build something amazing? Start with our [Quick Start guide](/guide/quick-start)!
