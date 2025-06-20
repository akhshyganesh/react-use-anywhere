# Installation

## Requirements

- **React** 16.8+ (hooks support required)
- **TypeScript** 4.1+ (optional, but recommended)
- **Node.js** 14+ (for development)

## Package Installation

Install React Use Anywhere from npm:

::: code-group

```bash [npm]
npm install react-use-anywhere
```

```bash [yarn]
yarn add react-use-anywhere
```

```bash [pnpm]
pnpm add react-use-anywhere
```

```bash [bun]
bun add react-use-anywhere
```

:::

## Verify Installation

Create a simple test to verify the installation works:

```typescript
// test-installation.ts
import { HookProvider, useHookService } from 'react-use-anywhere';

console.log('React Use Anywhere installed successfully!');
console.log('HookProvider:', typeof HookProvider);
console.log('useHookService:', typeof useHookService);
```

## TypeScript Configuration

If you're using TypeScript, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

## Framework-Specific Setup

### Vite

No additional configuration needed. Vite works out of the box:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### Create React App

Works without additional configuration:

```bash
npx create-react-app my-app --template typescript
cd my-app
npm install react-use-anywhere
```

### Next.js

Works with both App Router and Pages Router:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
```

### Webpack

If using custom Webpack configuration:

```javascript
// webpack.config.js
module.exports = {
  // ... other config
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
```

## Troubleshooting Installation

### Common Issues

#### 1. Module Resolution Errors

If you see module resolution errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or for yarn
rm -rf node_modules yarn.lock
yarn install
```

#### 2. TypeScript Declaration Issues

Ensure you have the latest TypeScript version:

```bash
npm install -D typescript@latest
```

#### 3. React Version Conflicts

Check your React version:

```bash
npm list react react-dom
```

Ensure React is 16.8 or higher:

```bash
npm install react@latest react-dom@latest
```

#### 4. Build Tool Issues

For Vite users experiencing issues:

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

For Webpack users:

```bash
# Clear Webpack cache
rm -rf node_modules/.cache
npm run build
```

### Getting Help

If you encounter installation issues:

1. **Check our [Troubleshooting Guide](/guide/troubleshooting)**
2. **Search existing [GitHub Issues](https://github.com/akhshyganesh/react-use-anywhere/issues)**
3. **Create a new issue** with:
   - Your environment details (`node --version`, `npm --version`)
   - Package.json dependencies
   - Error messages
   - Minimal reproduction steps

## Next Steps

Once installed, head to our [Quick Start guide](/guide/quick-start) to build your first service with React Use Anywhere!
