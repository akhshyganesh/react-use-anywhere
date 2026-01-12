# Repository Structure

This document explains the organization of this repository to help you find what you need quickly.

## 📂 Quick Navigation

```
react-use-anywhere/
│
├── 📖 Documentation & Guides
│   ├── README.md                    → Start here! Overview and quick examples
│   ├── GETTING_STARTED.md          → Step-by-step beginner tutorial
│   ├── CONTRIBUTING.md             → How to contribute
│   └── CHANGELOG.md                → Version history
│
├── 💻 Source Code
│   ├── lib/                        → Library source code (TypeScript)
│   │   ├── index.ts               → Main exports
│   │   ├── types.ts               → TypeScript definitions
│   │   ├── hooks/                 → React hooks
│   │   ├── providers/             → Context providers
│   │   └── services/              → Service creators
│   └── test/                       → Test files
│
├── 🎮 Examples & Demo
│   ├── demo/                       → Interactive demo application
│   │   ├── App.tsx                → Demo app entry
│   │   ├── components/            → Demo components
│   │   └── services/              → Example services
│   └── examples/                   → Code examples
│       ├── router-agnostic-demo.tsx
│       └── type-safe-usage.tsx
│
├── 📚 Full Documentation Site
│   └── docs/                       → VitePress documentation site
│       ├── guide/                 → User guides
│       │   ├── introduction.md    → What is this library?
│       │   ├── quick-start.md     → 5-minute tutorial
│       │   ├── core-concepts.md   → Deep dive
│       │   └── ...                → More guides
│       ├── api/                   → API reference
│       ├── examples/              → Usage examples
│       └── index.md               → Docs homepage
│
└── ⚙️ Configuration
    ├── package.json                → Dependencies and scripts
    ├── tsconfig.json               → TypeScript config
    ├── vite.lib.config.ts         → Library build config
    └── vite.demo.config.ts        → Demo build config
```

## 🎯 Where to Start

### New Users

1. Read [README.md](./README.md) for quick overview
2. Follow [GETTING_STARTED.md](./GETTING_STARTED.md) for hands-on tutorial
3. Browse [examples/](./examples) for real-world patterns
4. Run the [demo/](./demo) to see it in action

### Contributors

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Review [lib/](./lib) source code
3. Check [test/](./test) for testing patterns
4. See [CHANGELOG.md](./CHANGELOG.md) for recent changes

### Documentation Writers

1. Visit [docs/](./docs) folder
2. Follow VitePress structure
3. Run `npm run docs:dev` to preview

## 📖 Documentation Hierarchy

**For quick reference:** README.md → Covers 80% of use cases

**For learning:** GETTING_STARTED.md → Step-by-step progressive tutorial

**For deep understanding:** docs/ → Complete guides, API reference, and advanced topics

## 🚀 Common Commands

```bash
# Development
npm run dev              # Run demo app
npm test                 # Run tests
npm run test:watch       # Watch mode

# Building
npm run build            # Build everything
npm run build:lib        # Build library only
npm run build:demo       # Build demo only

# Documentation
npm run docs:dev         # Run docs site locally
npm run docs:build       # Build docs site
```

## 📦 What Gets Published

When you install `react-use-anywhere` from npm, you get:

- `dist/` - Compiled library code
- `README.md` - Main documentation
- `LICENSE` - MIT license
- `CHANGELOG.md` - Version history

The `docs/`, `demo/`, `test/`, and `examples/` folders are only in the GitHub repository.

## 🎨 Code Organization

### Library Code (lib/)

- **Providers** - React context providers that execute hooks
- **Hooks** - React hooks for connecting services
- **Services** - Service creation utilities
- **Types** - TypeScript type definitions

### Demo App (demo/)

- Shows real-world usage
- No router dependencies
- Full auth + navigation + theme example
- Can be built and deployed independently

### Examples (examples/)

- Standalone code snippets
- Copy-paste ready
- Show specific patterns

### Tests (test/)

- Unit tests for all features
- Integration tests
- Setup and utilities

## 💡 Tips

- **Lost?** Start with [README.md](./README.md)
- **Learning?** Try [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Need details?** Check [docs/](./docs)
- **Want examples?** See [examples/](./examples) or [demo/](./demo)
- **Contributing?** Read [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Questions?** Open an issue on [GitHub](https://github.com/akhshyganesh/react-use-anywhere/issues)
