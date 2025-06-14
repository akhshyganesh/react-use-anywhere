# Contributing to React Hook Injection Pattern

We welcome contributions to the React Hook Injection Pattern library! This document provides guidelines for contributing.

## Development Setup

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/your-username/react-use-anywhere.git
   cd react-use-anywhere
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development**:
   ```bash
   npm run dev  # Starts the demo application
   ```

## Project Structure

```
├── lib/                 # Library source code
│   ├── components/      # React components
│   ├── hooks/          # Custom hooks
│   ├── services/       # Service classes and factories
│   ├── types.ts        # TypeScript definitions
│   └── index.ts        # Main exports
├── demo/               # Demo application
├── examples/           # Usage examples
├── test/              # Test files
└── docs/              # Documentation
```

## Development Workflow

### 1. Library Development

- **Source Code**: All library code goes in the `lib/` directory
- **Build**: `npm run build:lib` - Builds the library for distribution
- **Types**: TypeScript definitions are automatically generated

### 2. Demo Development

- **Source Code**: Demo code goes in the `demo/` directory
- **Development**: `npm run dev` - Starts the demo with hot reload
- **Build**: `npm run build:demo` - Builds the demo for production

### 3. Testing

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Export all public interfaces and types
- Provide comprehensive JSDoc comments
- Follow naming conventions:
  - `PascalCase` for classes, interfaces, types
  - `camelCase` for functions, variables
  - `SCREAMING_SNAKE_CASE` for constants

### React

- Use functional components with hooks
- Follow React best practices
- Ensure components are tree-shakeable
- Use proper prop types and default values

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write descriptive commit messages
- Add tests for all new features

## Pull Request Process

1. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**:
   - Write code following the standards above
   - Add or update tests as needed
   - Update documentation if required

3. **Test Your Changes**:
   ```bash
   npm run lint
   npm test
   npm run build:lib
   ```

4. **Commit and Push**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**:
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure all checks pass

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

## Release Process

1. **Version Bump**: Update version in `package.json`
2. **Update Changelog**: Add changes to `CHANGELOG.md`
3. **Build and Test**: Ensure all builds and tests pass
4. **Create Release**: Tag and create GitHub release
5. **Publish**: Publish to npm registry

## Questions and Support

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact maintainers directly for sensitive issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
