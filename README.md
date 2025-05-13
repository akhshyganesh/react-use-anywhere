# React Hook Injection Pattern

This project demonstrates a pattern for safely using React hooks (like `useNavigate`) in non-React files such as services or utilities.

## The Problem

React hooks can only be used within React function components or custom hooks. This creates a challenge when you need to access hook functionality (like navigation) from service files or other non-React code.

## The Solution: Singleton + Hook Injection

This project uses a simple pattern:

1. Create a singleton service that stores the hook's value
2. Inject the hook value from a React component into the service
3. Use the service anywhere in your application

## Project Structure

```
src/
├── components/
│   ├── Home.tsx
│   └── Login.tsx
├── services/
│   ├── authService.ts      # Uses navigationService but doesn't import any React hooks
│   └── navigationService.ts # Singleton that stores the navigate function
├── App.tsx                 # Injects useNavigate into the service
└── main.tsx
```

## How it Works

1. `navigationService.ts` creates a singleton service with methods for navigation
2. `App.tsx` uses the `useNavigate` hook and injects it into the service
3. `authService.ts` uses the navigation service without needing to import React hooks
4. When `simulateTokenCheck` is called from the Home component, it triggers a navigation to the login page

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Key Takeaways

- Keep React hooks inside React components
- Use dependency injection to provide hook functionality to services
- Services remain framework-agnostic and easier to test
- Singleton pattern ensures the service is available throughout the application